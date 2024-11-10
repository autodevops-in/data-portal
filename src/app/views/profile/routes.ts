import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./profile.component').then(m => m.ProfileComponent),
    data: {
      title: `Profile`
    }
  }
];

