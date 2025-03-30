import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tool, ToolCredential } from '../models/tool.model';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  // Mock data for tools
  private mockTools: Tool[] = [
    {
      id: 'tool-1',
      name: 'GitHub',
      description: 'GitHub integration for source code management',
      type: 'SCM',
      icon: 'cilCode',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-06-15')
    },
    {
      id: 'tool-2',
      name: 'Jenkins',
      description: 'Jenkins CI/CD pipeline integration',
      type: 'CI/CD',
      icon: 'cilSettings',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-06-20')
    },
    {
      id: 'tool-3',
      name: 'AWS',
      description: 'Amazon Web Services integration',
      type: 'Cloud',
      icon: 'cilCloud',
      createdAt: new Date('2023-01-20'),
      updatedAt: new Date('2023-06-25')
    }
  ];

  // Mock data for credentials (in a real app, this would be encrypted)
  private mockCredentials: ToolCredential[] = [
    {
      id: 'cred-1',
      toolId: 'tool-1',
      projectId: 'proj-2',
      name: 'GitHub Access Token',
      credentialData: { token: 'encrypted-token-data' },
      createdAt: new Date('2023-02-01'),
      updatedAt: new Date('2023-07-15')
    },
    {
      id: 'cred-2',
      toolId: 'tool-2',
      projectId: 'proj-2',
      name: 'Jenkins API Key',
      credentialData: { username: 'jenkins-user', apiKey: 'encrypted-api-key' },
      createdAt: new Date('2023-02-15'),
      updatedAt: new Date('2023-07-20')
    }
  ];

  constructor() {}

  getAllTools(): Observable<Tool[]> {
    return of(this.mockTools);
  }

  getToolById(id: string): Observable<Tool | undefined> {
    const tool = this.mockTools.find(t => t.id === id);
    return of(tool);
  }

  createTool(tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Observable<Tool> {
    const newTool: Tool = {
      ...tool,
      id: `tool-${this.mockTools.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockTools.push(newTool);
    return of(newTool);
  }

  updateTool(id: string, tool: Partial<Tool>): Observable<Tool | undefined> {
    const index = this.mockTools.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTools[index] = {
        ...this.mockTools[index],
        ...tool,
        updatedAt: new Date()
      };
      return of(this.mockTools[index]);
    }
    return of(undefined);
  }

  deleteTool(id: string): Observable<boolean> {
    const initialLength = this.mockTools.length;
    this.mockTools = this.mockTools.filter(t => t.id !== id);
    return of(initialLength > this.mockTools.length);
  }

  // Credential methods
  getCredentialsByProject(projectId: string): Observable<ToolCredential[]> {
    return of(this.mockCredentials.filter(c => c.projectId === projectId));
  }

  getCredentialsByTool(toolId: string): Observable<ToolCredential[]> {
    return of(this.mockCredentials.filter(c => c.toolId === toolId));
  }

  getCredentialById(id: string): Observable<ToolCredential | undefined> {
    return of(this.mockCredentials.find(c => c.id === id));
  }

  createCredential(credential: Omit<ToolCredential, 'id' | 'createdAt' | 'updatedAt'>): Observable<ToolCredential> {
    // In a real app, you would encrypt the credential data here
    const newCredential: ToolCredential = {
      ...credential,
      id: `cred-${this.mockCredentials.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockCredentials.push(newCredential);
    return of(newCredential);
  }

  updateCredential(id: string, credential: Partial<ToolCredential>): Observable<ToolCredential | undefined> {
    const index = this.mockCredentials.findIndex(c => c.id === id);
    if (index !== -1) {
      // In a real app, you would encrypt the updated credential data here
      this.mockCredentials[index] = {
        ...this.mockCredentials[index],
        ...credential,
        updatedAt: new Date()
      };
      return of(this.mockCredentials[index]);
    }
    return of(undefined);
  }

  deleteCredential(id: string): Observable<boolean> {
    const initialLength = this.mockCredentials.length;
    this.mockCredentials = this.mockCredentials.filter(c => c.id !== id);
    return of(initialLength > this.mockCredentials.length);
  }
}