import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../components/pipelines/pipeline-list/pipeline-list.component').then(m => m.PipelineListComponent),
    data: {
      title: 'Pipelines'
    }
  },
  {
    path: 'project/:projectId',
    loadComponent: () => import('../../components/pipelines/pipeline-list/pipeline-list.component').then(m => m.PipelineListComponent),
    data: {
      title: 'Project Pipelines'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('../../components/pipelines/pipeline-details/pipeline-details.component').then(m => m.PipelineDetailsComponent),
    data: {
      title: 'Pipeline Details'
    }
  },
  {
    path: 'project/:projectId/:id',
    loadComponent: () => import('../../components/pipelines/pipeline-details/pipeline-details.component').then(m => m.PipelineDetailsComponent),
    data: {
      title: 'Project Pipeline Details'
    }
  }
];
