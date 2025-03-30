import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PipelineService } from '../../../services/pipeline.service';
import { ProjectService } from '../../../services/project.service';
import { Pipeline, PipelineStatus } from '../../../models/pipeline.model';
import { Project } from '../../../models/project.model';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  TableDirective,
  BadgeComponent,
  ButtonDirective, // Ensure this is used for simpler button styling
  ModalComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  SpinnerComponent,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbRouterComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-pipeline-list',
  templateUrl: './pipeline-list.component.html',
  styleUrls: ['./pipeline-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    TableDirective,
    BadgeComponent,
    ButtonDirective, // Ensure this is used for simpler button styling
    ModalComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    IconDirective,
    SpinnerComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    BreadcrumbRouterComponent
  ]
})
export class PipelineListComponent implements OnInit, OnDestroy {
  pipelines: Pipeline[] = [];
  currentProject: Project | null = null;
  projectId: string | null = null;
  approvalModalVisible = false;
  runPipelineModalVisible = false;
  selectedPipeline: Pipeline | null = null;
  isApproving = false;
  isRunningPipeline = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private pipelineService: PipelineService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        this.projectId = params.get('projectId');
        if (this.projectId) {
          this.loadProjectPipelines(this.projectId);
        } else {
          this.loadAllPipelines();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadAllPipelines(): void {
    this.subscriptions.push(
      this.pipelineService.getPipelines().subscribe(pipelines => {
        this.pipelines = pipelines;
      })
    );
  }

  loadProjectPipelines(projectId: string): void {
    this.subscriptions.push(
      this.pipelineService.getPipelinesByProjectId(projectId).subscribe(pipelines => {
        this.pipelines = pipelines;
      })
    );
  }

  openCreatePipelineModal(): void {
    // Logic to open the create pipeline modal
    console.log('Open create pipeline modal');
  }

  openApprovalModal(pipeline: Pipeline): void {
    this.selectedPipeline = pipeline;
    this.approvalModalVisible = true;
  }

  closeApprovalModal(): void {
    if (!this.isApproving) {
      this.approvalModalVisible = false; // Allow closing only if not approving
    }
  }

  approvePipeline(approve: boolean): void {
    if (!this.selectedPipeline) return;

    this.isApproving = true;

    // Simulate approval/rejection logic with a seamless state update
    setTimeout(() => {
      if (approve) {
        if (this.selectedPipeline) {
          console.log(`Pipeline "${this.selectedPipeline.name}" approved.`);
          this.selectedPipeline.status = PipelineStatus.SUCCEEDED;
        }
      } else {
        if (this.selectedPipeline) {
          console.log(`Pipeline "${this.selectedPipeline.name}" rejected.`);
          this.selectedPipeline.status = PipelineStatus.CANCELED;
        }
      }

      this.isApproving = false; // Reset the approving state
      this.approvalModalVisible = false; // Close the modal
    }, 2000);
  }

  closeRunPipelineModal(): void {
    this.runPipelineModalVisible = false;
  }

  runPipeline(): void {
    this.isRunningPipeline = true;
    // Simulate running pipeline logic
    setTimeout(() => {
      console.log('Pipeline run started');
      this.isRunningPipeline = false;
      this.closeRunPipelineModal();
    }, 2000);
  }

  getStatusBadgeColor(status: PipelineStatus): string {
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
      default:
        return 'secondary'; // Use simpler button color for dashboards
    }
  }

  getStatusText(status: PipelineStatus): string {
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
}