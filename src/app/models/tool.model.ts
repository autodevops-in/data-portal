export interface Tool {
  id: string;
  name: string;
  description: string;
  type: string; // e.g., 'CI/CD', 'Monitoring', 'Security', etc.
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ToolCredential {
  id: string;
  toolId: string;
  projectId: string;
  name: string;
  credentialData: any; // This will be encrypted when stored
  createdAt: Date;
  updatedAt: Date;
}