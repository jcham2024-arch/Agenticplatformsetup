/**
 * @file AgentFactory.ts
 * @description Factory class for instantiating autonomous agent personas,
 * assigning specialized models from the ResourceRegistry, and coordinating
 * with WorkspaceFactory to scaffold per-subagent isolated runtime trees.
 */

import {
  ISubagentInstance,
  ITaskContract
} from '../../types/framework.ts';
import { ResourceRegistry } from '../registry/ResourceRegistry.ts';
import { WorkspaceFactory } from './WorkspaceFactory.ts';

/**
 * Interface defining Agent Factory operations.
 */
export interface IAgentFactory {
  spawnSubagent(task: ITaskContract): ISubagentInstance;
  createTaskContract(
    goal: string,
    role: 'CodeEngineer' | 'WebResearcher' | 'DataEngineer' | 'SecurityQA',
    complexity: 'high' | 'medium' | 'low',
    inputs: string[],
    expectedOutputs: string[]
  ): ITaskContract;
}

/**
 * Factory class responsible for creating typed subagents with isolated workspaces.
 */
export class AgentFactory implements IAgentFactory {
  private workspaceFactory: WorkspaceFactory;
  private registry: ResourceRegistry;

  public constructor() {
    this.workspaceFactory = new WorkspaceFactory();
    this.registry = ResourceRegistry.getInstance();
  }

  /**
   * Constructs a typed Task Contract and matches the optimal model from the registry.
   */
  public createTaskContract(
    goal: string,
    role: 'CodeEngineer' | 'WebResearcher' | 'DataEngineer' | 'SecurityQA',
    complexity: 'high' | 'medium' | 'low',
    inputs: string[],
    expectedOutputs: string[]
  ): ITaskContract {
    const matchedModel = this.registry.matchModelForTask(role, complexity);
    const taskId = `task-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    return {
      taskId,
      issuerAgent: 'StrategicArchitectBrain',
      assignedToRole: role,
      goalDescription: goal,
      contextSlice: `Goal: ${goal} | Complexity: ${complexity} | Role: ${role}`,
      inputArtifacts: inputs,
      expectedArtifacts: expectedOutputs,
      timeoutSeconds: complexity === 'high' ? 300 : 120,
      assignedModelId: matchedModel.id
    };
  }

  /**
   * Spawns an execution subagent instance and provisions its physical isolated workspace.
   */
  public spawnSubagent(task: ITaskContract): ISubagentInstance {
    const agentId = `agent-${task.assignedToRole.toLowerCase()}-${Date.now().toString(36)}`;
    return this.workspaceFactory.provisionSubagentWorkspace(agentId, task);
  }
}
