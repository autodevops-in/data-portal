import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./project-list.component').then(m => m.ProjectListComponent),
    data: {
      title: 'Projects'
    }
  }
];