import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  // Mock data for projects
  private mockProjects: Project[] = [
    {
      id: 'proj-1',
      name: 'Main Project',
      description: 'Main project containing all subprojects',
      environment: 'Production',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-06-15'),
      children: [
        {
          id: 'proj-2',
          name: 'Frontend Application',
          description: 'Customer-facing web application',
          repositoryUrl: 'https://github.com/org/frontend',
          deploymentEnvironments: ['Development', 'Staging', 'Production'],
          environment: 'Production',
          createdAt: new Date('2023-01-15'),
          updatedAt: new Date('2023-06-20'),
          parentId: 'proj-1',
          teamMembers: ['user1', 'user2', 'user3']
        },
        {
          id: 'proj-3',
          name: 'Backend API',
          description: 'RESTful API services',
          repositoryUrl: 'https://github.com/org/backend-api',
          deploymentEnvironments: ['Development', 'Staging', 'Production'],
          environment: 'Staging',
          createdAt: new Date('2023-01-20'),
          updatedAt: new Date('2023-06-25'),
          parentId: 'proj-1',
          teamMembers: ['user2', 'user4', 'user5'],
          children: [
            {
              id: 'proj-6',
              name: 'Authentication Service',
              description: 'User authentication and authorization service',
              repositoryUrl: 'https://github.com/org/auth-service',
              deploymentEnvironments: ['Development', 'Staging', 'Production'],
              environment: 'Development',
              createdAt: new Date('2023-02-15'),
              updatedAt: new Date('2023-07-10'),
              parentId: 'proj-3',
              teamMembers: ['user2', 'user5']
            },
            {
              id: 'proj-7',
              name: 'Data Processing Service',
              description: 'Service for processing and analyzing data',
              repositoryUrl: 'https://github.com/org/data-processing',
              deploymentEnvironments: ['Development', 'Staging', 'Production'],
              environment: 'Production',
              createdAt: new Date('2023-02-20'),
              updatedAt: new Date('2023-07-15'),
              parentId: 'proj-3',
              teamMembers: ['user4', 'user5']
            }
          ]
        },
        {
          id: 'proj-4',
          name: 'Mobile App',
          description: 'iOS and Android mobile application',
          repositoryUrl: 'https://github.com/org/mobile-app',
          deploymentEnvironments: ['Development', 'TestFlight', 'Production'],
          environment: 'TestFlight',
          createdAt: new Date('2023-01-25'),
          updatedAt: new Date('2023-06-30'),
          parentId: 'proj-1',
          teamMembers: ['user1', 'user6', 'user7']
        },
        {
          id: 'proj-5',
          name: 'Infrastructure',
          description: 'Cloud infrastructure and DevOps',
          repositoryUrl: 'https://github.com/org/infrastructure',
          deploymentEnvironments: ['Development', 'Staging', 'Production'],
          environment: 'Staging',
          createdAt: new Date('2023-01-30'),
          updatedAt: new Date('2023-07-05'),
          parentId: 'proj-1',
          teamMembers: ['user8', 'user9']
        }
      ]
    }
  ];

  private currentProjectSubject = new BehaviorSubject<Project | null>(null);
  public currentProject$ = this.currentProjectSubject.asObservable();

  constructor() {
    // Initialize with the main project
    this.setCurrentProject(this.mockProjects[0]);
  }

  getAllProjects(): Observable<Project[]> {
    return of(this.mockProjects);
  }

  getProjectById(id: string): Observable<Project | undefined> {
    const findProject = (projects: Project[], projectId: string): Project | undefined => {
      for (const project of projects) {
        if (project.id === projectId) {
          return project;
        }
        if (project.children && project.children.length > 0) {
          const found = findProject(project.children, projectId);
          if (found) {
            return found;
          }
        }
      }
      return undefined;
    };

    const project = findProject(this.mockProjects, id);
    return of(project);
  }

  setCurrentProject(project: Project | null): void {
    this.currentProjectSubject.next(project);
  }

  getProjectHierarchy(): Observable<Project[]> {
    return of(this.mockProjects);
  }

  // Helper method to flatten the project hierarchy for navigation
  getFlatProjectList(): Observable<Project[]> {
    const flattenProjects = (projects: Project[], result: Project[] = []): Project[] => {
      for (const project of projects) {
        result.push(project);
        if (project.children && project.children.length > 0) {
          flattenProjects(project.children, result);
        }
      }
      return result;
    };

    return of(flattenProjects(this.mockProjects, []));
  }
}