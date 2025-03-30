import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PipelineRun, PipelineRunStatus } from '../models/pipeline-run.model';

@Injectable({
  providedIn: 'root'
})
export class PipelineRunService {
  // Mock data for pipeline runs
  private mockPipelineRuns: PipelineRun[] = [
    {
      id: 'run-1',
      pipelineId: 'pipe-1',
      pipelineName: 'Frontend CI/CD',
      projectId: 'proj-2',
      environment: 'Production',
      status: PipelineRunStatus.SUCCEEDED,
      startedAt: new Date(new Date().getTime() - 3600000), // 1 hour ago
      completedAt: new Date(new Date().getTime() - 3540000), // 59 minutes ago
      duration: 1200, // 20 minutes
      triggeredBy: 'user1',
      triggeredByName: 'John Doe',
      triggeredByAvatar: 'assets/img/avatars/1.jpg',
      version: 'v1.2.0',
      buildNumber: 145,
      stages: [
        {
          id: 'stage-1-1',
          name: 'Build',
          status: PipelineRunStatus.SUCCEEDED,
          startedAt: new Date(new Date().getTime() - 3600000),
          completedAt: new Date(new Date().getTime() - 3580000),
          duration: 300
        },
        {
          id: 'stage-1-2',
          name: 'Test',
          status: PipelineRunStatus.SUCCEEDED,
          startedAt: new Date(new Date().getTime() - 3580000),
          completedAt: new Date(new Date().getTime() - 3560000),
          duration: 400
        },
        {
          id: 'stage-1-3',
          name: 'Deploy',
          status: PipelineRunStatus.SUCCEEDED,
          startedAt: new Date(new Date().getTime() - 3560000),
          completedAt: new Date(new Date().getTime() - 3540000),
          duration: 500
        }
      ]
    },
    {
      id: 'run-2',
      pipelineId: 'pipe-2',
      pipelineName: 'Backend API CI/CD',
      projectId: 'proj-3',
      environment: 'Staging',
      status: PipelineRunStatus.RUNNING,
      startedAt: new Date(new Date().getTime() - 1800000), // 30 minutes ago
      triggeredBy: 'user2',
      triggeredByName: 'Jane Smith',
      triggeredByAvatar: 'assets/img/avatars/2.jpg',
      version: 'v2.1.0',
      buildNumber: 87,
      stages: [
        {
          id: 'stage-2-1',
          name: 'Build',
          status: PipelineRunStatus.SUCCEEDED,
          startedAt: new Date(new Date().getTime() - 1800000),
          completedAt: new Date(new Date().getTime() - 1700000),
          duration: 100
        },
        {
          id: 'stage-2-2',
          name: 'Test',
          status: PipelineRunStatus.RUNNING,
          startedAt: new Date(new Date().getTime() - 1700000)
        },
        {
          id: 'stage-2-3',
          name: 'Deploy',
          status: PipelineRunStatus.QUEUED
        }
      ]
    },
    {
      id: 'run-3',
      pipelineId: 'pipe-3',
      pipelineName: 'Mobile App CI/CD',
      projectId: 'proj-4',
      environment: 'TestFlight',
      status: PipelineRunStatus.FAILED,
      startedAt: new Date(new Date().getTime() - 7200000), // 2 hours ago
      completedAt: new Date(new Date().getTime() - 7000000), // 1 hour 56 minutes ago
      duration: 200,
      triggeredBy: 'user3',
      triggeredByName: 'Mike Johnson',
      triggeredByAvatar: 'assets/img/avatars/3.jpg',
      version: 'v1.5.0',
      buildNumber: 62,
      stages: [
        {
          id: 'stage-3-1',
          name: 'Build',
          status: PipelineRunStatus.SUCCEEDED,
          startedAt: new Date(new Date().getTime() - 7200000),
          completedAt: new Date(new Date().getTime() - 7150000),
          duration: 50
        },
        {
          id: 'stage-3-2',
          name: 'Test',
          status: PipelineRunStatus.FAILED,
          startedAt: new Date(new Date().getTime() - 7150000),
          completedAt: new Date(new Date().getTime() - 7000000),
          duration: 150
        }
      ]
    },
    {
      id: 'run-4',
      pipelineId: 'pipe-4',
      pipelineName: 'Infrastructure Deployment',
      projectId: 'proj-5',
      environment: 'Staging',
      status: PipelineRunStatus.WAITING_APPROVAL,
      startedAt: new Date(new Date().getTime() - 10800000), // 3 hours ago
      triggeredBy: 'user4',
      triggeredByName: 'Sarah Williams',
      triggeredByAvatar: 'assets/img/avatars/4.jpg',
      version: 'v3.0.0',
      buildNumber: 29,
      stages: [
        {
          id: 'stage-4-1',
          name: 'Validate',
          status: PipelineRunStatus.SUCCEEDED,
          startedAt: new Date(new Date().getTime() - 10800000),
          completedAt: new Date(new Date().getTime() - 10750000),
          duration: 50
        },
        {
          id: 'stage-4-2',
          name: 'Plan',
          status: PipelineRunStatus.SUCCEEDED,
          startedAt: new Date(new Date().getTime() - 10750000),
          completedAt: new Date(new Date().getTime() - 10700000),
          duration: 50
        },
        {
          id: 'stage-4-3',
          name: 'Approval',
          status: PipelineRunStatus.WAITING_APPROVAL,
          startedAt: new Date(new Date().getTime() - 10700000)
        },
        {
          id: 'stage-4-4',
          name: 'Apply',
          status: PipelineRunStatus.QUEUED
        }
      ]
    },
    {
      id: 'run-5',
      pipelineId: 'pipe-5',
      pipelineName: 'Data Processing Pipeline',
      projectId: 'proj-7',
      environment: 'Production',
      status: PipelineRunStatus.SUCCEEDED,
      startedAt: new Date(new Date().getTime() - 14400000), // 4 hours ago
      completedAt: new Date(new Date().getTime() - 14100000), // 3 hours 55 minutes ago
      duration: 300,
      triggeredBy: 'user5',
      triggeredByName: 'Alex Brown',
      triggeredByAvatar: 'assets/img/avatars/5.jpg',
      version: 'v2.3.0',
      buildNumber: 118,
      stages: [
        {
          id: 'stage-5-1',
          name: 'Extract',
          status: PipelineRunStatus.SUCCEEDED,
          startedAt: new Date(new Date().getTime() - 14400000),
          completedAt: new Date(new Date().getTime() - 14350000),
          duration: 50
        },
        {
          id: 'stage-5-2',
          name: 'Transform',
          status: PipelineRunStatus.SUCCEEDED,
          startedAt: new Date(new Date().getTime() - 14350000),
          completedAt: new Date(new Date().getTime() - 14250000),
          duration: 100
        },
        {
          id: 'stage-5-3',
          name: 'Load',
          status: PipelineRunStatus.SUCCEEDED,
          startedAt: new Date(new Date().getTime() - 14250000),
          completedAt: new Date(new Date().getTime() - 14100000),
          duration: 150
        }
      ]
    },
    {
      id: 'run-6',
      pipelineId: 'pipe-6',
      pipelineName: 'Authentication Service CI/CD',
      projectId: 'proj-6',
      environment: 'Development',
      status: PipelineRunStatus.CANCELED,
      startedAt: new Date(new Date().getTime() - 18000000), // 5 hours ago
      completedAt: new Date(new Date().getTime() - 17900000), // 4 hours 58 minutes ago
      duration: 100,
      triggeredBy: 'user6',
      triggeredByName: 'Emily Davis',
      triggeredByAvatar: 'assets/img/avatars/6.jpg',
      version: 'v1.1.0',
      buildNumber: 42,
      stages: [
        {
          id: 'stage-6-1',
          name: 'Build',
          status: PipelineRunStatus.SUCCEEDED,
          startedAt: new Date(new Date().getTime() - 18000000),
          completedAt: new Date(new Date().getTime() - 17950000),
          duration: 50
        },
        {
          id: 'stage-6-2',
          name: 'Test',
          status: PipelineRunStatus.CANCELED,
          startedAt: new Date(new Date().getTime() - 17950000),
          completedAt: new Date(new Date().getTime() - 17900000),
          duration: 50
        }
      ]
    }
  ];

  constructor() { }

  getPipelineRuns(): Observable<PipelineRun[]> {
    return of(this.mockPipelineRuns);
  }

  getPipelineRunsByProjectId(projectId: string): Observable<PipelineRun[]> {
    const runs = this.mockPipelineRuns.filter(run => run.projectId === projectId);
    return of(runs);
  }

  getPipelineRunById(runId: string): Observable<PipelineRun | undefined> {
    const run = this.mockPipelineRuns.find(run => run.id === runId);
    return of(run);
  }

  getPipelineRunsByPipelineId(pipelineId: string): Observable<PipelineRun[]> {
    const runs = this.mockPipelineRuns.filter(run => run.pipelineId === pipelineId);
    return of(runs);
  }

  getRecentPipelineRuns(limit: number = 5): Observable<PipelineRun[]> {
    // Sort by startedAt date (newest first) and take the first 'limit' items
    const sortedRuns = [...this.mockPipelineRuns].sort((a, b) => 
      b.startedAt.getTime() - a.startedAt.getTime()
    ).slice(0, limit);
    
    return of(sortedRuns);
  }
}