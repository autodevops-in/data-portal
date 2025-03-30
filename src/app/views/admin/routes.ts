import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminProjectsComponent } from './projects/admin-projects.component';
import { AdminToolsComponent } from './tools/admin-tools.component';
import { AdminCredentialsComponent } from './credentials/admin-credentials.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { AdminGuard } from '../../guards/admin.guard';
import { PermissionsResolver } from '../../resolvers/permissions.resolver';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard],
    canActivateChild: [AdminGuard],
    resolve: {
      permissions: PermissionsResolver
    },
    children: [
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
      },
      {
        path: 'projects',
        component: AdminProjectsComponent,
        data: {
          title: 'Admin - Projects'
        }
      },
      {
        path: 'tools',
        component: AdminToolsComponent,
        data: {
          title: 'Admin - Tools'
        }
      },
      {
        path: 'credentials',
        component: AdminCredentialsComponent,
        data: {
          title: 'Admin - Credentials'
        }
      }
    ]
  }
];