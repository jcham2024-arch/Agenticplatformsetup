/**
 * @file App.tsx
 * @description Enterprise UI Workbench for AgentForge: Autonomous Agentic Platform Setup,
 * Scaffolder & Skill Provisioner. Implements the Universal Modular Component Matrix,
 * Top-Level Architect & Subagent Spawner Console, Dynamic Provider Registry, Rule DAG Graph,
 * Synthetic Diagnostic Verifier, Architectural Flaw Audits, and Gemini Systems Co-Pilot.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Layers,
  Cpu,
  Shield,
  Terminal,
  FileCode,
  Network,
  AlertTriangle,
  MessageSquare,
  Wrench,
  Download,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  Search,
  Globe,
  Sliders,
  Play,
  Copy,
  Check,
  Send,
  Zap,
  Box,
  Key,
  FolderGit2,
  HelpCircle,
  LifeBuoy,
  X
} from 'lucide-react';
import {
  IWorkspaceConfig,
  IModuleSelections,
  IWorkspaceManifest,
  IHealthReport,
  IAuditFlawReport,
  ISubagentInstance,
  ITaskContract,
  IModelDescriptor,
  ILLMProvider
} from './types/framework.ts';
import { ResourceRegistry } from './core/registry/ResourceRegistry.ts';
import { WorkspaceFactory } from './core/factories/WorkspaceFactory.ts';
import { AgentFactory } from './core/factories/AgentFactory.ts';
import { DiagnosticVerifier } from './core/DiagnosticVerifier.ts';
import { ArchitectureAuditEngine } from './core/ArchitectureAuditEngine.ts';

// Default Gold Standard Configuration
const defaultGoldStandardConfig: IWorkspaceConfig = {
  projectName: 'HMAP-Core-Workspace',
  targetDirectory: './agentic_workspace',
  profile: 'gold_standard',
  modules: {
    memory: 'lancedb',
    scraper: 'crawl4ai',
    search: 'searxng',
    ast: 'treesitter',
    sandbox: 'gvisor',
    knowledge: 'obsidian',
    ideAnchors: ['claude_code', 'cline_roo', 'open_agents'],
    primaryProvider: 'gemini',
    governance: 'triumvirate'
  },
  enforceLineLimits: true,
  includeDockerCompose: true
};

type ActiveTab =
  | 'blueprint'
  | 'subagents'
  | 'registry'
  | 'rules'
  | 'manifest'
  | 'verification'
  | 'audits'
  | 'chat'
  | 'troubleshooter'
  | 'mcp_tools';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('blueprint');
  const [config, setConfig] = useState<IWorkspaceConfig>(defaultGoldStandardConfig);
  const [manifest, setManifest] = useState<IWorkspaceManifest | null>(null);
  const [healthReport, setHealthReport] = useState<IHealthReport | null>(null);
  const [auditFlaws, setAuditFlaws] = useState<IAuditFlawReport[]>([]);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [manifestFilter, setManifestFilter] = useState<'all' | 'java' | 'ts' | 'rules' | 'config'>('all');
  const [isRunningVerification, setIsRunningVerification] = useState<boolean>(false);

  // Subagent Spawning Console State
  const [subagents, setSubagents] = useState<ISubagentInstance[]>([]);
  const [newSubagentGoal, setNewSubagentGoal] = useState<string>(
    'Refactor auth middleware to enforce OAuth2 PKCE without breaking existing legacy session contracts'
  );
  const [newSubagentRole, setNewSubagentRole] = useState<'CodeEngineer' | 'WebResearcher' | 'DataEngineer' | 'SecurityQA'>('CodeEngineer');
  const [newSubagentComplexity, setNewSubagentComplexity] = useState<'high' | 'medium' | 'low'>('high');

  // Agentic Architect Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; model?: string; timestamp: string }>>([
    {
      role: 'assistant',
      content: `Welcome to the AgentForge Principal Systems Architect console.
I can assist you with:
1. Setting up and customizing your modular multi-agent platform (H-MAP).
2. Spawning isolated subagents with tailored workspace partitions.
3. Researching and updating external LLM providers, model specialties, and MCP skills.
4. Analyzing architectural flaws like concurrent LanceDB file locking, gVisor Playwright syscall traps, and AST span shifts.

What objective would you like to configure or audit today?`,
      model: 'gemini-3.8-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [forcedModel, setForcedModel] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Built-in Independent Troubleshooting & Helper Chatbot State
  const [helperMessages, setHelperMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; model?: string; timestamp: string }>>([
    {
      role: 'assistant',
      content: `Hello! I am your Built-in AgentForge Platform Helper & Troubleshooting Assistant (independent of the autonomous agentic execution LLM).
I can help you:
1. Diagnose host issues (Docker daemon, gVisor runsc installation, Playwright browser dependencies).
2. Configure your Java 21 JDK and Maven build environment.
3. Fix port conflicts (e.g. SearXNG port 8080 or dev server port 3000).
4. Verify your rule token budgets and directory permissions.

Click a quick diagnostic chip below or describe any error you are encountering!`,
      model: 'gemini-3.8-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [helperInput, setHelperInput] = useState<string>('');
  const [isHelperLoading, setIsHelperLoading] = useState<boolean>(false);
  const [isFloatingHelperOpen, setIsFloatingHelperOpen] = useState<boolean>(false);
  const helperBottomRef = useRef<HTMLDivElement>(null);

  // Services
  const registry = useMemo(() => ResourceRegistry.getInstance(), []);
  const workspaceFactory = useMemo(() => new WorkspaceFactory(), []);
  const agentFactory = useMemo(() => new AgentFactory(), []);
  const verifier = useMemo(() => new DiagnosticVerifier(), []);

  // Initial Data Load
  useEffect(() => {
    // Generate initial manifest
    const initManifest = workspaceFactory.generateManifest(config);
    setManifest(initManifest);

    // Initial synthetic health report
    const initReport = verifier.runAllDiagnostics(config);
    setHealthReport(initReport);

    // Load audit flaw catalog
    setAuditFlaws(ArchitectureAuditEngine.getReports());

    // Seed one active subagent demonstration
    const demoTask = agentFactory.createTaskContract(
      'Audit gVisor runsc isolation boundaries against unauthorized syscalls',
      'SecurityQA',
      'high',
      ['.agent/rules/AGENTS.md', '.agent/wiki/tasks/security_and_sandbox.md'],
      ['.agent/workspaces/review_gates/sandbox_security_audit.json']
    );
    const demoSubagent = agentFactory.spawnSubagent(demoTask);
    demoSubagent.status = 'verifying';
    setSubagents([demoSubagent]);
  }, []);

  // Re-generate manifest whenever config changes
  useEffect(() => {
    const newManifest = workspaceFactory.generateManifest(config);
    setManifest(newManifest);
  }, [config, workspaceFactory]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  // Handle module update
  const updateModule = <K extends keyof IModuleSelections>(key: K, value: IModuleSelections[K]) => {
    setConfig(prev => ({
      ...prev,
      profile: 'custom',
      modules: {
        ...prev.modules,
        [key]: value
      }
    }));
  };

  // Preset to Gold Standard
  const applyGoldStandard = () => {
    setConfig(defaultGoldStandardConfig);
  };

  // Run Synthetic Diagnostics
  const handleRunDiagnostics = () => {
    setIsRunningVerification(true);
    setTimeout(() => {
      const report = verifier.runAllDiagnostics(config);
      setHealthReport(report);
      setIsRunningVerification(false);
    }, 600);
  };

  // Spawn New Subagent Instance
  const handleSpawnSubagent = () => {
    if (!newSubagentGoal.trim()) return;
    const task = agentFactory.createTaskContract(
      newSubagentGoal,
      newSubagentRole,
      newSubagentComplexity,
      ['.agent/rules/AGENTS.md', '.agent/wiki/01_architecture.md'],
      [`.agent/workspaces/review_gates/${newSubagentRole.toLowerCase()}_artifact.diff`]
    );
    const subagent = agentFactory.spawnSubagent(task);
    subagent.status = 'executing';
    setSubagents(prev => [subagent, ...prev]);
    setNewSubagentGoal('');
  };

  // Copy helper
  const handleCopy = (text: string, path: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  // Send message to Gemini server-side proxy
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...chatMessages, userMessage];
    setChatMessages(newHistory);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          forceModel: forcedModel || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.content) {
        setChatMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.content,
            model: data.modelUsed || 'gemini-3.8-flash',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.error || 'Failed to retrieve response from server-side Gemini service.',
            model: 'error',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Network connection error: ' + (err.message || 'Server unavailable'),
          model: 'error',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Helper Chat message handler (Built-in independent troubleshooting assistant)
  const handleSendHelperMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || helperInput;
    if (!textToSend.trim() || isHelperLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...helperMessages, userMessage];
    setHelperMessages(newHistory);
    setHelperInput('');
    setIsHelperLoading(true);

    try {
      const res = await fetch('/api/helper-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          currentSetupContext: {
            profile: config.profile,
            sandbox: config.modules.sandbox,
            memory: config.modules.memory,
            scraper: config.modules.scraper,
            search: config.modules.search,
            knowledge: config.modules.knowledge,
            healthStatus: healthReport?.overallStatus
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.content) {
        setHelperMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.content,
            model: data.modelUsed || 'gemini-3.8-flash',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setHelperMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.error || 'Troubleshooting service error. Please verify server connection.',
            model: 'error',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err: any) {
      setHelperMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Network connection error: ' + (err.message || 'Server unavailable'),
          model: 'error',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsHelperLoading(false);
      setTimeout(() => {
        helperBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Trigger quick prompt for agentic architect
  const sendQuickPrompt = (prompt: string) => {
    setChatInput(prompt);
  };

  const filteredFiles = useMemo(() => {
    if (!manifest) return [];
    if (manifestFilter === 'java') {
      return manifest.files.filter(f => f.path.endsWith('.java') || f.path === 'pom.xml');
    }
    if (manifestFilter === 'ts') {
      return manifest.files.filter(f => f.path.startsWith('scripts/ts/'));
    }
    if (manifestFilter === 'rules') {
      return manifest.files.filter(f => f.path.includes('.agent/rules/') || f.path.includes('.agent/wiki/'));
    }
    if (manifestFilter === 'config') {
      return manifest.files.filter(f => f.path.endsWith('.sh') || f.path.endsWith('.py') || f.path.endsWith('.toml') || f.path.endsWith('.json') || f.path.endsWith('.yaml'));
    }
    return manifest.files;
  }, [manifest, manifestFilter]);

  const selectedFile = filteredFiles[selectedFileIndex] || filteredFiles[0] || manifest?.files[0];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F17] text-slate-100 font-sans">
      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION */}
      {/* ========================================================================= */}
      <aside className="w-64 shrink-0 border-r border-slate-800 bg-[#0E1420] flex flex-col justify-between">
        <div>
          {/* Logo & Platform Anchor */}
          <div className="p-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Box className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                  AgentForge
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    H-MAP
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400">Autonomous Setup & Provisioner</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-2 space-y-0.5 text-xs">
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'blueprint'
                  ? 'bg-sky-500/15 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-sky-400" />
                Modular Customizer
              </span>
              <span className="text-[10px] font-mono text-slate-500">8 Modules</span>
            </button>

            <button
              onClick={() => setActiveTab('subagents')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'subagents'
                  ? 'bg-sky-500/15 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                Subagent Factory
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80">
                {subagents.length} Active
              </span>
            </button>

            <button
              onClick={() => setActiveTab('registry')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'registry'
                  ? 'bg-sky-500/15 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Dynamic Model Catalog
              </span>
              <span className="text-[10px] font-mono text-slate-500">5 Providers</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'rules'
                  ? 'bg-sky-500/15 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Network className="w-4 h-4 text-amber-400" />
                Rules & DAG Graph
              </span>
              <span className="text-[10px] font-mono text-amber-400/80">11 Rules</span>
            </button>

            <button
              onClick={() => setActiveTab('manifest')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'manifest'
                  ? 'bg-sky-500/15 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileCode className="w-4 h-4 text-violet-400" />
                Generated Manifest
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {manifest?.totalFiles || 0} Files
              </span>
            </button>

            <button
              onClick={() => setActiveTab('verification')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'verification'
                  ? 'bg-sky-500/15 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-teal-400" />
                Synthetic Health Matrix
              </span>
              <span
                className={`text-[10px] font-mono ${
                  healthReport?.overallStatus === 'healthy' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {healthReport?.passedCount || 0}/6 Passed
              </span>
            </button>

            <button
              onClick={() => setActiveTab('audits')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'audits'
                  ? 'bg-sky-500/15 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Spec Audit Findings
              </span>
              <span className="text-[10px] font-mono text-rose-400/80">6 Audited</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-sky-500/15 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                Gemini Architect Co-Pilot
              </span>
              <span className="text-[10px] font-mono text-sky-400">Live</span>
            </button>

            <button
              onClick={() => setActiveTab('troubleshooter')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'troubleshooter'
                  ? 'bg-amber-500/15 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                DevOps Troubleshooter
              </span>
              <span className="text-[10px] font-mono text-amber-400/90">Helper</span>
            </button>

            <button
              onClick={() => setActiveTab('mcp_tools')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'mcp_tools'
                  ? 'bg-sky-500/15 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-cyan-400" />
                LLM Tool API Bridge
              </span>
              <span className="text-[10px] font-mono text-cyan-400">MCP</span>
            </button>
          </nav>
        </div>

        {/* System Footprint Metric Box */}
        <div className="p-3 m-3 rounded-lg border border-slate-800/80 bg-slate-900/60 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="font-medium text-[11px]">Active Profile</span>
            <span
              className={`text-[10px] font-mono uppercase font-semibold ${
                config.profile === 'gold_standard' ? 'text-emerald-400' : 'text-sky-400'
              }`}
            >
              {config.profile === 'gold_standard' ? 'Gold Standard' : 'Custom'}
            </span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Rule Token Budget:</span>
              <span className="font-mono text-slate-200 tabular-nums">
                ~{manifest?.totalTokens.toLocaleString() || 0} tokens
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sandbox Isolation:</span>
              <span className="font-mono text-slate-200 capitalize">
                {config.modules.sandbox}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Vector Persistence:</span>
              <span className="font-mono text-slate-200 capitalize">
                {config.modules.memory}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0B0F17]">
        {/* Top Header Bar */}
        <header className="h-14 shrink-0 border-b border-slate-800 bg-[#0E1420]/80 backdrop-blur px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">agentforge</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-medium text-slate-200">
              {activeTab === 'blueprint' && 'Modular Customizer & Component Matrix'}
              {activeTab === 'subagents' && 'Architect & Isolated Subagent Spawner Console'}
              {activeTab === 'registry' && 'Extensible LLM Provider & Model Specialty Catalog'}
              {activeTab === 'rules' && '3-Tier Progressive Disclosure Rule Engine & DAG Graph'}
              {activeTab === 'manifest' && 'Generated Workspace Manifest & Setup Scripts'}
              {activeTab === 'verification' && 'Synthetic Preflight Diagnostics & Health Matrix'}
              {activeTab === 'audits' && 'Documentation Flaw Analysis & Verified Remediations'}
              {activeTab === 'chat' && 'Lead Architect Multi-Turn Assistant (Gemini API)'}
              {activeTab === 'troubleshooter' && 'Built-In DevOps Troubleshooter & Setup Helper'}
              {activeTab === 'mcp_tools' && 'External Agentic MCP Tool Bridge'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsFloatingHelperOpen(prev => !prev)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                isFloatingHelperOpen
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              Troubleshooter Helper
            </button>
            {config.profile === 'custom' && (
              <button
                onClick={applyGoldStandard}
                className="px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-md hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Reset to Gold Standard
              </button>
            )}

            <button
              onClick={handleRunDiagnostics}
              disabled={isRunningVerification}
              className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningVerification ? 'animate-spin' : ''}`} />
              Run Health Checks
            </button>

            <button
              onClick={() => {
                setActiveTab('manifest');
              }}
              className="px-3 py-1.5 text-xs font-medium text-sky-950 bg-sky-400 rounded-md hover:bg-sky-300 transition-colors flex items-center gap-1.5 shadow-sm shadow-sky-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              Download Scaffolds
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: MODULAR CUSTOMIZER */}
          {activeTab === 'blueprint' && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Banner */}
              <div className="p-5 rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-[#121927]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">
                      Modular Framework Component Matrix
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      Deploy the opinionated, battle-tested <strong>Gold Standard Default</strong> for
                      instant setup, or customize individual modules below. Every selection is
                      automatically wired into strict OOP factory contracts, symlinks, and dependency manifests.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={applyGoldStandard}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        config.profile === 'gold_standard'
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Gold Standard (Preset)
                    </button>
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, profile: 'custom' }))}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        config.profile === 'custom'
                          ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Custom Configuration
                    </button>
                  </div>
                </div>
              </div>

              {/* 8 Modular Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Vector Database */}
                <div className="p-4 rounded-lg border border-slate-800 bg-[#0E1420] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
                      <Database className="w-4 h-4 text-sky-400" />
                      Vector DB & Memory
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Episodic memory store for past failures and architectural decisions.
                    </p>
                  </div>
                  <select
                    value={config.modules.memory}
                    onChange={e => updateModule('memory', e.target.value as any)}
                    className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="lancedb">LanceDB (Arrow, In-Process) [Gold Std]</option>
                    <option value="qdrant">Qdrant (Distributed JSON Filter)</option>
                    <option value="chroma">ChromaDB (Lightweight Python)</option>
                    <option value="pgvector">PGVector (PostgreSQL SQL)</option>
                    <option value="mem0">Mem0 (Personalized Episodic)</option>
                    <option value="none">None (Ephemeral Scratchpad Only)</option>
                  </select>
                </div>

                {/* 2. Web Scraper */}
                <div className="p-4 rounded-lg border border-slate-800 bg-[#0E1420] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      Web Scraper & Crawler
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Extracts documentation and web APIs into clean token-dense markdown.
                    </p>
                  </div>
                  <select
                    value={config.modules.scraper}
                    onChange={e => updateModule('scraper', e.target.value as any)}
                    className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="crawl4ai">Crawl4AI (Async, DOM Prune) [Gold Std]</option>
                    <option value="browser_use">Browser-Use (Playwright/CDP)</option>
                    <option value="firecrawl">Firecrawl (Web-to-Markdown API)</option>
                    <option value="beautifulsoup">BeautifulSoup (Lightweight DOM)</option>
                    <option value="none">None (No External Crawling)</option>
                  </select>
                </div>

                {/* 3. Search Engine */}
                <div className="p-4 rounded-lg border border-slate-800 bg-[#0E1420] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
                      <Search className="w-4 h-4 text-indigo-400" />
                      Search Engine Backend
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Aggregates research queries into structured JSON without tracking.
                    </p>
                  </div>
                  <select
                    value={config.modules.search}
                    onChange={e => updateModule('search', e.target.value as any)}
                    className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="searxng">SearXNG (Self-Hosted Docker) [Gold Std]</option>
                    <option value="duckduckgo">DuckDuckGo CLI (Local Zero-Config)</option>
                    <option value="brave">Brave Search API</option>
                    <option value="google_custom">Google Custom Search API</option>
                    <option value="none">None</option>
                  </select>
                </div>

                {/* 4. AST Concrete Syntax Tool */}
                <div className="p-4 rounded-lg border border-slate-800 bg-[#0E1420] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
                      <Cpu className="w-4 h-4 text-amber-400" />
                      AST Parsing & Slicing
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Slices code symbols to avoid whole-file dumps into prompt context.
                    </p>
                  </div>
                  <select
                    value={config.modules.ast}
                    onChange={e => updateModule('ast', e.target.value as any)}
                    className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="treesitter">Tree-sitter (CST Multi-Lang) [Gold Std]</option>
                    <option value="ast_grep">ast-grep (Rust Pattern Search)</option>
                    <option value="semgrep">Semgrep (Static Security Audit)</option>
                    <option value="ruff_biome">Ruff & Biome CLI</option>
                    <option value="python_ast">Python ast Standard Library</option>
                  </select>
                </div>

                {/* 5. Sandbox Runtime */}
                <div className="p-4 rounded-lg border border-slate-800 bg-[#0E1420] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
                      <Shield className="w-4 h-4 text-rose-400" />
                      Sandbox Virtualization
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Isolates bash scripts, test runners, and unverified worker code.
                    </p>
                  </div>
                  <select
                    value={config.modules.sandbox}
                    onChange={e => updateModule('sandbox', e.target.value as any)}
                    className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="gvisor">gVisor (runsc User-Space Kernel) [Gold Std]</option>
                    <option value="docker">Standard Docker / Podman</option>
                    <option value="e2b">E2B Firecracker MicroVMs</option>
                    <option value="local_uv">Local uv Virtualenv (No Isolation)</option>
                  </select>
                </div>

                {/* 6. Knowledge System & Link Syntax */}
                <div className="p-4 rounded-lg border border-slate-800 bg-[#0E1420] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
                      <Network className="w-4 h-4 text-violet-400" />
                      Knowledge System & Syntax
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Format used for progressive disclosure rule references and navigation.
                    </p>
                  </div>
                  <select
                    value={config.modules.knowledge}
                    onChange={e => updateModule('knowledge', e.target.value as any)}
                    className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="obsidian">Obsidian Vault ([[wikilinks]]) [Gold Std]</option>
                    <option value="posix_markdown">Clean POSIX Markdown ([link](./...))</option>
                    <option value="foam_dendron">Foam / Dendron (VS Code)</option>
                    <option value="logseq">Logseq Outliner Markdown</option>
                    <option value="single_file">Single-File Consolidated Charter</option>
                  </select>
                </div>

                {/* 7. Primary LLM Provider */}
                <div className="p-4 rounded-lg border border-slate-800 bg-[#0E1420] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Primary LLM Provider
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Core cognitive brain tier and model family.
                    </p>
                  </div>
                  <select
                    value={config.modules.primaryProvider}
                    onChange={e => updateModule('primaryProvider', e.target.value as any)}
                    className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="gemini">Google Gemini 3 & 4 Triumvirate [Gold Std]</option>
                    <option value="anthropic">Anthropic Claude (3.7 Sonnet / Haiku)</option>
                    <option value="openai">OpenAI (GPT-4.5 / o3-mini)</option>
                    <option value="ollama">Local Ollama / vLLM (DeepSeek R1)</option>
                    <option value="groq">Groq LPU Acceleration</option>
                  </select>
                </div>

                {/* 8. Governance Tier */}
                <div className="p-4 rounded-lg border border-slate-800 bg-[#0E1420] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
                      <Layers className="w-4 h-4 text-teal-400" />
                      Governance Architecture
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Council tier controlling decomposition and review gates.
                    </p>
                  </div>
                  <select
                    value={config.modules.governance}
                    onChange={e => updateModule('governance', e.target.value as any)}
                    className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="triumvirate">Triumvirate (Architect, Critic, Evolution) [Gold Std]</option>
                    <option value="duo">Duo Council (Architect + Critic)</option>
                    <option value="single">Single Autonomous Lead Agent</option>
                  </select>
                </div>
              </div>

              {/* IDE Anchor Checkboxes */}
              <div className="p-4 rounded-lg border border-slate-800 bg-[#0E1420]">
                <div className="text-xs font-semibold text-slate-200 mb-2 flex items-center justify-between">
                  <span>Target Editor & IDE Symlink Anchors</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Generates compatibility links pointing to AGENTS.md
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs">
                  {[
                    { id: 'claude_code', label: 'Claude Code (CLAUDE.md)' },
                    { id: 'cline_roo', label: 'Cline & Roo Code (.clinerules)' },
                    { id: 'cursor_mdc', label: 'Cursor (.cursor/rules/main.mdc)' },
                    { id: 'open_agents', label: 'Open Agent Standard (AGENTS.md)' }
                  ].map(anchor => {
                    const checked = config.modules.ideAnchors.includes(anchor.id as any);
                    return (
                      <label key={anchor.id} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => {
                            if (e.target.checked) {
                              updateModule('ideAnchors', [...config.modules.ideAnchors, anchor.id as any]);
                            } else {
                              updateModule(
                                'ideAnchors',
                                config.modules.ideAnchors.filter(a => a !== anchor.id)
                              );
                            }
                          }}
                          className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0"
                        />
                        <span>{anchor.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBAGENT FACTORY CONSOLE */}
          {activeTab === 'subagents' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="p-5 rounded-xl border border-slate-800 bg-[#0E1420]">
                <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-400" />
                  Lead Architect Subagent Spawner Console
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                  Demonstrates the Lead Architect spinning up an instance of an Execution Agent via strict
                  OOP factories. Automatically provisions an isolated workspace folder structure (
                  <code className="text-sky-300 font-mono">.agent/workspaces/agents/&lt;agent_id&gt;/</code>)
                  populated with only the necessary files and resources. Base system rules remain strictly immutable.
                </p>

                {/* Spawner Form */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Task Objective (Emitted by Lead Architect)
                    </label>
                    <input
                      type="text"
                      value={newSubagentGoal}
                      onChange={e => setNewSubagentGoal(e.target.value)}
                      placeholder="Enter task description for subagent..."
                      className="w-full text-xs font-sans bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Subagent Role
                    </label>
                    <select
                      value={newSubagentRole}
                      onChange={e => setNewSubagentRole(e.target.value as any)}
                      className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                    >
                      <option value="CodeEngineer">Code Engineering Agent</option>
                      <option value="WebResearcher">Web Intelligence Agent</option>
                      <option value="DataEngineer">Data & Persistence Agent</option>
                      <option value="SecurityQA">Security & QA Gatekeeper</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Task Complexity
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={newSubagentComplexity}
                        onChange={e => setNewSubagentComplexity(e.target.value as any)}
                        className="flex-1 text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                      >
                        <option value="high">High (Reasoning)</option>
                        <option value="medium">Medium (Synthesis)</option>
                        <option value="low">Low (Fast Tool)</option>
                      </select>
                      <button
                        onClick={handleSpawnSubagent}
                        className="px-3 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Spawn
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subagents Active Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-medium text-slate-200">
                    Active Subagent Instances & Partitioned Workspaces ({subagents.length})
                  </span>
                  <span className="font-mono text-[11px]">Base Architecture: IMMUTABLE</span>
                </div>

                {subagents.map(agent => (
                  <div
                    key={agent.instanceId}
                    className="p-4 rounded-xl border border-slate-800 bg-[#0E1420] text-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-sky-400">
                          {agent.instanceId}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {agent.role}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          Model: {agent.assignedModel}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          agent.status === 'executing'
                            ? 'bg-amber-500/15 text-amber-300'
                            : agent.status === 'verifying'
                            ? 'bg-sky-500/15 text-sky-300'
                            : 'bg-emerald-500/15 text-emerald-300'
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>

                    <div className="text-slate-300 font-medium">
                      {agent.currentTask?.goalDescription}
                    </div>

                    {/* Isolated Partitions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Thinking Partition:</span>
                        <span className="text-slate-300 truncate block">
                          {agent.isolatedPartitions.thinking}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Code Staging:</span>
                        <span className="text-slate-300 truncate block">
                          {agent.isolatedPartitions.codeStaging}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Review Gates:</span>
                        <span className="text-slate-300 truncate block">
                          {agent.isolatedPartitions.reviewGates}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Mounted Rules:</span>
                        <span className="text-emerald-400 truncate block">
                          AGENTS.md (Read-Only)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC MODEL CATALOG & REGISTRY */}
          {activeTab === 'registry' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="p-5 rounded-xl border border-slate-800 bg-[#0E1420]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-400" />
                      Extensible LLM Provider & Model Specialty Catalog
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      The base framework is immutable, while external LLM providers and models are
                      dynamically registered. The Lead Architect queries this catalog to pair each subagent
                      with the optimal model for reasoning, speed, or tool execution.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      sendQuickPrompt(
                        'Research and list the top 2026 reasoning models across Google Gemini, Anthropic Claude, and OpenAI. Suggest how we should update our ModelCatalog specialties.'
                      );
                      setActiveTab('chat');
                    }}
                    className="px-3.5 py-2 text-xs font-medium text-slate-950 bg-indigo-400 rounded-lg hover:bg-indigo-300 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Research & Update Models
                  </button>
                </div>
              </div>

              {/* Table of Models */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0E1420]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Model & Provider</th>
                      <th className="py-3 px-4">Cognitive Specialty</th>
                      <th className="py-3 px-4 text-center">Context Window</th>
                      <th className="py-3 px-4 text-center">Speed Score</th>
                      <th className="py-3 px-4 text-center">Reasoning IQ</th>
                      <th className="py-3 px-4 text-right">Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {registry.getModels().map(m => (
                      <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200">{m.displayName}</div>
                          <div className="font-mono text-[10px] text-slate-500 uppercase">
                            {m.provider} · {m.id}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300 max-w-xs">{m.specialty}</td>
                        <td className="py-3 px-4 text-center font-mono text-slate-400 tabular-nums">
                          {(m.contextWindow / 1000).toFixed(0)}k tokens
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                            {m.speedScore}/10
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-mono font-semibold text-sky-400 tabular-nums">
                            {m.reasoningScore}/10
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded ${
                              m.tier === 'complex_reasoning'
                                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                : m.tier === 'general_synthesis'
                                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {m.tier.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: RULE ENGINE & DAG GRAPH */}
          {activeTab === 'rules' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="p-5 rounded-xl border border-slate-800 bg-[#0E1420] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                    <Network className="w-5 h-5 text-amber-400" />
                    Progressive Disclosure Rule Tree & Token Linter
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    Visual DAG preventing cyclic links and context explosions. Strictly enforces the
                    150-line cap on Tier 1 root charters and 200-line caps on Tier 2/3 protocols.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Syntax Format:</span>
                  <button
                    onClick={() => updateModule('knowledge', 'obsidian')}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${
                      config.modules.knowledge === 'obsidian'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    [[Obsidian]]
                  </button>
                  <button
                    onClick={() => updateModule('knowledge', 'posix_markdown')}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${
                      config.modules.knowledge === 'posix_markdown'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    [POSIX Markdown]
                  </button>
                </div>
              </div>

              {/* Visual Rule Hierarchy Cards */}
              <div className="space-y-4">
                {/* Tier 1 */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span className="text-sky-400 font-semibold">Tier 1: Ambient Kernel Charter (&le; 150 lines)</span>
                    <span>Always loaded in system context</span>
                  </div>
                  <div className="p-4 rounded-lg border border-sky-500/30 bg-sky-950/20 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-slate-100">AGENTS.md</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Master Navigation Index, Governance Charter & Unbreachable Invariants
                      </div>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="text-emerald-400 font-semibold">52 / 150 lines</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-400">~620 tokens</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* Tier 2 */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span className="text-indigo-400 font-semibold">
                      Tier 2: Domain Protocols (&le; 200 lines each)
                    </span>
                    <span>Loaded on-demand when domain boundary is crossed</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {[
                      { path: '01_architecture.md', title: 'Architecture & BaseAgent Contracts', lines: 45 },
                      { path: '02_planning_protocol.md', title: 'Cognitive Planning & Task DAGs', lines: 42 },
                      { path: '03_engineering_standards.md', title: 'OOP Design, SOLID & Typing', lines: 38 },
                      { path: '04_verification_protocol.md', title: 'Deterministic Testing & Critic Gates', lines: 40 },
                      { path: '05_persistence_and_memory.md', title: 'Context Budgeting & LanceDB Commit', lines: 44 }
                    ].map(p => (
                      <div
                        key={p.path}
                        className="p-3 rounded-lg border border-slate-800 bg-[#0E1420] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-mono text-slate-300 font-medium">{p.path}</div>
                          <div className="text-[11px] text-slate-500">{p.title}</div>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-emerald-400">{p.lines}/200 lines</span>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tier 3 */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span className="text-emerald-400 font-semibold">
                      Tier 3: Specialized Task SOPs (&le; 200 lines each)
                    </span>
                    <span>Loaded strictly during high-risk execution phases</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {[
                      { path: 'tasks/database_migrations.md', title: 'Reversible DDL & Dry-Runs', lines: 32 },
                      { path: 'tasks/dependency_management.md', title: 'Vulnerability Audits & Lockfiles', lines: 30 },
                      { path: 'tasks/subsystem_refactor.md', title: 'Call-Site Tracing & Deprecation', lines: 28 },
                      { path: 'tasks/security_and_sandbox.md', title: 'gVisor Kernel & Isolation Caps', lines: 34 },
                      { path: 'tasks/incident_postmortem.md', title: 'Reproduction Harness & Taxonomy', lines: 26 }
                    ].map(s => (
                      <div
                        key={s.path}
                        className="p-3 rounded-lg border border-slate-800 bg-[#0E1420] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-mono text-slate-300 font-medium">{s.path}</div>
                          <div className="text-[11px] text-slate-500">{s.title}</div>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-emerald-400">{s.lines}/200 lines</span>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GENERATED MANIFEST & FILE VIEWER */}
          {activeTab === 'manifest' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-violet-400" />
                    Generated Workspace Manifest
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {manifest?.totalFiles} files generated · {manifest?.totalLines.toLocaleString()} lines · ~
                    {manifest?.totalTokens.toLocaleString()} tokens
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Category Filter Chips */}
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                    {[
                      { id: 'all', label: 'All Files' },
                      { id: 'java', label: 'Java 21 Core' },
                      { id: 'ts', label: 'TS Bottlenecks' },
                      { id: 'rules', label: 'Rules & DAG' },
                      { id: 'config', label: 'Shell & Config' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setManifestFilter(tab.id as any);
                          setSelectedFileIndex(0);
                        }}
                        className={`px-2.5 py-1 text-xs font-mono rounded ${
                          manifestFilter === tab.id
                            ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (selectedFile) handleCopy(selectedFile.content, selectedFile.path);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    {copiedPath === selectedFile?.path ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy File
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Master File Browser */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[550px] border border-slate-800 rounded-xl overflow-hidden bg-[#0E1420]">
                {/* File List */}
                <div className="border-r border-slate-800 overflow-y-auto divide-y divide-slate-800/60">
                  {filteredFiles.map((file, idx) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFileIndex(idx)}
                      className={`w-full text-left p-3 transition-colors ${
                        selectedFileIndex === idx
                          ? 'bg-sky-500/15 border-l-2 border-sky-400'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-slate-200 font-medium truncate">
                          {file.path}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {file.path.endsWith('.java') && (
                            <span className="text-[9px] font-mono px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                              Java 21
                            </span>
                          )}
                          {file.path.startsWith('scripts/ts/') && (
                            <span className="text-[9px] font-mono px-1 py-0.2 bg-sky-500/20 text-sky-300 rounded border border-sky-500/30">
                              TS Proc
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-slate-500">
                            {file.lineCount}L
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {file.description}
                      </div>
                    </button>
                  ))}
                  {filteredFiles.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-500">
                      No files match selected category filter.
                    </div>
                  )}
                </div>

                {/* Code Preview */}
                <div className="md:col-span-2 flex flex-col h-full bg-[#080C14]">
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200 font-semibold">{selectedFile?.path}</span>
                      {selectedFile?.isImmutableBase && (
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 rounded border border-emerald-500/30">
                          Immutable Base
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {selectedFile?.lineCount} lines · ~{selectedFile?.tokenEstimate} tokens
                    </span>
                  </div>
                  <pre className="flex-1 p-4 overflow-auto text-xs font-mono text-slate-300 leading-relaxed whitespace-pre">
                    {selectedFile?.content}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SYNTHETIC HEALTH MATRIX */}
          {activeTab === 'verification' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="p-5 rounded-xl border border-slate-800 bg-[#0E1420] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-teal-400" />
                    Synthetic Preflight Verification Matrix
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    Automated preflight checks asserting kernel isolation boundaries, AST symbol
                    slicing speeds, vector persistence roundtrips, and rule token budgets.
                  </p>
                </div>
                <button
                  onClick={handleRunDiagnostics}
                  disabled={isRunningVerification}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 rounded-lg hover:bg-teal-300 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRunningVerification ? 'animate-spin' : ''}`} />
                  Execute 6-Phase Test Suite
                </button>
              </div>

              {/* Test Results List */}
              <div className="space-y-3">
                {healthReport?.tests.map(test => (
                  <div
                    key={test.testId}
                    className="p-4 rounded-xl border border-slate-800 bg-[#0E1420] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {test.status === 'passed' && (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {test.status === 'warning' && (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        {test.status === 'failed' && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-100">{test.testName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {test.targetSubsystem}
                        </span>
                      </div>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {test.executionTimeMs}ms
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 pl-6.5">{test.procedure}</p>

                    <div className="pl-6.5 font-mono text-[11px] text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                      {test.diagnosticOutput}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SPEC AUDIT FINDINGS */}
          {activeTab === 'audits' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="p-5 rounded-xl border border-slate-800 bg-[#0E1420]">
                <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  Documentation Logic & Implementation Audit Reports
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                  Deep technical audit of the 11 uploaded H-MAP and AgentForge specifications.
                  Exposes hidden concurrency deadlocks, container breakout vectors, token-budget leaks,
                  and AST span shifts, accompanied by machine-verified mathematical and programmatic fixes.
                </p>
              </div>

              {/* Flaws Grid */}
              <div className="space-y-4">
                {auditFlaws.map(flaw => (
                  <div
                    key={flaw.id}
                    className="p-5 rounded-xl border border-slate-800 bg-[#0E1420] text-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            flaw.severity === 'Critical'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : flaw.severity === 'Warning'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                          }`}
                        >
                          {flaw.severity}
                        </span>
                        <span className="font-semibold text-sm text-slate-100">{flaw.title}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">
                        {flaw.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-[11px] font-medium text-rose-300 mb-1">
                          Underlying Flaw in Documentation:
                        </div>
                        <p className="text-slate-400 leading-relaxed">{flaw.underlyingFlaw}</p>

                        <div className="text-[11px] font-medium text-amber-300 mt-2 mb-1">
                          Failure Blast Radius:
                        </div>
                        <p className="text-slate-400 leading-relaxed">{flaw.blastRadius}</p>
                      </div>

                      <div>
                        <div className="text-[11px] font-medium text-emerald-300 mb-1">
                          Verified Implementation Fix:
                        </div>
                        <p className="text-slate-300 leading-relaxed mb-2">
                          {flaw.verifiedRemediation}
                        </p>
                        <pre className="p-3 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                          {flaw.codeSolutionSnippet}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: GEMINI ARCHITECT CHAT */}
          {activeTab === 'chat' && (
            <div className="max-w-5xl mx-auto h-full flex flex-col">
              {/* Header with Model Selector */}
              <div className="p-4 border-b border-slate-800 bg-[#0E1420] rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span className="font-semibold text-xs text-slate-100">
                    Lead Principal Systems Architect (Multi-Turn Chat)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 text-[11px]">Model Tier Routing:</span>
                  <select
                    value={forcedModel}
                    onChange={e => setForcedModel(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs text-sky-300 font-mono rounded px-2.5 py-1 focus:outline-none"
                  >
                    <option value="">Auto-Route (Recommended)</option>
                    <option value="gemini-4-argon">gemini-4-argon (Flagship Reasoning)</option>
                    <option value="gemini-3.8-flash">gemini-3.8-flash (General Systems)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Instant)</option>
                  </select>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#080C14] border-x border-slate-800">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {msg.role === 'user' ? 'Systems Engineer' : 'Lead Architect'}
                      </span>
                      {msg.model && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {msg.model}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-600">
                        {msg.timestamp}
                      </span>
                    </div>

                    <div
                      className={`max-w-3xl p-4 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-sky-600 text-white rounded-br-none'
                          : 'bg-[#111827] text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-sky-400 font-mono p-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Architect Brain is synthesizing response...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Prompt Suggestion Chips */}
              <div className="p-2.5 bg-[#0E1420] border-x border-slate-800 flex gap-2 overflow-x-auto text-[11px]">
                <button
                  onClick={() =>
                    sendQuickPrompt(
                      'Simulate how the Lead Architect handles a LanceDB concurrent file-lock collision during a 4-worker parallel dispatch.'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
                >
                  LanceDB Concurrency Test
                </button>
                <button
                  onClick={() =>
                    sendQuickPrompt(
                      'Analyze gVisor runsc system call interception overhead on Crawl4AI headless Chromium execution.'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
                >
                  gVisor vs Playwright Analysis
                </button>
                <button
                  onClick={() =>
                    sendQuickPrompt(
                      'Verify the 150-line rule limit on AGENTS.md and recommend token compaction strategies.'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
                >
                  Rule Budget Audit
                </button>
              </div>

              {/* Input Box */}
              <div className="p-3 bg-[#0E1420] border border-slate-800 rounded-b-xl flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Inquire about framework architecture, subagent tasking, or security..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </div>
            </div>
          )}

          {/* TAB 9: LLM TOOL API BRIDGE */}
          {activeTab === 'mcp_tools' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="p-5 rounded-xl border border-slate-800 bg-[#0E1420]">
                <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-cyan-400" />
                  Model Context Protocol (MCP) Tool Bridge
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  AgentForge is exposed as a structured tool for external LLM chat agents (Claude Code,
                  Cline, Cursor, or LangGraph). External agents can call these endpoints to turn any host
                  machine into a configured, selectively skilled H-MAP workspace.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-[#0E1420]">
                  <div className="text-xs font-mono font-semibold text-cyan-400 mb-1">
                    Tool 1: agentforge_provision_workspace
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Scaffolds the full physical folder structure, vetted rules, and dependencies.
                  </p>
                  <pre className="p-3 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
{`curl -X POST http://localhost:3000/api/installer/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "config": {
      "projectName": "MyAgentWorkspace",
      "profile": "gold_standard",
      "modules": {
        "memory": "lancedb",
        "scraper": "crawl4ai",
        "sandbox": "gvisor",
        "knowledge": "obsidian"
      }
    }
  }'`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-[#0E1420]">
                  <div className="text-xs font-mono font-semibold text-emerald-400 mb-1">
                    Tool 2: agentforge_spawn_subagent
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Spawns an execution subagent and scaffolds its isolated workspace directory.
                  </p>
                  <pre className="p-3 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
{`curl -X POST http://localhost:3000/api/agent/spawn \\
  -H "Content-Type: application/json" \\
  -d '{
    "goal": "Refactor database migrations to support zero downtime",
    "role": "DataEngineer",
    "complexity": "high"
  }'`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: BUILT-IN DEVOPS TROUBLESHOOTER & HELPER */}
          {activeTab === 'troubleshooter' && (
            <div className="max-w-5xl mx-auto h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-slate-800 bg-[#0E1420] rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <LifeBuoy className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                      AgentForge Built-In DevOps Troubleshooter & Helper
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        Independent Assistant
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Diagnose machine setup, fix container/gVisor errors, and verify Java 21 &amp; Maven toolchains.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 text-[11px]">Model:</span>
                  <span className="font-mono text-amber-400 text-[11px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Gemini 3.8 / 4 Multi-Tier
                  </span>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#080C14] border-x border-slate-800">
                {helperMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {msg.role === 'user' ? 'You' : 'DevOps Troubleshooter'}
                      </span>
                      {msg.model && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {msg.model}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-600">
                        {msg.timestamp}
                      </span>
                    </div>

                    <div
                      className={`max-w-3xl p-4 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-amber-600 text-slate-950 font-medium rounded-br-none'
                          : 'bg-[#111827] text-slate-200 border border-slate-800 rounded-bl-none shadow-sm font-sans'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isHelperLoading && (
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-mono p-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Troubleshooting Assistant is diagnosing...</span>
                  </div>
                )}
                <div ref={helperBottomRef} />
              </div>

              {/* Quick Diagnostic Suggestion Chips */}
              <div className="p-2.5 bg-[#0E1420] border-x border-slate-800 flex gap-2 overflow-x-auto text-[11px]">
                <button
                  onClick={() =>
                    handleSendHelperMessage(
                      'Diagnose my current workspace setup configuration and synthetic health status.'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap flex items-center gap-1"
                >
                  <Terminal className="w-3 h-3 text-teal-400" />
                  Diagnose Active Setup
                </button>
                <button
                  onClick={() =>
                    handleSendHelperMessage(
                      'How do I install and configure gVisor (runsc) on my Linux or macOS machine with Docker?'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap flex items-center gap-1"
                >
                  <Shield className="w-3 h-3 text-rose-400" />
                  Install gVisor (runsc)
                </button>
                <button
                  onClick={() =>
                    handleSendHelperMessage(
                      'Provide step-by-step instructions to verify Java 21 JDK and test our generated Maven pom.xml.'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap flex items-center gap-1"
                >
                  <Box className="w-3 h-3 text-amber-400" />
                  Java 21 &amp; Maven Verification
                </button>
                <button
                  onClick={() =>
                    handleSendHelperMessage(
                      'SearXNG or local port 8080 conflict detected. How do I change the port or debug Docker compose?'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap flex items-center gap-1"
                >
                  <Search className="w-3 h-3 text-indigo-400" />
                  Resolve Port 8080 Conflict
                </button>
              </div>

              {/* Input Box */}
              <div className="p-3 bg-[#0E1420] border border-slate-800 rounded-b-xl flex gap-2">
                <input
                  type="text"
                  value={helperInput}
                  onChange={e => setHelperInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendHelperMessage()}
                  placeholder="Describe an error, stack trace, or environment issue (Docker, Java, Node, Python, gVisor)..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleSendHelperMessage()}
                  disabled={isHelperLoading || !helperInput.trim()}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Ask Helper
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* PERSISTENT FLOATING TROUBLESHOOTER DRAWER */}
      {/* ========================================================================= */}
      {isFloatingHelperOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] z-50 bg-[#0E1420] border border-slate-700/80 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Drawer Top */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-100">
                Troubleshooter Helper (Gemini)
              </span>
            </div>
            <button
              onClick={() => setIsFloatingHelperOpen(false)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#080C14] text-xs">
            {helperMessages.slice(-4).map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-lg text-xs ${
                  msg.role === 'user'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 ml-6'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 mr-6'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-500 mb-1 uppercase">
                  {msg.role === 'user' ? 'You' : 'Helper'}
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            ))}
            {isHelperLoading && (
              <div className="text-[11px] text-amber-400 font-mono animate-pulse">
                Analyzing problem...
              </div>
            )}
          </div>

          {/* Quick chip */}
          <div className="p-2 border-t border-slate-800/80 bg-slate-900/40 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSendHelperMessage('Check active configuration')}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
            >
              Diagnose Active Setup
            </button>
            <button
              onClick={() => handleSendHelperMessage('How to install gVisor?')}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
            >
              Install gVisor
            </button>
          </div>

          {/* Drawer Input */}
          <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={helperInput}
              onChange={e => setHelperInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendHelperMessage()}
              placeholder="Ask helper..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => handleSendHelperMessage()}
              disabled={isHelperLoading || !helperInput.trim()}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded text-xs transition-colors disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Launcher Pill when drawer is closed */}
      {!isFloatingHelperOpen && (
        <button
          onClick={() => setIsFloatingHelperOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-full shadow-lg shadow-amber-500/20 flex items-center gap-2 text-xs transition-transform hover:scale-105"
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Troubleshooter Helper</span>
        </button>
      )}
    </div>
  );
}
