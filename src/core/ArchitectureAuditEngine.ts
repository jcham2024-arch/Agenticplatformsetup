/**
 * @file ArchitectureAuditEngine.ts
 * @description Catalog and evaluation engine for architectural audits, logical contradictions,
 * and implementation pitfalls identified across the Autonomous Agent Platform specifications.
 */

import { IAuditFlawReport } from '../types/framework.ts';

/**
 * Service providing the vetted architectural audit reports and remediation patterns.
 */
export class ArchitectureAuditEngine {
  private static reports: IAuditFlawReport[] = [
    {
      id: 'audit-01-lancedb-concurrency',
      category: 'Concurrency',
      title: 'LanceDB In-Process File-Lock Collisions in Multi-Worker Swarms',
      severity: 'Critical',
      affectedComponent: 'src/core/memory/lancedb_adapter.py & Execution Workers',
      underlyingFlaw: 'The specification advocates an embedded, in-process LanceDB Arrow vector store for sub-millisecond retrieval. However, when the Architect Brain dispatches multiple execution workers in parallel, concurrent in-process file writes to .agent/memory/lancedb_store/ trigger OS-level file locking collisions and silent write dropouts.',
      blastRadius: 'Corrupted episodic memory indices, worker crashes during parallel task commit, and lost failure taxonomy traces.',
      verifiedRemediation: 'Introduce an asynchronous Write Queue Coordinator or transactional lockfile guard around LanceDB table writes, delegating all worker memory commits through an EpisodicMemoryGatekeeper singleton with retry backoff.',
      codeSolutionSnippet: `class ThreadSafeLanceDBAdapter:
    def __init__(self, table_path: Path):
        self._lock = asyncio.Lock()
        self._table_path = table_path
        
    async def commit_embedding(self, record: MemoryRecord):
        async with self._lock:
            # Atomic transactional write with temporary staging buffer
            await self._table.add([record.to_arrow_dict()])`
    },
    {
      id: 'audit-02-gvisor-playwright-conflict',
      category: 'Sandboxing',
      title: 'gVisor Sentry System Call Interception Incompatibilities with Headless Playwright',
      severity: 'Critical',
      affectedComponent: 'src/sandbox/gvisor_runner.py & Crawl4AI Worker',
      underlyingFlaw: 'The security hardening blueprint specifies running all tasks inside gVisor (runsc) with cap_drop: ALL and disabled networking. However, Crawl4AI relies on Playwright Chromium, which requires specific shared memory (/dev/shm), sandbox flags (--no-sandbox), and specific Linux futex/madvise syscalls that runsc default configurations either terminate with SIGSYS or degrade to 10x slower execution.',
      blastRadius: 'Crawl4AI browser crashes on launch, hanging research tasks indefinitely inside the sandbox.',
      verifiedRemediation: 'Configure gVisor with an explicit --platform=ptrace or --platform=kvm flag, pass --disable-dev-shm-usage and --no-sandbox to Playwright Chromium launch options, and mount a 256MB tmpfs volume at /dev/shm.',
      codeSolutionSnippet: `HardenedSandboxExecutor:
  runtime: runsc
  tmpfs:
    /dev/shm: rw,exec,size=256m
    /workspace: rw,exec,nosuid,size=512m
  environment:
    PLAYWRIGHT_CHROMIUM_FLAGS: "--disable-dev-shm-usage --no-sandbox"`
    },
    {
      id: 'audit-03-cyclic-wiki-token-leak',
      category: 'Token Economics',
      title: 'Cyclic Wiki Link Reference Loops Causing Recursive Context Explosion',
      severity: 'Warning',
      affectedComponent: '.agent/rules/AGENTS.md & Tier 2/3 Wiki Markdown Files',
      underlyingFlaw: 'The progressive disclosure standard directs agents to read supplemental markdown files when encountering domain thresholds. However, if Tier 2 protocols reference each other (e.g. 01_architecture points to 04_verification, which points back to 01_architecture), recursive tool reads exhaust the 16k-32k working context in under 4 turns.',
      blastRadius: 'KV-cache attention dilution, prompt truncation, and lost task directives during complex refactors.',
      verifiedRemediation: 'Enforce a strict Directed Acyclic Graph (DAG) for all documentation links, where Tier 1 points only to Tier 2, Tier 2 points only down to Tier 3, and Tier 3 files have zero outgoing references. Run an automated DAG linter during build.',
      codeSolutionSnippet: `def assert_rule_graph_is_dag(rule_files: List[Path]):
    graph = build_dependency_graph(rule_files)
    cycles = list(networkx.simple_cycles(graph))
    if cycles:
        raise RuleGraphCycleError(f"Circular wiki link detected: {cycles}")`
    },
    {
      id: 'audit-04-mcp-path-traversal',
      category: 'Security & MCP',
      title: 'Model Context Protocol Filesystem Server Directory Traversal Risk',
      severity: 'Critical',
      affectedComponent: '.agent/mcp_config.json & @modelcontextprotocol/server-filesystem',
      underlyingFlaw: 'Configuring the MCP filesystem server with broad paths allows prompt-injected agents to execute relative path traversal (`../../etc/shadow` or `../../.ssh/id_rsa`), bypassing the intended `.agent/workspaces/` partition boundary.',
      blastRadius: 'Host credential exfiltration, source repository tampering, and breakout from cognitive partitions.',
      verifiedRemediation: 'Deploy an air-gapped `MCPPolicyInterceptor` middleware that resolves realpaths and rejects any filesystem operation whose canonical target falls outside the active agent\'s isolated workspace sandbox.',
      codeSolutionSnippet: `class MCPPolicyInterceptor:
    def sanitize_path(self, target_path: str, allowed_root: Path) -> Path:
        resolved = Path(target_path).resolve()
        if not resolved.is_relative_to(allowed_root.resolve()):
            raise SecurityViolationError(f"Access to {resolved} outside {allowed_root} forbidden")
        return resolved`
    },
    {
      id: 'audit-05-tree-sitter-macro-slicing',
      category: 'AST Slicing',
      title: 'Tree-Sitter Concrete Syntax Tree Span Invalidation During Multi-Site Edits',
      severity: 'Warning',
      affectedComponent: 'src/core/tree_sitter_navigator.py',
      underlyingFlaw: 'Using Tree-sitter byte offsets to selectively patch symbols works for single functions, but after applying the first patch, subsequent byte offsets in the same file become invalidated, causing subsequent symbol edits to overwrite incorrect code spans.',
      blastRadius: 'Syntax corruption, severed class declarations, and broken source files requiring emergency rollback.',
      verifiedRemediation: 'Sort multi-site symbol edits in descending order by byte offset (bottom-up patching) so earlier offsets in the document remain unaffected by subsequent replacements, or re-parse the CST between atomic edits.',
      codeSolutionSnippet: `def apply_symbol_patches(source_code: str, edits: List[SymbolEdit]) -> str:
    # Sort edits descending by start byte to preserve earlier offsets
    sorted_edits = sorted(edits, key=lambda e: e.start_byte, reverse=True)
    for edit in sorted_edits:
        source_code = source_code[:edit.start_byte] + edit.new_text + source_code[edit.end_byte:]
    return source_code`
    },
    {
      id: 'audit-06-searxng-rate-limit-lockout',
      category: 'Scraping',
      title: 'SearXNG Default Bot-Limiter Blocking Multi-Agent Concurrent Queries',
      severity: 'Optimization',
      affectedComponent: 'infra/searxng/docker-compose.yaml & settings.yml',
      underlyingFlaw: 'Default SearXNG installations enable a strict query rate limiter. When multiple parallel agent research workers query localhost:8080 simultaneously, SearXNG returns HTTP 429 Too Many Requests, stalling research pipelines.',
      blastRadius: 'Research worker timeouts, failed external foraging, and degraded code generation accuracy.',
      verifiedRemediation: 'Mount a custom `settings.yml` into SearXNG explicitly setting `server.limiter: false` and enabling JSON output format (`search.formats: [html, json]`).',
      codeSolutionSnippet: `# settings.yml for isolated agent SearXNG
server:
  limiter: false
  secret_key: "agentforge-insecure-local-only"
search:
  formats:
    - html
    - json`
    }
  ];

  public static getReports(): IAuditFlawReport[] {
    return ArchitectureAuditEngine.reports;
  }
}
