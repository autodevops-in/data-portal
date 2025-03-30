import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { PipelineService } from '../../../services/pipeline.service';
import { ProjectService } from '../../../services/project.service';
import { Pipeline } from '../../../models/pipeline.model';
import { Project } from '../../../models/project.model';
import { PipelineListComponent } from '../pipeline-list/pipeline-list.component';
import { PipelineDetailsComponent } from '../pipeline-details/pipeline-details.component';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent
} from '@coreui/angular';
import {
  TabsComponent,
  TabDirective,
  TabPanelComponent,
  TabsContentComponent,
  TabsListComponent
} from '@coreui/angular';

@Component({
  selector: 'app-pipeline-management',
  templateUrl: './pipeline-management.component.html',
  styleUrls: ['./pipeline-management.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    PipelineListComponent,
    PipelineDetailsComponent,
    TabsComponent,
    TabDirective,
    TabPanelComponent,
    TabsContentComponent,
    TabsListComponent
  ]
})
export class PipelineManagementComponent implements OnInit, OnDestroy {
  pipelines: Pipeline[] = [];
  currentProject: Project | null = null;
  selectedPipelineId: string = '';
  activeTabIndex = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private pipelineService: PipelineService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // Subscribe to current project changes
    this.subscriptions.push(
      this.projectService.currentProject$.subscribe(project => {
        this.currentProject = project;
        if (project) {
          // Load pipelines for this project
          this.loadProjectPipelines(project.id);
        } else {
          // Load all pipelines if no project is selected
          this.loadAllPipelines();
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadAllPipelines(): void {
    this.subscriptions.push(
      this.pipelineService.getPipelines().subscribe(pipelines => {
        this.pipelines = pipelines;
        // Select the first pipeline by default
        if (pipelines.length > 0 && !this.selectedPipelineId) {
          this.selectedPipelineId = pipelines[0].id;
        }
      })
    );
  }

  loadProjectPipelines(projectId: string): void {
    this.subscriptions.push(
      this.pipelineService.getPipelinesByProjectId(projectId).subscribe(pipelines => {
        this.pipelines = pipelines;
        // Select the first pipeline by default
        if (pipelines.length > 0) {
          this.selectedPipelineId = pipelines[0].id;
        } else {
          this.selectedPipelineId = '';
        }
      })
    );
  }

  selectPipeline(pipelineId: string): void {
    this.selectedPipelineId = pipelineId;
  }

  setActiveTab(index: number): void {
    this.activeTabIndex = index;
  }
}