/**
 * @file server.ts
 * @description Full-stack Express server powering the AgentForge Autonomous Framework Platform.
 * Implements server-side Gemini API proxying with model routing, dynamic manifest generation,
 * subagent workspace provisioning, synthetic health verification, and Vite dev middleware.
 */

import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ResourceRegistry } from './src/core/registry/ResourceRegistry.ts';
import { WorkspaceFactory } from './src/core/factories/WorkspaceFactory.ts';
import { AgentFactory } from './src/core/factories/AgentFactory.ts';
import { DiagnosticVerifier } from './src/core/DiagnosticVerifier.ts';
import { ArchitectureAuditEngine } from './src/core/ArchitectureAuditEngine.ts';
import { ITaskContract, IWorkspaceConfig } from './src/types/framework.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK with required user-agent header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

const registry = ResourceRegistry.getInstance();
const workspaceFactory = new WorkspaceFactory();
const agentFactory = new AgentFactory();
const verifier = new DiagnosticVerifier();

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * GET /api/registry/resources
 * Returns all registered LLM providers, model specialties, and modular skills.
 */
app.get('/api/registry/resources', (_req: Request, res: Response) => {
  res.json({
    providers: registry.getProviders(),
    models: registry.getModels(),
    skills: registry.getSkills()
  });
});

/**
 * POST /api/installer/generate
 * Generates tailored workspace file manifest, bootstrap scripts, and configuration trees.
 */
app.post('/api/installer/generate', (req: Request, res: Response) => {
  try {
    const config: IWorkspaceConfig = req.body.config;
    if (!config) {
      return res.status(400).json({ error: 'Missing workspace configuration' });
    }
    const manifest = workspaceFactory.generateManifest(config);
    return res.json(manifest);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Manifest generation failed' });
  }
});

/**
 * POST /api/installer/verify
 * Runs the 6-phase synthetic diagnostic verification matrix.
 */
app.post('/api/installer/verify', (req: Request, res: Response) => {
  try {
    const config: IWorkspaceConfig = req.body.config;
    if (!config) {
      return res.status(400).json({ error: 'Missing workspace configuration' });
    }
    const report = verifier.runAllDiagnostics(config);
    return res.json(report);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Diagnostics execution failed' });
  }
});

/**
 * POST /api/agent/spawn
 * Simulates the Lead Architect spinning up an execution subagent and provisioning
 * its physical isolated workspace partition.
 */
app.post('/api/agent/spawn', (req: Request, res: Response) => {
  try {
    const { goal, role, complexity, inputs, expectedOutputs } = req.body;
    const taskContract: ITaskContract = agentFactory.createTaskContract(
      goal || 'Execute assigned subsystem task',
      role || 'CodeEngineer',
      complexity || 'medium',
      inputs || ['.agent/rules/AGENTS.md'],
      expectedOutputs || ['.agent/workspaces/review_gates/patch.diff']
    );
    const subagent = agentFactory.spawnSubagent(taskContract);
    return res.json({ taskContract, subagent });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Subagent spawning failed' });
  }
});

/**
 * GET /api/audit/flaws
 * Returns the comprehensive architectural flaw audits and verified remediations.
 */
app.get('/api/audit/flaws', (_req: Request, res: Response) => {
  res.json(ArchitectureAuditEngine.getReports());
});

/**
 * POST /api/chat
 * Multi-turn Gemini chat interface with intelligent model routing.
 * Routes to:
 * - gemini-4-argon for complex reasoning, AST concurrency, and security.
 * - gemini-3.8-flash for general architecture and convention updates.
 * - gemini-3.1-flash-lite for fast rule lookups and syntax verification.
 */
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, forceModel } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid messages array' });
    }

    const latestPrompt = messages[messages.length - 1].content || '';

    // Automated Model Routing logic based on query complexity
    let selectedModel = 'gemini-3.8-flash';
    if (forceModel) {
      selectedModel = forceModel;
    } else {
      const lower = latestPrompt.toLowerCase();
      if (
        lower.includes('concurrency') ||
        lower.includes('exploit') ||
        lower.includes('security') ||
        lower.includes('gvisor') ||
        lower.includes('deep') ||
        lower.includes('race condition') ||
        lower.includes('proof') ||
        lower.includes('ast transform')
      ) {
        selectedModel = 'gemini-4-argon';
      } else if (
        lower.includes('lookup') ||
        lower.includes('token count') ||
        lower.includes('quick') ||
        lower.includes('fast') ||
        lower.includes('syntax check')
      ) {
        selectedModel = 'gemini-3.1-flash-lite';
      } else {
        selectedModel = 'gemini-3.8-flash';
      }
    }

    const systemInstruction = `You are the Lead Principal Systems Architect of AgentForge and the Hierarchical Multi-Agent Platform (H-MAP).
Your core architectural principles are:
1. Strict Object-Oriented Design (SOLID, Abstract Base Classes, typed interfaces, dependency injection).
2. Complete Workspace Isolation (per-agent partitions: thinking, research, code_staging, review_gates).
3. Strict Immutability of Base Architecture (core rules and interfaces are read-only to execution subagents).
4. Progressive Disclosure (Tier 1 <= 150 lines, Tier 2/3 <= 200 lines, DAG wiki-links without circular loops).
5. Modular Component Matrix: Support both the Gold Standard backend (LanceDB, Crawl4AI, SearXNG, gVisor, Obsidian) and selectable custom backends (Qdrant, Browser-Use, Docker, POSIX markdown, etc.).
6. Proactive Flaw Auditing: You are aware of concurrent LanceDB file locking, gVisor Sentry Playwright futex limits, MCP directory traversal risks, and CST byte span invalidation.

Answer technical inquiries with authoritative, concise, code-grounded explanations. When asked for code, output pristine TypeScript or Python respecting these exact boundaries.`;

    // Map conversation history
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    try {
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction,
          temperature: 0.2
        }
      });

      return res.json({
        content: response.text || 'No response generated.',
        modelUsed: selectedModel
      });
    } catch (apiErr: any) {
      // Fallback to gemini-3.8-flash if a paid model or specific tier threw an authorization or rate error
      if (selectedModel !== 'gemini-3.8-flash') {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.2
          }
        });
        return res.json({
          content: fallbackResponse.text || 'No response generated.',
          modelUsed: 'gemini-3.8-flash (fallback)'
        });
      }
      throw apiErr;
    }
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || 'Gemini chat processing error',
      content: 'Error communicating with Gemini model: ' + (error.message || 'Unknown error')
    });
  }
});

/**
 * POST /api/helper-chat
 * Built-in Troubleshooting & Helper Chatbot independent of the agentic LLM.
 * Specialized in diagnosing host environments, fixing container/gVisor issues,
 * troubleshooting Java 21 / Maven setups, resolving port conflicts, and guiding the user.
 */
app.post('/api/helper-chat', async (req: Request, res: Response) => {
  try {
    const { messages, forceModel, currentSetupContext } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid messages array' });
    }

    const latestPrompt = messages[messages.length - 1].content || '';
    const lower = latestPrompt.toLowerCase();

    // Model Routing based on troubleshooting complexity
    let selectedModel = 'gemini-3.8-flash';
    if (forceModel) {
      selectedModel = forceModel;
    } else {
      if (
        lower.includes('kernel') ||
        lower.includes('segfault') ||
        lower.includes('stacktrace') ||
        lower.includes('traceback') ||
        lower.includes('sigsys') ||
        lower.includes('concurrency') ||
        lower.includes('exploit') ||
        lower.includes('deep debug')
      ) {
        selectedModel = 'gemini-4-argon';
      } else if (
        lower.includes('command') ||
        lower.includes('quick') ||
        lower.includes('port') ||
        lower.includes('version') ||
        lower.includes('syntax') ||
        lower.includes('flag')
      ) {
        selectedModel = 'gemini-3.1-flash-lite';
      } else {
        selectedModel = 'gemini-3.8-flash';
      }
    }

    const contextAddition = currentSetupContext
      ? `\nCurrent Active User Configuration Context:\n${JSON.stringify(currentSetupContext, null, 2)}`
      : '';

    const systemInstruction = `You are the Built-In Troubleshooting Assistant and DevOps Platform Helper for AgentForge.
You are independent of the autonomous agentic execution LLM. Your role is to guide the user, solve environmental issues, and make sure their workspace runs smoothly on their machine (Linux, macOS, Windows WSL2).

Key domains of expertise:
1. Docker & Sandboxing: Diagnosing Docker daemon connectivity, installing gVisor (runsc) on Linux/macOS OrbStack, configuring tmpfs, and dropping Linux capabilities.
2. Java 21 & Maven: Verifying JDK 21 installation, configuring pom.xml dependencies for LangChain4j and Jackson, fixing Maven build errors.
3. Node & TypeScript: Ensuring Node.js 20+ runtime, Vite configuration, and Express proxy connections.
4. Python & Scrapers: Fixing uv virtual environments, Playwright Chromium dependencies (libnss3, libatk), and SearXNG port 8080 conflicts.
5. Rule & Token Budgets: Helping users keep Tier 1 AGENTS.md <= 150 lines and Tier 2/3 <= 200 lines without circular DAG links.

Always provide concrete, actionable explanations and verified copy-pasteable terminal commands. Keep answers crisp and helpful.${contextAddition}`;

    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    try {
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction,
          temperature: 0.3
        }
      });

      return res.json({
        content: response.text || 'No response generated.',
        modelUsed: selectedModel
      });
    } catch (apiErr: any) {
      if (selectedModel !== 'gemini-3.8-flash') {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.3
          }
        });
        return res.json({
          content: fallbackResponse.text || 'No response generated.',
          modelUsed: 'gemini-3.8-flash (fallback)'
        });
      }
      throw apiErr;
    }
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || 'Helper chat processing error',
      content: 'Troubleshooting assistant temporarily unavailable: ' + (error.message || 'Unknown error')
    });
  }
});

/**
 * GET /api/mcp/tools
 * Exposes the OpenAPI/MCP tool definitions so external agents can call AgentForge.
 */
app.get('/api/mcp/tools', (_req: Request, res: Response) => {
  res.json({
    tools: [
      {
        name: 'agentforge_provision_workspace',
        description: 'Scaffolds an autonomous agentic workspace with vetted rules, skills, and dependencies.',
        parameters: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Name of the target agent workspace' },
            profile: { type: 'string', enum: ['gold_standard', 'custom'] },
            knowledgeFormat: { type: 'string', enum: ['obsidian', 'posix_markdown', 'foam_dendron'] },
            sandboxRuntime: { type: 'string', enum: ['gvisor', 'docker', 'local_uv'] },
            memoryBackend: { type: 'string', enum: ['lancedb', 'qdrant', 'none'] }
          },
          required: ['projectName']
        }
      },
      {
        name: 'agentforge_spawn_subagent',
        description: 'Spawns an isolated execution subagent with a dedicated workspace partition.',
        parameters: {
          type: 'object',
          properties: {
            goal: { type: 'string', description: 'Task imperative description' },
            role: { type: 'string', enum: ['CodeEngineer', 'WebResearcher', 'DataEngineer', 'SecurityQA'] },
            complexity: { type: 'string', enum: ['high', 'medium', 'low'] }
          },
          required: ['goal', 'role']
        }
      },
      {
        name: 'agentforge_verify_health',
        description: 'Runs 6-phase synthetic diagnostic verification tests across sandbox, AST, memory, and rules.',
        parameters: {
          type: 'object',
          properties: {
            targetDirectory: { type: 'string' }
          }
        }
      }
    ]
  });
});

// ============================================================================
// VITE DEV SERVER INTEGRATION & STATIC ASSETS
// ============================================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AgentForge] Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
