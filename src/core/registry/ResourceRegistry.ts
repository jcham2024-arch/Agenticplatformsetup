/**
 * @file ResourceRegistry.ts
 * @description Extensible Object-Oriented Resource and Provider Registry for the
 * AgentForge Autonomous Framework. Manages active LLM providers, model specialties,
 * capability ratings, and dynamic runtime discovery.
 */

import {
  ILLMProvider,
  IModelDescriptor,
  ISkillDescriptor,
  LLMProviderId
} from '../../types/framework.ts';

/**
 * Interface defining operations for the Resource Registry.
 */
export interface IResourceRegistry {
  getProviders(): ILLMProvider[];
  getProvider(id: LLMProviderId): ILLMProvider | undefined;
  getModels(): IModelDescriptor[];
  getModel(id: string): IModelDescriptor | undefined;
  getModelsByTier(tier: 'complex_reasoning' | 'general_synthesis' | 'fast_lookup'): IModelDescriptor[];
  getSkills(): ISkillDescriptor[];
  registerModel(model: IModelDescriptor): void;
  registerProvider(provider: ILLMProvider): void;
  registerSkill(skill: ISkillDescriptor): void;
  matchModelForTask(taskType: string, complexity: 'high' | 'medium' | 'low'): IModelDescriptor;
}

/**
 * Singleton service implementing the extensible Resource & Provider Registry.
 */
export class ResourceRegistry implements IResourceRegistry {
  private static instance: ResourceRegistry;

  private providers: Map<LLMProviderId, ILLMProvider> = new Map();
  private models: Map<string, IModelDescriptor> = new Map();
  private skills: Map<string, ISkillDescriptor> = new Map();

  /**
   * Protected constructor initializing the baseline standard catalog.
   */
  private constructor() {
    this.seedDefaultProvidersAndModels();
    this.seedDefaultSkills();
  }

  /**
   * Obtains the global singleton instance.
   */
  public static getInstance(): ResourceRegistry {
    if (!ResourceRegistry.instance) {
      ResourceRegistry.instance = new ResourceRegistry();
    }
    return ResourceRegistry.instance;
  }

  /**
   * Seeds the default vetted providers and 2026 model catalog.
   */
  private seedDefaultProvidersAndModels(): void {
    const geminiModels: IModelDescriptor[] = [
      {
        id: 'gemini-4-argon',
        displayName: 'Gemini 4 Argon (Flagship Reasoning)',
        provider: 'gemini',
        specialty: 'Ultra-Deep System Architecture, AST Concurrency & Security Exploits',
        tier: 'complex_reasoning',
        contextWindow: 1048576,
        speedScore: 7,
        reasoningScore: 10,
        isPaidModel: true,
        description: 'Elite cognitive reasoning engine designed for multi-module refactoring and security theorem proving.'
      },
      {
        id: 'gemini-3.8-flash',
        displayName: 'Gemini 3.8 Flash (General Systems Workhorse)',
        provider: 'gemini',
        specialty: 'Full-Stack Scaffolding, Wiki Rule Synthesis & SOP Validation',
        tier: 'general_synthesis',
        contextWindow: 1048576,
        speedScore: 9,
        reasoningScore: 8.5,
        isPaidModel: false,
        description: 'Balanced high-velocity model providing rich architectural synthesis with minimal latency.'
      },
      {
        id: 'gemini-3.1-flash-lite',
        displayName: 'Gemini 3.1 Flash-Lite (Instant Tool Executor)',
        provider: 'gemini',
        specialty: 'Sub-Second AST Linting, Rule Token Counter & Schema Verification',
        tier: 'fast_lookup',
        contextWindow: 524288,
        speedScore: 10,
        reasoningScore: 7.5,
        isPaidModel: false,
        description: 'Ultra-low latency micro-model ideal for high-frequency tool loops and deterministic status gates.'
      }
    ];

    const anthropicModels: IModelDescriptor[] = [
      {
        id: 'claude-3-7-sonnet',
        displayName: 'Claude 3.7 Sonnet (Hybrid Thinking)',
        provider: 'anthropic',
        specialty: 'Terminal Agent Code Editing & CLAUDE.md Native Hooking',
        tier: 'complex_reasoning',
        contextWindow: 200000,
        speedScore: 8,
        reasoningScore: 9.8,
        isPaidModel: true,
        description: 'State-of-the-art software engineering agent model with extended thinking mode.'
      },
      {
        id: 'claude-3-5-haiku',
        displayName: 'Claude 3.5 Haiku',
        provider: 'anthropic',
        specialty: 'Fast Semantic Parsing & Context Compaction',
        tier: 'fast_lookup',
        contextWindow: 200000,
        speedScore: 9.5,
        reasoningScore: 8,
        isPaidModel: true,
        description: 'Lightweight agent execution worker for targeted file reads.'
      }
    ];

    const openaiModels: IModelDescriptor[] = [
      {
        id: 'o3-mini',
        displayName: 'OpenAI o3-mini',
        provider: 'openai',
        specialty: 'Competitive STEM Reasoning & Algorithmic Optimizations',
        tier: 'complex_reasoning',
        contextWindow: 200000,
        speedScore: 8.5,
        reasoningScore: 9.5,
        isPaidModel: true,
        description: 'High-reasoning math and concurrency optimization specialist.'
      },
      {
        id: 'gpt-4.5',
        displayName: 'OpenAI GPT-4.5',
        provider: 'openai',
        specialty: 'Nuanced System Instruction Adherence & Documentation Review',
        tier: 'general_synthesis',
        contextWindow: 128000,
        speedScore: 7.5,
        reasoningScore: 9.2,
        isPaidModel: true,
        description: 'General architectural synthesis with world knowledge depth.'
      }
    ];

    const groqModels: IModelDescriptor[] = [
      {
        id: 'llama-3.3-70b-groq',
        displayName: 'Llama 3.3 70B (Groq LPU)',
        provider: 'groq',
        specialty: 'Sub-100ms Tool Execution & Fast Status Checks',
        tier: 'fast_lookup',
        contextWindow: 128000,
        speedScore: 10,
        reasoningScore: 8.2,
        isPaidModel: true,
        description: 'Ultra-fast LPU inference enabling real-time agent loops without human waiting.'
      }
    ];

    const ollamaModels: IModelDescriptor[] = [
      {
        id: 'deepseek-r1-local',
        displayName: 'DeepSeek R1 (Local Ollama / vLLM)',
        provider: 'ollama',
        specialty: 'Air-Gapped Private Reasoning & Offline Verification',
        tier: 'complex_reasoning',
        contextWindow: 64000,
        speedScore: 6,
        reasoningScore: 9.4,
        isPaidModel: false,
        description: 'Fully offline local reasoning model for zero-egress environments.'
      }
    ];

    // Register Google Gemini Provider
    this.registerProvider({
      id: 'gemini',
      name: 'Google Gemini (Native Ecosystem)',
      baseUrl: 'https://generativelanguage.googleapis.com',
      protocol: 'native_sdk',
      models: geminiModels,
      status: 'active'
    });

    // Register Anthropic Provider
    this.registerProvider({
      id: 'anthropic',
      name: 'Anthropic Claude',
      baseUrl: 'https://api.anthropic.com',
      protocol: 'anthropic_sdk',
      models: anthropicModels,
      status: 'configured'
    });

    // Register OpenAI Provider
    this.registerProvider({
      id: 'openai',
      name: 'OpenAI API',
      baseUrl: 'https://api.openai.com/v1',
      protocol: 'openai_compatible',
      models: openaiModels,
      status: 'configured'
    });

    // Register Groq Provider
    this.registerProvider({
      id: 'groq',
      name: 'Groq LPU Acceleration',
      baseUrl: 'https://api.groq.com/openai/v1',
      protocol: 'openai_compatible',
      models: groqModels,
      status: 'available'
    });

    // Register Local Ollama Provider
    this.registerProvider({
      id: 'ollama',
      name: 'Local Ollama / vLLM (Private / Air-Gapped)',
      baseUrl: 'http://localhost:11434',
      protocol: 'openai_compatible',
      models: ollamaModels,
      status: 'available'
    });
  }

  /**
   * Seeds default modular skills.
   */
  private seedDefaultSkills(): void {
    const defaultSkills: ISkillDescriptor[] = [
      {
        id: 'tree_sitter_ast',
        name: 'Tree-sitter Symbol Navigator',
        category: 'coding',
        summary: 'Parses multi-language concrete syntax trees in microseconds; extracts functions, classes, and callgraphs without dumping full files.',
        mcpToolName: 'treesitter_symbol_nav',
        tokenCostPerCall: 150,
        sourcePath: 'src/sandbox/mcp_treesitter_server.py'
      },
      {
        id: 'crawl4ai_scraper',
        name: 'Crawl4AI Sanitized Markdown Extractor',
        category: 'research',
        summary: 'Asynchronous headless browser crawling with automated DOM filtering; strips CSS/SVG/base64 noise to emit clean token-dense Markdown.',
        mcpToolName: 'crawl4ai_web_extractor',
        tokenCostPerCall: 350,
        sourcePath: 'src/workers/research_scraper.py'
      },
      {
        id: 'lancedb_vector',
        name: 'LanceDB In-Process Vector Engine',
        category: 'persistence',
        summary: 'Embedded columnar vector store operating directly on disk via Apache Arrow; sub-millisecond similarity recall with zero network overhead.',
        mcpToolName: 'lancedb_memory_recall',
        tokenCostPerCall: 120,
        sourcePath: 'src/core/memory/lancedb_adapter.py'
      },
      {
        id: 'searxng_search',
        name: 'SearXNG Private Metasearch Client',
        category: 'research',
        summary: 'Self-hosted metasearch aggregator querying Google, Bing, GitHub, and DuckDuckGo into clean JSON without commercial search API fees.',
        mcpToolName: 'searxng_search_query',
        tokenCostPerCall: 200,
        sourcePath: 'src/sandbox/mcp_searxng_server.py'
      },
      {
        id: 'pytest_sandbox',
        name: 'Hardened Sandbox Test Runner',
        category: 'security',
        summary: 'Dispatches automated test suites inside an isolated gVisor container with dropped Linux capabilities and read-only root filesystem.',
        mcpToolName: 'sandbox_test_executor',
        tokenCostPerCall: 180,
        sourcePath: 'src/sandbox/gvisor_runner.py'
      },
      {
        id: 'semgrep_analyzer',
        name: 'Semgrep Architectural Gatekeeper',
        category: 'coding',
        summary: 'Scans code diffs for security vulnerabilities, memory leaks, and adherence to strict OOP design contracts.',
        mcpToolName: 'semgrep_audit_diff',
        tokenCostPerCall: 160,
        sourcePath: 'src/workers/critic_gatekeeper.py'
      }
    ];

    defaultSkills.forEach(s => this.registerSkill(s));
  }

  public getProviders(): ILLMProvider[] {
    return Array.from(this.providers.values());
  }

  public getProvider(id: LLMProviderId): ILLMProvider | undefined {
    return this.providers.get(id);
  }

  public getModels(): IModelDescriptor[] {
    return Array.from(this.models.values());
  }

  public getModel(id: string): IModelDescriptor | undefined {
    return this.models.get(id);
  }

  public getModelsByTier(tier: 'complex_reasoning' | 'general_synthesis' | 'fast_lookup'): IModelDescriptor[] {
    return this.getModels().filter(m => m.tier === tier);
  }

  public getSkills(): ISkillDescriptor[] {
    return Array.from(this.skills.values());
  }

  public registerModel(model: IModelDescriptor): void {
    this.models.set(model.id, model);
    const provider = this.providers.get(model.provider);
    if (provider && !provider.models.some(m => m.id === model.id)) {
      provider.models.push(model);
    }
  }

  public registerProvider(provider: ILLMProvider): void {
    this.providers.set(provider.id, provider);
    provider.models.forEach(m => this.models.set(m.id, m));
  }

  public registerSkill(skill: ISkillDescriptor): void {
    this.skills.set(skill.id, skill);
  }

  /**
   * Matches the optimal model for a given subagent task contract.
   */
  public matchModelForTask(taskType: string, complexity: 'high' | 'medium' | 'low'): IModelDescriptor {
    if (complexity === 'high' || taskType.includes('refactor') || taskType.includes('security') || taskType.includes('concurrency')) {
      const topReasoning = this.getModelsByTier('complex_reasoning')[0];
      return topReasoning || this.models.get('gemini-4-argon')!;
    }
    if (complexity === 'low' || taskType.includes('lint') || taskType.includes('lookup') || taskType.includes('token')) {
      const fastModel = this.getModelsByTier('fast_lookup')[0];
      return fastModel || this.models.get('gemini-3.1-flash-lite')!;
    }
    const generalModel = this.getModelsByTier('general_synthesis')[0];
    return generalModel || this.models.get('gemini-3.8-flash')!;
  }
}
