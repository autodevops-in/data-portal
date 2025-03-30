import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ModalModule,
  TableModule,
  ToastModule,
  ToastComponent
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { FilterPipe } from '../../../pipes/filter.pipe';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    IconModule,
    ModalModule,
    FormModule,
    ReactiveFormsModule,
    GridModule,
    ToastModule,
    ToastComponent,
    FilterPipe
  ]
})
export class AdminProjectsComponent implements OnInit {
  projects: Project[] = [];
  flatProjects: Project[] = [];
  projectForm: FormGroup;
  showModal = false;
  isEditMode = false;
  currentProjectId: string | null = null;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(
    private projectService: ProjectService,
    private fb: FormBuilder
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      repositoryUrl: [''],
      parentId: [''],
      deploymentEnvironments: ['']
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe(projects => {
      this.projects = projects;
    });

    this.projectService.getFlatProjectList().subscribe(projects => {
      this.flatProjects = projects;
    });
  }

  openModal(isEdit = false, project?: Project): void {
    this.isEditMode = isEdit;
    this.showModal = true;
    
    if (isEdit && project) {
      this.currentProjectId = project.id;
      this.projectForm.patchValue({
        name: project.name,
        description: project.description,
        repositoryUrl: project.repositoryUrl || '',
        parentId: project.parentId || '',
        deploymentEnvironments: project.deploymentEnvironments ? project.deploymentEnvironments.join(', ') : ''
      });
    } else {
      this.currentProjectId = null;
      this.projectForm.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.projectForm.reset();
  }

  saveProject(): void {
    if (this.projectForm.invalid) {
      return;
    }

    const formValues = this.projectForm.value;
    const projectData: Partial<Project> = {
      name: formValues.name,
      description: formValues.description,
      repositoryUrl: formValues.repositoryUrl || undefined,
      parentId: formValues.parentId || undefined,
      deploymentEnvironments: formValues.deploymentEnvironments ? 
        formValues.deploymentEnvironments.split(',').map((env: string) => env.trim()) : 
        undefined
    };

    // In a real application, you would call an API to save the project
    // For now, we'll just update our mock data
    if (this.isEditMode && this.currentProjectId) {
      // Update existing project
      this.projectService.getProjectById(this.currentProjectId).subscribe(project => {
        if (project) {
          // In a real app, you would call an update API here
          // For now, we'll just show a success message
          this.showToastMessage('Project updated successfully', 'success');
        }
      });
    } else {
      // Create new project
      // In a real app, you would call a create API here
      // For now, we'll just show a success message
      this.showToastMessage('Project created successfully', 'success');
    }

    this.closeModal();
    this.loadProjects(); // Reload projects to reflect changes
  }

  deleteProject(project: Project): void {
    if (confirm(`Are you sure you want to delete ${project.name}?`)) {
      // In a real app, you would call a delete API here
      // For now, we'll just show a success message
      this.showToastMessage('Project deleted successfully', 'success');
      this.loadProjects(); // Reload projects to reflect changes
    }
  }

  showToastMessage(message: string, color: string): void {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}