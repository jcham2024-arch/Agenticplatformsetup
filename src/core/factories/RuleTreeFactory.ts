/**
 * @file RuleTreeFactory.ts
 * @description Factory class for synthesizing progressive disclosure rule trees.
 * Produces immutable Tier 1 root charters (<150 lines), Tier 2 domain protocols (<200 lines),
 * and Tier 3 task SOPs, dynamically rendering link formats for Obsidian or POSIX Markdown.
 */

import { IGeneratedFile, KnowledgeFormat } from '../../types/framework.ts';

/**
 * Interface defining rule synthesis capabilities.
 */
export interface IRuleTreeFactory {
  createTier1RootRule(knowledgeFormat: KnowledgeFormat): IGeneratedFile;
  createTier2DomainProtocols(knowledgeFormat: KnowledgeFormat): IGeneratedFile[];
  createTier3TaskSops(knowledgeFormat: KnowledgeFormat): IGeneratedFile[];
  compileAllRules(knowledgeFormat: KnowledgeFormat): IGeneratedFile[];
}

/**
 * Factory class responsible for compiling strictly compliant, high-entropy rule files.
 */
export class RuleTreeFactory implements IRuleTreeFactory {
  /**
   * Helper method to format wiki-links or standard POSIX relative markdown links.
   */
  private formatLink(title: string, relativePath: string, knowledgeFormat: KnowledgeFormat): string {
    if (knowledgeFormat === 'obsidian') {
      return `[[${relativePath}]]`;
    }
    return `[${title}](${relativePath.startsWith('.') ? relativePath : `./${relativePath}`})`;
  }

  /**
   * Synthesizes the Tier 1 Root Kernel Rule file (`AGENTS.md`), strictly under 150 lines.
   */
  public createTier1RootRule(knowledgeFormat: KnowledgeFormat): IGeneratedFile {
    const lArch = this.formatLink('System Architecture & Boundaries', '.agent/wiki/01_architecture.md', knowledgeFormat);
    const lPlan = this.formatLink('Cognitive Planning & Task DAGs', '.agent/wiki/02_planning_protocol.md', knowledgeFormat);
    const lEng = this.formatLink('OOP Engineering & Typing Standards', '.agent/wiki/03_engineering_standards.md', knowledgeFormat);
    const lVer = this.formatLink('Deterministic Review & Testing Gates', '.agent/wiki/04_verification_protocol.md', knowledgeFormat);
    const lMem = this.formatLink('Context Budgeting & Memory Engine', '.agent/wiki/05_persistence_and_memory.md', knowledgeFormat);

    const lDb = this.formatLink('Database DDL & Schema Changes', '.agent/wiki/tasks/database_migrations.md', knowledgeFormat);
    const lDep = this.formatLink('Dependency Installs & Upgrades', '.agent/wiki/tasks/dependency_management.md', knowledgeFormat);
    const lRef = this.formatLink('Large-scale Refactoring', '.agent/wiki/tasks/subsystem_refactor.md', knowledgeFormat);
    const lSec = this.formatLink('Sandboxing & Command Execution', '.agent/wiki/tasks/security_and_sandbox.md', knowledgeFormat);
    const lPost = this.formatLink('Error Recovery & Bug Triage', '.agent/wiki/tasks/incident_postmortem.md', knowledgeFormat);
    const lCrawl = this.formatLink('Headless Crawling & DOM Pruning', '.agent/wiki/tasks/browser_crawling_sop.md', knowledgeFormat);
    const lAst = this.formatLink('Tree-sitter AST & Byte Patching', '.agent/wiki/tasks/ast_slicing_sop.md', knowledgeFormat);
    const lMcp = this.formatLink('MCP Tool Calling & Realpath Jail', '.agent/wiki/tasks/mcp_integration_sop.md', knowledgeFormat);

    const content = `# AGENT OPERATING CHARTER (KERNEL RULES)
<!-- Target: AGENTS.md | Line Budget: <= 150 lines | Status: Immutable Base Standard -->

## 1. IDENTITY & GOVERNANCE MODEL
You are an autonomous agent node operating inside the Hierarchical Multi-Agent Platform (H-MAP).
Execution is governed by the Brain Triumvirate (Architect, Critic, Evolution). Do not guess conventions or mutate code speculatively.

## 2. NAVIGATION INDEX & SYSTEM PROTOCOLS
You MUST consult and read domain-specific protocols via file reading tools before initiating actions:
- System Architecture & Boundaries      -> ${lArch}
- Cognitive Planning & Task DAGs       -> ${lPlan}
- OOP Engineering & Typing Standards   -> ${lEng}
- Deterministic Review & Testing Gates -> ${lVer}
- Context Budgeting & Memory Engine    -> ${lMem}

## 3. SPECIALIZED TASK DIRECTIVES (LAZY-LOADED)
For high-risk operations, strictly follow the relevant SOP before calling mutation tools:
- Database DDL & Schema Changes       -> ${lDb}
- Dependency Installs & Upgrades       -> ${lDep}
- Large-scale Refactoring              -> ${lRef}
- Sandboxing & Command Execution       -> ${lSec}
- Error Recovery & Bug Triage          -> ${lPost}
- Headless Crawling & DOM Pruning      -> ${lCrawl}
- Tree-sitter AST & Byte Patching      -> ${lAst}
- MCP Tool Calling & Realpath Jail     -> ${lMcp}

## 4. WORKSPACE PARTITIONING & ISOLATION INVARIANTS
All multi-turn work must respect the physical directory boundaries:
- Thinking & DAG state MUST reside in \`.agent/workspaces/thinking/\`
- Raw research dumps & API digests MUST reside in \`.agent/workspaces/research/\`
- Unverified code modifications MUST reside in \`.agent/workspaces/code_staging/\`
- Review reports & test outputs MUST reside in \`.agent/workspaces/review_gates/\`

## 5. HARD OPERATIONAL INVARIANTS
1. Deterministic Verification: No task is complete without automated test evidence in the sandbox.
2. AST-First File Inspection: Never dump full files > 100 lines into context. Use Tree-sitter symbol queries.
3. Zero Placeholders: Omission of implementation (\`TODO\`, \`pass\`, \`...\`) is strictly prohibited.
4. Fail-Fast Escalation: After 3 consecutive failed verification loops, halt and log to \`.agent/workspaces/thinking/scratchpad.md\`.
5. Strict Immutability: The base framework contracts and root rules cannot be altered by execution subagents.`;

    const lines = content.split('\n').length;
    return {
      path: '.agent/rules/AGENTS.md',
      content,
      description: 'Tier 1 Ambient Kernel Charter governing universal invariants and progressive disclosure routing.',
      isImmutableBase: true,
      lineCount: lines,
      tokenEstimate: Math.round(content.length / 3.8)
    };
  }

  /**
   * Synthesizes Tier 2 Domain Protocols (01 through 05), each strictly under 200 lines.
   */
  public createTier2DomainProtocols(knowledgeFormat: KnowledgeFormat): IGeneratedFile[] {
    const p1 = `# PROTOCOL 01: ARCHITECTURE & COMPONENT BOUNDARIES
<!-- Line Budget: <= 200 lines | Category: Tier 2 Domain Specification -->

## 1. ABSTRACT BASE CONTRACTS
All agent subsystems inherit from decoupled abstract base classes in \`src/core/\`:
- \`BaseAgent\`: State machine lifecycle, identity, telemetry emission, and token tracker.
- \`BrainAgent\`: Goal decomposition, task DAG formulation, and worker ticket dispatching.
- \`ExecutionWorker\`: Stateless task execution within isolated gVisor container partitions.

## 2. BLACKBOARD COMMUNICATION SPECIFICATION
Agents communicate exclusively via the thread-safe Blackboard object:
\`\`\`json
{
  "task_id": "UUID-v4",
  "issuer": "StrategicArchitectBrain",
  "assigned_to": "CodeEngineeringWorker",
  "context_slice": "Only relevant AST symbols and constraint tokens",
  "input_artifacts": [".agent/workspaces/code_staging/patch_v1.diff"],
  "expected_artifacts": [".agent/workspaces/review_gates/test_report.json"]
}
\`\`\`

## 3. ZERO CONVERSATIONAL CONTAMINATION
Workers do NOT share conversational chat histories. Every task ticket is an atomic contract.`;

    const p2 = `# PROTOCOL 02: PLANNING & COGNITIVE TASK DECONSTRUCTION
<!-- Line Budget: <= 200 lines | Category: Tier 2 Domain Specification -->

## 1. COMPLEXITY CLASSIFICATION
- Tier A (Trivial): Single file modification, zero interface alterations. Proceed directly with localized test and change.
- Tier B (Structural): Multiple files, new class hierarchies, or interface shifts. Mandatory DAG planning required.

## 2. DIRECTED ACYCLIC GRAPH (DAG) GENERATION
Before executing code mutations on Tier B tasks, emit an atomic task DAG to \`.agent/workspaces/thinking/active_dag.json\`.
Each node must specify:
1. Target AST symbols or file paths.
2. Acceptance criteria and test command.
3. Rollback baseline commit.

## 3. TREE-OF-THOUGHT BACKTRACKING
If an intermediate node in the DAG fails verification twice, backtrack to the last known green branch rather than attempting additive monkey patches.`;

    const p3 = `# PROTOCOL 03: OOP ENGINEERING & TYPING STANDARDS
<!-- Line Budget: <= 200 lines | Category: Tier 2 Domain Specification -->

## 1. OBJECT-ORIENTED DISCIPLINE
- Rely on Abstract Base Classes (ABCs) or typed interfaces.
- Inject dependencies via constructors; reject global variables and unchecked singletons.
- Classes exceeding 300 lines must be systematically evaluated for single-responsibility decomposition.

## 2. ZERO-TOLERANCE TYPE INTEGRITY
- Enforce strict static type checking (strict mode enabled).
- Dynamic escape hatches (\`Any\`, \`unknown\`, \`Object\`) are strictly forbidden unless wrapping untyped external C-bindings.

## 3. ERROR HIERARCHY
- Throw typed domain exceptions inheriting from \`AgentPlatformError\`.
- Catch specific expected exceptions; never use blanket suppressors (\`except:\` or \`catch (e) {}\`).`;

    const p4 = `# PROTOCOL 04: DETERMINISTIC VERIFICATION & REVIEW GATES
<!-- Line Budget: <= 200 lines | Category: Tier 2 Domain Specification -->

## 1. THE DETERMINISTIC VERIFICATION LOOP
Every worker modification must complete this state transition:
\`\`\`
[STAGING PATCH] -> [AST LINT (Ruff/TS)] -> [SANDBOX TEST RUN] -> [CRITIC SIGN-OFF]
\`\`\`

## 2. SANDBOX EXECUTION ISOLATION
All test suites, compiler invocations, and script runs must be dispatched into the container sandbox.
- Never run untrusted code on the host root operating system.
- Inspect exit codes and structured JSON test output.

## 3. CRITIC GATE CRITERIA
The Critic Brain rejects any patch containing:
- Commented-out test cases.
- Omitted implementations (\`// TODO\`, \`pass\`, \`...\`).
- Diff sprawl touching files outside the assigned task contract slice.`;

    const p5 = `# PROTOCOL 05: PERSISTENCE, MEMORY & KV-CACHE BUDGETING
<!-- Line Budget: <= 200 lines | Category: Tier 2 Domain Specification -->

## 1. CONTEXT AS A LEAN CURRENCY
Maintain KV-cache prefix stability:
- Static, immutable rules and tool definitions must remain at the prompt header.
- Dynamic task slices, AST diffs, and scratchpad memory occupy the suffix.

## 2. TWO-PHASE EPISODIC COMMIT
Memories discovered during task execution follow:
\`\`\`
[SHORT-TERM BUFFER] -> [HEURISTIC SCRUB] -> [VERIFICATION CONFIRM] -> [ARROW COMMIT]
\`\`\`
Never commit unverified tool hallucinations directly into long-term vector storage.

## 3. AST SKELETONIZATION
When inspecting 500+ line modules, generate a typed interface skeleton (\`.pyi\` or \`.d.ts\` style) to capture class shape in <200 tokens.`;

    const protocols = [
      { path: '.agent/wiki/01_architecture.md', content: p1, title: 'Architecture Protocol' },
      { path: '.agent/wiki/02_planning_protocol.md', content: p2, title: 'Planning Protocol' },
      { path: '.agent/wiki/03_engineering_standards.md', content: p3, title: 'Engineering Standards' },
      { path: '.agent/wiki/04_verification_protocol.md', content: p4, title: 'Verification Protocol' },
      { path: '.agent/wiki/05_persistence_and_memory.md', content: p5, title: 'Persistence and Memory' }
    ];

    return protocols.map(p => ({
      path: p.path,
      content: p.content,
      description: `Tier 2 Domain Protocol: ${p.title}`,
      isImmutableBase: true,
      lineCount: p.content.split('\n').length,
      tokenEstimate: Math.round(p.content.length / 3.8)
    }));
  }

  /**
   * Synthesizes Tier 3 Task SOPs, each strictly under 200 lines.
   */
  public createTier3TaskSops(knowledgeFormat: KnowledgeFormat): IGeneratedFile[] {
    const s1 = `# TASK SOP: DATABASE MIGRATIONS & SCHEMA INTEGRITY
<!-- Line Budget: <= 200 lines | Category: Tier 3 Specialized Directive -->

## 1. PRE-EXECUTION CHECKLIST
1. Introspect existing schema using \`SchemaInspector\` tool.
2. Author reversible forward (\`up\`) and rollback (\`down\`) migration scripts.
3. Execute dry-run against the local containerized database instance.

## 2. INVARIANTS
- Direct execution of non-reversible DDL on primary stores is strictly forbidden.
- Verify index additions do not trigger whole-table locks during active traffic.`;

    const s2 = `# TASK SOP: DEPENDENCY MANAGEMENT & SECURITY AUDIT
<!-- Line Budget: <= 200 lines | Category: Tier 3 Specialized Directive -->

## 1. VULNERABILITY AUDITING
Before installing or updating any package:
1. Run security vulnerability scanners (\`pip-audit\`, \`npm audit\`).
2. Audit package license compatibility (permissive MIT/Apache-2.0 preferred).
3. Regenerate lockfiles deterministically (\`uv.lock\` or \`package-lock.json\`).

## 2. REGRESSION DETECTION
Run full suite regression tests to ensure zero breaking transitive API shifts.`;

    const s3 = `# TASK SOP: SUBSYSTEM REFACTORING & BREAKING CHANGES
<!-- Line Budget: <= 200 lines | Category: Tier 3 Specialized Directive -->

## 1. CALL-SITE TRACING
Use Tree-sitter to identify all caller references before altering abstract interface signatures.

## 2. PHASED DEPRECATION
1. Introduce new typed interface.
2. Mark deprecated interface with explicit warning decorator.
3. Migrate callers incrementally across atomic test passes.`;

    const s4 = `# TASK SOP: SECURITY & CONTAINER SANDBOX BOUNDARIES
<!-- Line Budget: <= 200 lines | Category: Tier 3 Specialized Directive -->

## 1. CONTAINER BOUNDARIES
- Runtime: Enforce gVisor (\`runsc\`) user-space kernel virtualization.
- Permissions: Drop all Linux capabilities (\`cap_drop: ALL\`).
- Filesystem: Immutable read-only root; writable memory confined to \`/tmp\` and \`/workspace\` tmpfs.
- Egress: Outbound network blocked by default (\`network_mode: none\`).`;

    const s5 = `# TASK SOP: INCIDENT POST-MORTEM & ERROR TAXONOMY
<!-- Line Budget: <= 200 lines | Category: Tier 3 Specialized Directive -->

## 1. MANDATORY REPRODUCTION HARNESS
Never modify production source files to fix a bug until a reproduction test script is authored and verified to FAIL with the reported symptom.

## 2. POST-MORTEM RECORDING
Log root-cause analysis (RCA) and mitigation guardrails to \`.agent/memory/episodic_failures.parquet\`.`;

    const s6 = `# TASK SOP: HEADLESS BROWSER CRAWLING & DOM PRUNING
<!-- Line Budget: <= 200 lines | Category: Tier 3 Specialized Directive -->

## 1. RUNTIME CONFIGURATION
- Use Crawl4AI / Playwright inside isolated container with \`--shm-size=256m\`.
- Pass mandatory flags: \`--no-sandbox\`, \`--disable-dev-shm-usage\`, and \`--disable-gpu\`.

## 2. DOM PRUNING PIPELINE
- Strip all \`<script>\`, \`<style>\`, \`<svg>\`, and \`data:image/...\` base64 strings before tokenization.
- Convert sanitized semantic tags into clean Markdown headings and tables.
- Achieve minimum 85% token reduction compared to raw HTML before passing to reasoning models.`;

    const s7 = `# TASK SOP: TREE-SITTER AST PARSING & CODE MUTATION
<!-- Line Budget: <= 200 lines | Category: Tier 3 Specialized Directive -->

## 1. SYMBOL QUERYING OVER FILE DUMPS
- Never dump entire source files exceeding 100 lines into context.
- Query targeted function, class, or method symbol ranges via Tree-sitter CST queries.

## 2. BOTTOM-UP DESCENDING BYTE PATCHING (CRITICAL)
- When applying multi-hunk edits to a single file, sort all patches in descending order of \`startByte\` ($s_n \\ge s_{n-1} \\ge \\dots \\ge s_0$).
- Splicing from bottom to top guarantees that subsequent byte offsets are not shifted or corrupted by earlier insertions or deletions.`;

    const s8 = `# TASK SOP: MODEL CONTEXT PROTOCOL (MCP) INTERACTION
<!-- Line Budget: <= 200 lines | Category: Tier 3 Specialized Directive -->

## 1. AIR-GAPPED REALPATH CONTAINMENT
- All filesystem tool paths must be resolved through \`McpPathPolicyFilter\`.
- Real candidate paths must be verified with \`toRealPath()\` to strictly reside within the canonical workspace root.
- Immediate \`SecurityException\` is thrown on any \`..\` or symlink escape attempt.

## 2. LEAN STDIO JSON-RPC EXECUTION
- Maintain persistent stdio process pipes for MCP servers.
- Validate incoming responses against JSON Schema definitions prior to memory ingestion.`;

    const sops = [
      { path: '.agent/wiki/tasks/database_migrations.md', content: s1, title: 'Database Migrations' },
      { path: '.agent/wiki/tasks/dependency_management.md', content: s2, title: 'Dependency Management' },
      { path: '.agent/wiki/tasks/subsystem_refactor.md', content: s3, title: 'Subsystem Refactoring' },
      { path: '.agent/wiki/tasks/security_and_sandbox.md', content: s4, title: 'Security and Sandbox' },
      { path: '.agent/wiki/tasks/incident_postmortem.md', content: s5, title: 'Incident Post-Mortem' },
      { path: '.agent/wiki/tasks/browser_crawling_sop.md', content: s6, title: 'Browser Crawling & Pruning' },
      { path: '.agent/wiki/tasks/ast_slicing_sop.md', content: s7, title: 'AST Parsing & Byte Patching' },
      { path: '.agent/wiki/tasks/mcp_integration_sop.md', content: s8, title: 'MCP Tool Integration & Jail' }
    ];

    return sops.map(s => ({
      path: s.path,
      content: s.content,
      description: `Tier 3 Task SOP: ${s.title}`,
      isImmutableBase: true,
      lineCount: s.content.split('\n').length,
      tokenEstimate: Math.round(s.content.length / 3.8)
    }));
  }

  /**
   * Compiles the complete suite of 11 verified rule files.
   */
  public compileAllRules(knowledgeFormat: KnowledgeFormat): IGeneratedFile[] {
    return [
      this.createTier1RootRule(knowledgeFormat),
      ...this.createTier2DomainProtocols(knowledgeFormat),
      ...this.createTier3TaskSops(knowledgeFormat)
    ];
  }
}
