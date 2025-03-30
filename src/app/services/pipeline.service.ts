import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Pipeline, PipelineRun, PipelineStatus, ApprovalStatus, PipelineStage } from '../models/pipeline.model';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {
  // Mock data for pipelines
  private mockPipelines: Pipeline[] = [
    {
      id: 'pipe-1',
      name: 'Frontend Deployment',
      description: 'Deploy frontend application to environments',
      projectId: 'proj-2',
      status: PipelineStatus.IDLE,
      stages: [
        { id: 'stage-1-1', name: 'Build', status: PipelineStatus.IDLE, order: 1 },
        { id: 'stage-1-2', name: 'Test', status: PipelineStatus.IDLE, order: 2 },
        { id: 'stage-1-3', name: 'Deploy', status: PipelineStatus.IDLE, order: 3 }
      ],
      createdAt: new Date('2023-05-10'),
      updatedAt: new Date('2023-06-15'),
      createdBy: 'user1',
      lastRunAt: new Date('2023-06-15'),
      lastRunBy: 'user2',
      approvalRequired: true,
      environment: 'Production'
    },
    {
      id: 'pipe-2',
      name: 'Backend API Deployment',
      description: 'Deploy backend API to environments',
      projectId: 'proj-3',
      status: PipelineStatus.IDLE,
      stages: [
        { id: 'stage-2-1', name: 'Build', status: PipelineStatus.IDLE, order: 1 },
        { id: 'stage-2-2', name: 'Test', status: PipelineStatus.IDLE, order: 2 },
        { id: 'stage-2-3', name: 'Deploy', status: PipelineStatus.IDLE, order: 3 }
      ],
      createdAt: new Date('2023-05-12'),
      updatedAt: new Date('2023-06-18'),
      createdBy: 'user3',
      lastRunAt: new Date('2023-06-18'),
      lastRunBy: 'user4',
      approvalRequired: true,
      environment: 'Production'
    },
    {
      id: 'pipe-3',
      name: 'Mobile App Build',
      description: 'Build and test mobile application',
      projectId: 'proj-4',
      status: PipelineStatus.IDLE,
      stages: [
        { id: 'stage-3-1', name: 'Build', status: PipelineStatus.IDLE, order: 1 },
        { id: 'stage-3-2', name: 'Test', status: PipelineStatus.IDLE, order: 2 },
        { id: 'stage-3-3', name: 'Package', status: PipelineStatus.IDLE, order: 3 }
      ],
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-06-20'),
      createdBy: 'user5',
      lastRunAt: new Date('2023-06-20'),
      lastRunBy: 'user6',
      approvalRequired: false,
      environment: 'Development'
    },
    {
      id: 'pipe-4',
      name: 'Infrastructure Deployment',
      description: 'Deploy infrastructure changes',
      projectId: 'proj-5',
      status: PipelineStatus.IDLE,
      stages: [
        { id: 'stage-4-1', name: 'Validate', status: PipelineStatus.IDLE, order: 1 },
        { id: 'stage-4-2', name: 'Plan', status: PipelineStatus.IDLE, order: 2 },
        { id: 'stage-4-3', name: 'Apply', status: PipelineStatus.IDLE, order: 3 }
      ],
      createdAt: new Date('2023-05-18'),
      updatedAt: new Date('2023-06-22'),
      createdBy: 'user7',
      lastRunAt: new Date('2023-06-22'),
      lastRunBy: 'user8',
      approvalRequired: true,
      environment: 'Production'
    },
    {
      id: 'pipe-5',
      name: 'Auth Service Deployment',
      description: 'Deploy authentication service',
      projectId: 'proj-6',
      status: PipelineStatus.IDLE,
      stages: [
        { id: 'stage-5-1', name: 'Build', status: PipelineStatus.IDLE, order: 1 },
        { id: 'stage-5-2', name: 'Test', status: PipelineStatus.IDLE, order: 2 },
        { id: 'stage-5-3', name: 'Deploy', status: PipelineStatus.IDLE, order: 3 }
      ],
      createdAt: new Date('2023-05-20'),
      updatedAt: new Date('2023-06-25'),
      createdBy: 'user9',
      lastRunAt: new Date('2023-06-25'),
      lastRunBy: 'user10',
      approvalRequired: true,
      environment: 'Staging'
    }
  ];

  private mockPipelineRuns: PipelineRun[] = [];

  private pipelinesSubject = new BehaviorSubject<Pipeline[]>(this.mockPipelines);
  public pipelines$ = this.pipelinesSubject.asObservable();

  private pipelineRunsSubject = new BehaviorSubject<PipelineRun[]>(this.mockPipelineRuns);
  public pipelineRuns$ = this.pipelineRunsSubject.asObservable();

  constructor() {}

  getPipelines(): Observable<Pipeline[]> {
    return this.pipelines$;
  }

  getPipelinesByProjectId(projectId: string): Observable<Pipeline[]> {
    return this.pipelines$.pipe(
      map(pipelines => pipelines.filter(pipeline => pipeline.projectId === projectId))
    );
  }

  getPipelineById(id: string): Observable<Pipeline | undefined> {
    return this.pipelines$.pipe(
      map(pipelines => pipelines.find(pipeline => pipeline.id === id))
    );
  }

  getPipelineRuns(pipelineId: string): Observable<PipelineRun[]> {
    return this.pipelineRuns$.pipe(
      map(runs => runs.filter(run => run.pipelineId === pipelineId))
    );
  }

  // Simulate triggering a pipeline
  triggerPipeline(pipelineId: string, userId: string): Observable<PipelineRun> {
    const pipeline = this.mockPipelines.find(p => p.id === pipelineId);

    if (!pipeline) {
      throw new Error(`Pipeline with ID ${pipelineId} not found`);
    }

    // Update pipeline status
    pipeline.status = PipelineStatus.RUNNING;
    pipeline.lastRunAt = new Date();
    pipeline.lastRunBy = userId;

    // Create a new pipeline run
    const pipelineRun: PipelineRun = {
      id: `run-${Date.now()}`,
      pipelineId: pipelineId,
      status: PipelineStatus.RUNNING,
      startedAt: new Date(),
      triggeredBy: userId,
      stages: pipeline.stages.map(stage => ({
        id: `run-stage-${Date.now()}-${stage.id}`,
        stageId: stage.id,
        name: stage.name,
        status: PipelineStatus.QUEUED,
        order: stage.order
      })),
      environment: pipeline.environment
    };

    // Add to mock data
    this.mockPipelineRuns.push(pipelineRun);

    // Update the pipeline stages to match the run stages
    pipeline.stages.forEach((stage, index) => {
      stage.status = PipelineStatus.QUEUED;
    });

    // Emit updated pipelines and runs
    this.pipelineRunsSubject.next([...this.mockPipelineRuns]);
    this.pipelinesSubject.next([...this.mockPipelines]);

    // Simulate pipeline execution
    this.simulatePipelineExecution(pipeline, pipelineRun);

    return of(pipelineRun);
  }

  // Simulate pipeline execution
  private simulatePipelineExecution(pipeline: Pipeline, pipelineRun: PipelineRun): void {
    let currentStageIndex = 0;
    const stages = [...pipelineRun.stages].sort((a, b) => a.order - b.order);

    const runStage = () => {
      if (currentStageIndex >= stages.length) {
        // All stages completed
        pipelineRun.status = PipelineStatus.SUCCEEDED;
        pipelineRun.completedAt = new Date();
        pipelineRun.duration = Math.floor((pipelineRun.completedAt.getTime() - pipelineRun.startedAt.getTime()) / 1000);

        // Update pipeline status
        pipeline.status = PipelineStatus.SUCCEEDED;

        // Update all pipeline stages to succeeded
        pipeline.stages.forEach(stage => {
          stage.status = PipelineStatus.SUCCEEDED;
        });

        this.pipelineRunsSubject.next([...this.mockPipelineRuns]);
        this.pipelinesSubject.next([...this.mockPipelines]);
        return;
      }

      const currentStage = stages[currentStageIndex];

      // Find the corresponding pipeline stage
      const pipelineStage = pipeline.stages.find(s => s.id === currentStage.stageId);

      // Start stage
      currentStage.status = PipelineStatus.RUNNING;
      currentStage.startedAt = new Date();

      // Update pipeline stage status
      if (pipelineStage) {
        pipelineStage.status = PipelineStatus.RUNNING;
      }

      this.pipelineRunsSubject.next([...this.mockPipelineRuns]);
      this.pipelinesSubject.next([...this.mockPipelines]);

      // Check if approval is required before the deploy stage
      if (pipeline.approvalRequired && currentStage.name.toLowerCase() === 'deploy') {
        pipeline.status = PipelineStatus.WAITING_APPROVAL;
        pipeline.approvalStatus = ApprovalStatus.PENDING;
        pipelineRun.status = PipelineStatus.WAITING_APPROVAL;
        pipelineRun.approvalStatus = ApprovalStatus.PENDING;
        currentStage.status = PipelineStatus.WAITING_APPROVAL;

        // Update pipeline stage status
        if (pipelineStage) {
          pipelineStage.status = PipelineStatus.WAITING_APPROVAL;
        }

        this.pipelineRunsSubject.next([...this.mockPipelineRuns]);
        this.pipelinesSubject.next([...this.mockPipelines]);

        // Don't proceed to next stage until approval
        return;
      }

      // Simulate stage execution time (2-5 seconds)
      const executionTime = 2000 + Math.random() * 3000;

      setTimeout(() => {
        // Complete stage
        currentStage.status = PipelineStatus.SUCCEEDED;
        currentStage.completedAt = new Date();
        currentStage.duration = Math.floor((currentStage.completedAt.getTime() - currentStage.startedAt!.getTime()) / 1000);

        // Update pipeline stage status
        if (pipelineStage) {
          pipelineStage.status = PipelineStatus.SUCCEEDED;
        }

        this.pipelineRunsSubject.next([...this.mockPipelineRuns]);
        this.pipelinesSubject.next([...this.mockPipelines]);

        // Move to next stage
        currentStageIndex++;
        runStage();
      }, executionTime);
    };

    // Start execution
    runStage();
  }

  // Approve or reject a pipeline
  approvePipeline(pipelineId: string, approved: boolean, userId: string): Observable<Pipeline> {
    const pipeline = this.mockPipelines.find(p => p.id === pipelineId);

    if (!pipeline) {
      throw new Error(`Pipeline with ID ${pipelineId} not found`);
    }

    // Find the current run
    const pipelineRun = this.mockPipelineRuns.find(
      run => run.pipelineId === pipelineId && run.status === PipelineStatus.WAITING_APPROVAL
    );

    if (!pipelineRun) {
      throw new Error(`No pipeline run waiting for approval found for pipeline ${pipelineId}`);
    }

    // Update approval status
    pipeline.approvalStatus = approved ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED;
    pipeline.approvedBy = userId;
    pipeline.approvedAt = new Date();

    pipelineRun.approvalStatus = approved ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED;
    pipelineRun.approvedBy = userId;
    pipelineRun.approvedAt = new Date();

    // Update pipeline and run status
    if (approved) {
      // Continue pipeline execution
      pipeline.status = PipelineStatus.RUNNING;
      pipelineRun.status = PipelineStatus.RUNNING;

      // Find the deploy stage and continue
      const deployStage = pipelineRun.stages.find(stage => stage.name.toLowerCase() === 'deploy');

      // Find the corresponding pipeline stage
      const pipelineDeployStage = pipeline.stages.find(stage =>
        stage.name.toLowerCase() === 'deploy' ||
        (deployStage && stage.id === deployStage.stageId)
      );

      if (deployStage) {
        deployStage.status = PipelineStatus.RUNNING;
        deployStage.startedAt = new Date();

        // Update pipeline stage status
        if (pipelineDeployStage) {
          pipelineDeployStage.status = PipelineStatus.RUNNING;
        }

        this.pipelineRunsSubject.next([...this.mockPipelineRuns]);
        this.pipelinesSubject.next([...this.mockPipelines]);

        // Simulate stage execution
        setTimeout(() => {
          deployStage.status = PipelineStatus.SUCCEEDED;
          deployStage.completedAt = new Date();
          deployStage.duration = Math.floor((deployStage.completedAt.getTime() - deployStage.startedAt!.getTime()) / 1000);

          // Update pipeline stage status
          if (pipelineDeployStage) {
            pipelineDeployStage.status = PipelineStatus.SUCCEEDED;
          }

          // Complete pipeline
          pipelineRun.status = PipelineStatus.SUCCEEDED;
          pipelineRun.completedAt = new Date();
          pipelineRun.duration = Math.floor((pipelineRun.completedAt.getTime() - pipelineRun.startedAt.getTime()) / 1000);

          pipeline.status = PipelineStatus.SUCCEEDED;

          // Update all remaining pipeline stages to succeeded
          let foundDeployStage = false;
          pipeline.stages.forEach(stage => {
            if (foundDeployStage || stage.name.toLowerCase() === 'deploy') {
              stage.status = PipelineStatus.SUCCEEDED;
              foundDeployStage = true;
            }
          });

          this.pipelineRunsSubject.next([...this.mockPipelineRuns]);
          this.pipelinesSubject.next([...this.mockPipelines]);
        }, 3000);
      }
    } else {
      // Reject pipeline
      pipeline.status = PipelineStatus.CANCELED;
      pipelineRun.status = PipelineStatus.CANCELED;
      pipelineRun.completedAt = new Date();
      pipelineRun.duration = Math.floor((pipelineRun.completedAt.getTime() - pipelineRun.startedAt.getTime()) / 1000);

      // Find the deploy stage and mark as canceled
      const deployStage = pipelineRun.stages.find(stage => stage.name.toLowerCase() === 'deploy');

      // Find the corresponding pipeline stage
      const pipelineDeployStage = pipeline.stages.find(stage =>
        stage.name.toLowerCase() === 'deploy' ||
        (deployStage && stage.id === deployStage.stageId)
      );

      if (deployStage) {
        deployStage.status = PipelineStatus.CANCELED;

        // Update pipeline stage status
        if (pipelineDeployStage) {
          pipelineDeployStage.status = PipelineStatus.CANCELED;
        }
      }

      // Update all remaining pipeline stages to canceled
      let foundDeployStage = false;
      pipeline.stages.forEach(stage => {
        if (foundDeployStage || stage.name.toLowerCase() === 'deploy') {
          stage.status = PipelineStatus.CANCELED;
          foundDeployStage = true;
        }
      });
    }

    this.pipelineRunsSubject.next([...this.mockPipelineRuns]);
    this.pipelinesSubject.next([...this.mockPipelines]);

    return of(pipeline).pipe(delay(500)); // Add a small delay to simulate API call
  }
}