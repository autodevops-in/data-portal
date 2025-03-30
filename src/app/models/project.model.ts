export interface Project {
  id: string;
  name: string;
  description: string;
  repositoryUrl?: string;
  deploymentEnvironments?: string[];
  environment?: string; // Current active environment
  createdAt: Date;
  updatedAt: Date;
  teamMembers?: string[];
  parentId?: string; // For hierarchical structure
  children?: Project[]; // For hierarchical structure
}