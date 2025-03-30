import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PipelineRunService } from '../../../services/pipeline-run.service';
import { PipelineRun, PipelineRunStatus } from '../../../models/pipeline-run.model';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { Subscription } from 'rxjs';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  TableDirective,
  TableColorDirective,
  ProgressComponent,
  ProgressBarDirective,
  BadgeComponent,
  AvatarComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-pipeline-runs',
  templateUrl: './pipeline-runs.component.html',
  styleUrls: ['./pipeline-runs.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    TableDirective,
    TableColorDirective,
    ProgressComponent,
    ProgressBarDirective,
    BadgeComponent,
    AvatarComponent,
    IconDirective
  ]
})
export class PipelineRunsComponent implements OnInit {
  @Input() limit: number = 5;
  @Input() showHeader: boolean = true;
  @Input() projectId?: string;
  
  pipelineRuns: PipelineRun[] = [];
  currentProject: Project | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private pipelineRunService: PipelineRunService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // Subscribe to current project changes
    this.subscriptions.push(
      this.projectService.currentProject$.subscribe(project => {
        this.currentProject = project;
        if (project && !this.projectId) {
          // Load pipeline runs for this project
          this.loadProjectPipelineRuns(project.id);
        } else if (this.projectId) {
          // Load pipeline runs for the specified project
          this.loadProjectPipelineRuns(this.projectId);
        } else {
          // Load all recent pipeline runs if no project is selected
          this.loadRecentPipelineRuns();
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadRecentPipelineRuns(): void {
    this.subscriptions.push(
      this.pipelineRunService.getRecentPipelineRuns(this.limit).subscribe(runs => {
        this.pipelineRuns = runs;
      })
    );
  }

  loadProjectPipelineRuns(projectId: string): void {
    this.subscriptions.push(
      this.pipelineRunService.getPipelineRunsByProjectId(projectId).subscribe(runs => {
        // Sort by startedAt date (newest first) and take the first 'limit' items
        this.pipelineRuns = runs
          .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
          .slice(0, this.limit);
      })
    );
  }

  getStatusText(status: PipelineRunStatus): string {
    switch (status) {
      case PipelineRunStatus.QUEUED:
        return 'Queued';
      case PipelineRunStatus.RUNNING:
        return 'In Progress';
      case PipelineRunStatus.SUCCEEDED:
        return 'Success';
      case PipelineRunStatus.FAILED:
        return 'Failed';
      case PipelineRunStatus.CANCELED:
        return 'Canceled';
      case PipelineRunStatus.WAITING_APPROVAL:
        return 'Waiting Approval';
      default:
        return status;
    }
  }

  getStatusColor(status: PipelineRunStatus): string {
    switch (status) {
      case PipelineRunStatus.RUNNING:
        return 'warning';
      case PipelineRunStatus.SUCCEEDED:
        return 'success';
      case PipelineRunStatus.FAILED:
        return 'danger';
      case PipelineRunStatus.CANCELED:
        return 'secondary';
      case PipelineRunStatus.WAITING_APPROVAL:
        return 'info';
      case PipelineRunStatus.QUEUED:
        return 'primary';
      default:
        return 'secondary';
    }
  }

  getEnvironmentColor(environment: string): string {
    switch (environment.toLowerCase()) {
      case 'production':
        return 'primary';
      case 'staging':
        return 'success';
      case 'development':
        return 'info';
      case 'testflight':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getStatusValue(status: PipelineRunStatus): number {
    switch (status) {
      case PipelineRunStatus.QUEUED:
        return 0;
      case PipelineRunStatus.RUNNING:
        return 60;
      case PipelineRunStatus.SUCCEEDED:
        return 100;
      case PipelineRunStatus.FAILED:
        return 25;
      case PipelineRunStatus.CANCELED:
        return 50;
      case PipelineRunStatus.WAITING_APPROVAL:
        return 80;
      default:
        return 0;
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMins / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  formatDuration(seconds?: number): string {
    if (!seconds) return '-';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }
}