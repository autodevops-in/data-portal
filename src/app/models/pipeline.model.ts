export enum PipelineStatus {
  IDLE = 'idle',
  QUEUED = 'queued',
  RUNNING = 'running',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled',
  WAITING_APPROVAL = 'waiting_approval'
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface PipelineStage {
  id: string;
  name: string;
  status: PipelineStatus;
  order: number;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // in seconds
  logs?: string[];
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  projectId: string;
  status: PipelineStatus;
  stages: PipelineStage[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastRunAt?: Date;
  lastRunBy?: string;
  approvalRequired: boolean;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  environment: string;
}

export interface PipelineRun {
  id: string;
  pipelineId: string;
  status: PipelineStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // in seconds
  triggeredBy: string;
  stages: PipelineStageRun[];
  approvalStatus?: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  environment: string;
}

export interface PipelineStageRun {
  id: string;
  stageId: string;
  name: string;
  status: PipelineStatus;
  order: number;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // in seconds
  logs?: string[];
}