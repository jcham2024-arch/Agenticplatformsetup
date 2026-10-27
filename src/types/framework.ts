/**
 * @file framework.ts
 * @description Core TypeScript contracts, interfaces, and domain types for the
 * AgentForge Autonomous Hierarchical Multi-Agent Platform (H-MAP).
 * Enforces strict typing across all modular components, OOP factories,
 * dynamic registries, and synthetic diagnostic suites.
 */

/**
 * Supported Vector Database and episodic memory backends.
 */
export type MemoryBackend =
  | 'lancedb'
  | 'qdrant'
  | 'chroma'
  | 'pgvector'
  | 'mem0'
  | 'none';

/**
 * Supported Web Scraping and documentation extraction engines.
 */
export type ScraperBackend =
  | 'crawl4ai'
  | 'browser_use'
  | 'firecrawl'
  | 'beautifulsoup'
  | 'none';

/**
 * Supported Search Engine backends.
 */
export type SearchBackend =
  | 'searxng'
  | 'duckduckgo'
  | 'brave'
  | 'google_custom'
  | 'none';

/**
 * Supported AST concrete syntax parsing and static analysis tools.
 */
export type AstTool =
  | 'treesitter'
  | 'ast_grep'
  | 'semgrep'
  | 'ruff_biome'
  | 'python_ast';

/**
 * Supported execution isolation and sandbox virtualization runtimes.
 */
export type SandboxRuntime =
  | 'gvisor'
  | 'docker'
  | 'e2b'
  | 'local_uv';

/**
 * Supported Knowledge Base authoring and rule navigation formats.
 */
export type KnowledgeFormat =
  | 'obsidian'
  | 'posix_markdown'
  | 'foam_dendron'
  | 'logseq'
  | 'single_file';

/**
 * Supported Agent IDE & Editor compatibility anchors.
 */
export type IdeAnchor =
  | 'claude_code'
  | 'cline_roo'
  | 'cursor_mdc'
  | 'aider'
  | 'open_agents';

/**
 * Supported LLM Provider integrations.
 */
export type LLMProviderId =
  | 'gemini'
  | 'anthropic'
  | 'openai'
  | 'ollama'
  | 'groq'
  | 'custom';

/**
 * Installation Profile identifier.
 */
export type InstallationProfile = 'gold_standard' | 'custom';

/**
 * Module selection state representing the user's custom or preset configuration.
 */
export interface IModuleSelections {
  /** Selected Vector Database and episodic memory store */
  memory: MemoryBackend;
  /** Selected Web Scraping / Research engine */
  scraper: ScraperBackend;
  /** Selected Search Backend */
  search: SearchBackend;
  /** Selected AST code analysis and parsing tool */
  ast: AstTool;
  /** Selected Sandbox runtime */
  sandbox: SandboxRuntime;
  /** Selected Knowledge base and rule link syntax */
  knowledge: KnowledgeFormat;
  /** Selected IDE integration anchors */
  ideAnchors: IdeAnchor[];
  /** Active primary LLM provider */
  primaryProvider: LLMProviderId;
  /** Multi-agent governance tier */
  governance: 'triumvirate' | 'duo' | 'single';
}

/**
 * Complete Workspace Configuration state.
 */
export interface IWorkspaceConfig {
  /** Target project name */
  projectName: string;
  /** Target installation directory path */
  targetDirectory: string;
  /** Active installation profile */
  profile: InstallationProfile;
  /** Granular module selections */
  modules: IModuleSelections;
  /** Whether to enforce strict 150/200 line limits in synthesized rules */
  enforceLineLimits: boolean;
  /** Whether to include self-hosted auxiliary docker-compose file */
  includeDockerCompose: boolean;
}

/**
 * Model descriptor representing a registered LLM and its specific architectural strengths.
 */
export interface IModelDescriptor {
  /** Unique model identifier (e.g., 'gemini-4-argon', 'claude-3-7-sonnet') */
  id: string;
  /** Human-readable display label */
  displayName: string;
  /** Provider ID */
  provider: LLMProviderId;
  /** Primary cognitive specialty (e.g. 'Deep Structural Reasoning', 'High-Speed Linting') */
  specialty: string;
  /** Recommended task tier: 'complex_reasoning' | 'general_synthesis' | 'fast_lookup' */
  tier: 'complex_reasoning' | 'general_synthesis' | 'fast_lookup';
  /** Max context window tokens */
  contextWindow: number;
  /** Speed / latency score (1-10) */
  speedScore: number;
  /** Reasoning / IQ score (1-10) */
  reasoningScore: number;
  /** Whether this model requires a paid API tier */
  isPaidModel: boolean;
  /** Description of best-fit engineering tasks */
  description: string;
}

/**
 * Provider descriptor representing a supported LLM service.
 */
export interface ILLMProvider {
  /** Unique provider key */
  id: LLMProviderId;
  /** Display name */
  name: string;
  /** Base API endpoint URL */
  baseUrl: string;
  /** Protocol type */
  protocol: 'native_sdk' | 'openai_compatible' | 'anthropic_sdk';
  /** Models registered under this provider */
  models: IModelDescriptor[];
  /** Status */
  status: 'active' | 'configured' | 'available';
}

/**
 * Modular Skill descriptor.
 */
export interface ISkillDescriptor {
  /** Unique skill ID */
  id: string;
  /** Display title */
  name: string;
  /** Category */
  category: 'planning' | 'research' | 'coding' | 'persistence' | 'security';
  /** Summary of capability */
  summary: string;
  /** Model Context Protocol tool name */
  mcpToolName: string;
  /** Estimated token budget overhead per turn */
  tokenCostPerCall: number;
  /** Python module source target */
  sourcePath: string;
}

/**
 * Generated file representation.
 */
export interface IGeneratedFile {
  /** Relative workspace path (e.g., '.agent/rules/AGENTS.md') */
  path: string;
  /** File content string */
  content: string;
  /** Purpose description */
  description: string;
  /** Whether this file is part of the immutable base architecture */
  isImmutableBase: boolean;
  /** Line count */
  lineCount: number;
  /** BPE token estimate */
  tokenEstimate: number;
}

/**
 * Manifest containing all generated files and bootstrap scripts.
 */
export interface IWorkspaceManifest {
  config: IWorkspaceConfig;
  files: IGeneratedFile[];
  bootstrapBashScript: string;
  pythonInitScript: string;
  mcpConfigJson: string;
  pyprojectToml: string;
  dockerComposeYaml: string | null;
  totalFiles: number;
  totalLines: number;
  totalTokens: number;
}

/**
 * Subagent task contract.
 */
export interface ITaskContract {
  taskId: string;
  issuerAgent: string;
  assignedToRole: 'CodeEngineer' | 'WebResearcher' | 'DataEngineer' | 'SecurityQA';
  goalDescription: string;
  contextSlice: string;
  inputArtifacts: string[];
  expectedArtifacts: string[];
  timeoutSeconds: number;
  assignedModelId: string;
}

/**
 * Subagent instance representation.
 */
export interface ISubagentInstance {
  instanceId: string;
  role: string;
  assignedModel: string;
  workspacePath: string;
  status: 'idle' | 'executing' | 'verifying' | 'completed' | 'escalated';
  currentTask?: ITaskContract;
  isolatedPartitions: {
    thinking: string;
    research: string;
    codeStaging: string;
    reviewGates: string;
  };
  mountedResources: string[];
  createdAt: string;
}

/**
 * Synthetic test result.
 */
export interface ISyntheticTestResult {
  testId: string;
  testName: string;
  targetSubsystem: string;
  procedure: string;
  status: 'passed' | 'warning' | 'failed' | 'skipped';
  executionTimeMs: number;
  diagnosticOutput: string;
}

/**
 * Complete health audit report.
 */
export interface IHealthReport {
  timestamp: string;
  overallStatus: 'healthy' | 'warnings' | 'critical';
  passedCount: number;
  totalCount: number;
  tests: ISyntheticTestResult[];
  remediationSuggestions: string[];
}

/**
 * Rule Graph Node for visual navigation.
 */
export interface IRuleGraphNode {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  path: string;
  lineCount: number;
  maxLineBudget: number;
  description: string;
  isCompliant: boolean;
  outgoingLinks: string[];
  incomingLinks: string[];
}

/**
 * Architectural flaw report item from documentation review.
 */
export interface IAuditFlawReport {
  id: string;
  category: 'Concurrency' | 'Sandboxing' | 'Token Economics' | 'AST Slicing' | 'Security & MCP' | 'Scraping';
  title: string;
  severity: 'Critical' | 'Warning' | 'Optimization';
  affectedComponent: string;
  underlyingFlaw: string;
  blastRadius: string;
  verifiedRemediation: string;
  codeSolutionSnippet: string;
}
