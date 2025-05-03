import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CardModule, GridModule, ButtonModule, FormModule, SpinnerModule, BadgeModule, TableModule, AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { AzureDevOpsPipelinesComponent } from './azure-devops-pipelines.component';
import { AZURE_DEVOPS_ROUTES } from './routes';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(AZURE_DEVOPS_ROUTES),
    CardModule,
    GridModule,
    ButtonModule,
    FormModule,
    SpinnerModule,
    BadgeModule,
    TableModule,
    AlertModule,
    IconModule
  ],
  declarations: [
    AzureDevOpsPipelinesComponent
  ]
})
export class AzureDevOpsModule { }