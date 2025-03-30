import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import {
  NavComponent,
  NavItemComponent,
  NavLinkDirective,
  DropdownComponent,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BadgeComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-project-nav',
  templateUrl: './project-nav.component.html',
  styleUrls: ['./project-nav.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavComponent,
    NavItemComponent,
    NavLinkDirective,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    IconDirective,
    BadgeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectNavComponent implements OnInit {
  projects: Project[] = [];
  currentProject: Project | null = null;
  projectPath: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe(projects => {
      this.projects = projects;
    });

    this.projectService.currentProject$.subscribe(project => {
      this.currentProject = project;
      if (project) {
        this.buildProjectPath(project);
      }
    });
  }

  selectProject(project: Project): void {
    this.projectService.setCurrentProject(project);
  }

  private buildProjectPath(project: Project): void {
    this.projectPath = [];
    let currentId = project.parentId;
    this.projectPath.unshift(project);

    const findParent = (projects: Project[], parentId: string | undefined): Project | null => {
      if (!parentId) return null;
      
      for (const p of projects) {
        if (p.id === parentId) {
          return p;
        }
        if (p.children && p.children.length > 0) {
          const found = findParent(p.children, parentId);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    while (currentId) {
      const parent = findParent(this.projects, currentId);
      if (parent) {
        this.projectPath.unshift(parent);
        currentId = parent.parentId;
      } else {
        currentId = undefined;
      }
    }
  }

  // Recursive function to render project hierarchy
  renderProjectItem(project: Project): any {
    const item = {
      name: project.name,
      id: project.id,
      children: project.children ? project.children.map(child => this.renderProjectItem(child)) : undefined
    };
    return item;
  }
}