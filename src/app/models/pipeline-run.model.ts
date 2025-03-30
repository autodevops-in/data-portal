export enum PipelineRunStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled',
  WAITING_APPROVAL = 'waiting_approval'
}

export interface PipelineStageRun {
  id: string;
  name: string;
  status: PipelineRunStatus;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // in seconds
  logs?: string[];
}

export interface PipelineRun {
  id: string;
  pipelineId: string;
  pipelineName: string;
  projectId: string;
  environment: string;
  status: PipelineRunStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // in seconds
  triggeredBy: string;
  triggeredByName: string;
  triggeredByAvatar?: string;
  version?: string;
  buildNumber?: number;
  stages: PipelineStageRun[];
}