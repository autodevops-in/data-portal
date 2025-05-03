import { Routes } from '@angular/router';
import { AzureDevOpsPipelinesComponent } from './azure-devops-pipelines.component';

export const AZURE_DEVOPS_ROUTES: Routes = [
  {
    path: '',
    component: AzureDevOpsPipelinesComponent,
    data: {
      title: 'Azure DevOps Pipelines'
    }
  }
];