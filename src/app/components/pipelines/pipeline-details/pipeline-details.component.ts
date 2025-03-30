import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { throttleTime, take, finalize } from 'rxjs/operators';
import { PipelineService } from '../../../services/pipeline.service';
import { Pipeline, PipelineRun, PipelineStatus, PipelineStage, PipelineStageRun } from '../../../models/pipeline.model';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ProgressComponent,
  ProgressBarComponent,
  BadgeComponent,
  ButtonDirective,
  ListGroupDirective,
  ListGroupItemDirective
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-pipeline-details',
  templateUrl: './pipeline-details.component.html',
  styleUrls: ['./pipeline-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ProgressComponent,
    ProgressBarComponent,
    BadgeComponent,
    ButtonDirective,
    IconDirective,
    ListGroupDirective,
    ListGroupItemDirective
  ]
})
export class PipelineDetailsComponent implements OnInit, OnDestroy {
  @Input() pipelineId: string = '';
  
  pipeline: Pipeline | null = null;
  pipelineRuns: PipelineRun[] = [];
  currentRun: PipelineRun | null = null;
  isRunningPipeline = false; // Add a flag to track the button state
  public isPipelineRunning = false; // Change visibility to public
  
  private subscriptions: Subscription[] = [];

  constructor(private pipelineService: PipelineService) {}

  ngOnInit(): void {
    if (this.pipelineId) {
      this.loadPipeline();
      this.loadPipelineRuns();
    }
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());

    // Clear any pending timeouts
    if (this.runTimeoutId) {
      clearTimeout(this.runTimeoutId);
      this.runTimeoutId = null;
    }
  }

  loadPipeline(): void {
    this.subscriptions.push(
      this.pipelineService.getPipelineById(this.pipelineId).subscribe(pipeline => {
        this.pipeline = pipeline || null;
      })
    );
  }

  loadPipelineRuns(): void {
    this.subscriptions.push(
      this.pipelineService.getPipelineRuns(this.pipelineId).subscribe(runs => {
        this.pipelineRuns = runs;
        // Get the most recent run
        if (runs.length > 0) {
          this.currentRun = runs[runs.length - 1];
        }
      })
    );
  }

  // Track the timeout ID to clear it if needed
  private runTimeoutId: any = null;

  runPipeline(): void {
    if (this.isRunningPipeline || !this.pipeline || this.isPipelineRunning) {
      return; // Prevent multiple clicks or running without a pipeline
    }

    // Set flags to true in a single change detection cycle
    Promise.resolve().then(() => {
      this.isRunningPipeline = true;
      this.isPipelineRunning = true;
    });

    // Use a default user ID for now
    const userId = 'current-user';

    // Create a subscription to handle the pipeline trigger
    const subscription = this.pipelineService.triggerPipeline(this.pipelineId, userId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          // Load the updated pipeline data after successful trigger
          this.loadPipelineRuns();

          // Set a timeout to reset the state
          this.runTimeoutId = setTimeout(() => {
            // Use Promise.resolve to ensure state changes happen in a single change detection cycle
            Promise.resolve().then(() => {
              this.isRunningPipeline = false;
              this.isPipelineRunning = false;
              this.runTimeoutId = null;
            });
          }, 2000); // Longer delay to ensure the state is stable
        },
        error: (error) => {
          console.error('Error running pipeline:', error);

          // Reset state on error
          Promise.resolve().then(() => {
            this.isRunningPipeline = false;
            this.isPipelineRunning = false;
          });
        }
      });

    // Add this subscription to be cleaned up on component destruction
    this.subscriptions.push(subscription);
  }

  getStageStatusColor(status: PipelineStatus): string {
    switch (status) {
      case PipelineStatus.RUNNING:
        return 'primary';
      case PipelineStatus.SUCCEEDED:
        return 'success';
      case PipelineStatus.FAILED:
        return 'danger';
      case PipelineStatus.CANCELED:
        return 'warning';
      case PipelineStatus.WAITING_APPROVAL:
        return 'info';
      case PipelineStatus.QUEUED:
        return 'secondary';
      default:
        return 'light';
    }
  }

  getStageStatusText(status: PipelineStatus): string {
    switch (status) {
      case PipelineStatus.IDLE:
        return 'Idle';
      case PipelineStatus.QUEUED:
        return 'Queued';
      case PipelineStatus.RUNNING:
        return 'Running';
      case PipelineStatus.SUCCEEDED:
        return 'Succeeded';
      case PipelineStatus.FAILED:
        return 'Failed';
      case PipelineStatus.CANCELED:
        return 'Canceled';
      case PipelineStatus.WAITING_APPROVAL:
        return 'Waiting Approval';
      default:
        return status;
    }
  }

  getStageIcon(status: PipelineStatus): string {
    switch (status) {
      case PipelineStatus.RUNNING:
        return 'cilSync';
      case PipelineStatus.SUCCEEDED:
        return 'cilCheckAlt';
      case PipelineStatus.FAILED:
        return 'cilX';
      case PipelineStatus.CANCELED:
        return 'cilBan';
      case PipelineStatus.WAITING_APPROVAL:
        return 'cilUserFollow';
      case PipelineStatus.QUEUED:
        return 'cilHourglass';
      default:
        return 'cilMediaPlay';
    }
  }

  getOverallProgress(): number {
    if (!this.currentRun || !this.currentRun.stages || this.currentRun.stages.length === 0) {
      return 0;
    }

    const totalStages = this.currentRun.stages.length;
    const completedStages = this.currentRun.stages.filter(
      stage => stage.status === PipelineStatus.SUCCEEDED
    ).length;

    return Math.round((completedStages / totalStages) * 100);
  }

  isStageActive(stage: PipelineStageRun): boolean {
    return stage.status === PipelineStatus.RUNNING || 
           stage.status === PipelineStatus.WAITING_APPROVAL;
  }
}