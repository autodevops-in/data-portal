import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { 
  CardComponent, 
  CardBodyComponent, 
  CardHeaderComponent,
  BadgeComponent,
  ButtonDirective,
  GridModule
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    BadgeComponent,
    ButtonDirective,
    IconDirective,
    GridModule
  ]
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  flatProjects: Project[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    // Get all projects
    const projectsSub = this.projectService.getAllProjects().subscribe(projects => {
      this.projects = projects;
    });
    
    // Get flat list of projects for easier display
    const flatProjectsSub = this.projectService.getFlatProjectList().subscribe(projects => {
      this.flatProjects = projects;
    });

    this.subscriptions.push(projectsSub, flatProjectsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getEnvironmentClass(environment?: string): string {
    if (!environment) return 'info';
    
    switch (environment.toLowerCase()) {
      case 'production':
        return 'success';
      case 'staging':
        return 'warning';
      case 'development':
        return 'info';
      case 'testflight':
        return 'primary';
      default:
        return 'secondary';
    }
  }

  getProjectIcon(project: Project): string {
    // Determine icon based on project name or type
    if (project.name.toLowerCase().includes('frontend')) {
      return 'cil-monitor';
    } else if (project.name.toLowerCase().includes('backend') || project.name.toLowerCase().includes('api')) {
      return 'cil-layers';
    } else if (project.name.toLowerCase().includes('mobile')) {
      return 'cil-mobile';
    } else if (project.name.toLowerCase().includes('infrastructure')) {
      return 'cil-storage';
    } else if (project.name.toLowerCase().includes('auth')) {
      return 'cil-lock-locked';
    } else if (project.name.toLowerCase().includes('data')) {
      return 'cil-chart';
    } else {
      return 'cil-folder';
    }
  }
}