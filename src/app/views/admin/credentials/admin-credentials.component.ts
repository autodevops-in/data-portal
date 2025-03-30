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
import { ToolService } from '../../../services/tool.service';
import { ProjectService } from '../../../services/project.service';
import { Tool, ToolCredential } from '../../../models/tool.model';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-admin-credentials',
  templateUrl: './admin-credentials.component.html',
  styleUrls: ['./admin-credentials.component.scss'],
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
    ToastComponent
  ]
})
export class AdminCredentialsComponent implements OnInit {
  credentials: ToolCredential[] = [];
  tools: Tool[] = [];
  projects: Project[] = [];
  credentialForm: FormGroup;
  showModal = false;
  isEditMode = false;
  currentCredentialId: string | null = null;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  selectedTool: Tool | null = null;

  constructor(
    private toolService: ToolService,
    private projectService: ProjectService,
    private fb: FormBuilder
  ) {
    this.credentialForm = this.fb.group({
      name: ['', [Validators.required]],
      toolId: ['', [Validators.required]],
      projectId: ['', [Validators.required]],
      credentialData: this.fb.group({})
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // In a real app, you would load credentials from an API
    // For now, we'll use our mock data
    this.toolService.getAllTools().subscribe(tools => {
      this.tools = tools;
    });

    this.projectService.getFlatProjectList().subscribe(projects => {
      this.projects = projects;
    });

    // For demo purposes, we'll just show all credentials
    // In a real app, you might want to filter by project or tool
    this.loadCredentials();
  }

  loadCredentials(): void {
    // In a real app, you would load credentials from an API
    // For now, we'll use our mock data
    this.credentials = [];
    this.tools.forEach(tool => {
      this.toolService.getCredentialsByTool(tool.id).subscribe(creds => {
        this.credentials = [...this.credentials, ...creds];
      });
    });
  }

  openModal(isEdit = false, credential?: ToolCredential): void {
    this.isEditMode = isEdit;
    this.showModal = true;
    this.selectedTool = null;
    
    // Reset the form with a new empty credentialData group
    this.credentialForm = this.fb.group({
      name: ['', [Validators.required]],
      toolId: ['', [Validators.required]],
      projectId: ['', [Validators.required]],
      credentialData: this.fb.group({})
    });
    
    if (isEdit && credential) {
      this.currentCredentialId = credential.id;
      this.credentialForm.patchValue({
        name: credential.name,
        toolId: credential.toolId,
        projectId: credential.projectId
      });
      
      // Find the tool to determine what credential fields to show
      this.toolService.getToolById(credential.toolId).subscribe(tool => {
        if (tool) {
          this.selectedTool = tool;
          this.updateCredentialDataForm(tool.type, credential.credentialData);
        }
      });
    } else {
      this.currentCredentialId = null;
    }
  }

  onToolChange(event: any): void {
    const toolId = event.target.value;
    if (toolId) {
      this.toolService.getToolById(toolId).subscribe(tool => {
        if (tool) {
          this.selectedTool = tool;
          this.updateCredentialDataForm(tool.type);
        }
      });
    } else {
      this.selectedTool = null;
      this.updateCredentialDataForm('');
    }
  }

  updateCredentialDataForm(toolType: string, existingData: any = {}): void {
    // Create form controls based on the tool type
    const credentialDataGroup = this.fb.group({});
    
    switch (toolType) {
      case 'SCM':
        credentialDataGroup.addControl('token', this.fb.control(existingData.token || '', [Validators.required]));
        break;
      case 'CI/CD':
        credentialDataGroup.addControl('username', this.fb.control(existingData.username || '', [Validators.required]));
        credentialDataGroup.addControl('apiKey', this.fb.control(existingData.apiKey || '', [Validators.required]));
        break;
      case 'Cloud':
        credentialDataGroup.addControl('accessKey', this.fb.control(existingData.accessKey || '', [Validators.required]));
        credentialDataGroup.addControl('secretKey', this.fb.control(existingData.secretKey || '', [Validators.required]));
        credentialDataGroup.addControl('region', this.fb.control(existingData.region || ''));
        break;
      default:
        credentialDataGroup.addControl('data', this.fb.control(existingData.data || ''));
        break;
    }
    
    this.credentialForm.setControl('credentialData', credentialDataGroup);
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedTool = null;
  }

  saveCredential(): void {
    if (this.credentialForm.invalid) {
      return;
    }

    const formValues = this.credentialForm.value;
    const credentialData = {
      name: formValues.name,
      toolId: formValues.toolId,
      projectId: formValues.projectId,
      credentialData: formValues.credentialData
    };

    if (this.isEditMode && this.currentCredentialId) {
      // Update existing credential
      this.toolService.updateCredential(this.currentCredentialId, credentialData).subscribe(credential => {
        if (credential) {
          this.showToastMessage('Credential updated successfully', 'success');
          this.loadCredentials();
        } else {
          this.showToastMessage('Failed to update credential', 'danger');
        }
      });
    } else {
      // Create new credential
      this.toolService.createCredential(credentialData).subscribe(credential => {
        this.showToastMessage('Credential created successfully', 'success');
        this.loadCredentials();
      });
    }

    this.closeModal();
  }

  deleteCredential(credential: ToolCredential): void {
    if (confirm(`Are you sure you want to delete ${credential.name}?`)) {
      this.toolService.deleteCredential(credential.id).subscribe(success => {
        if (success) {
          this.showToastMessage('Credential deleted successfully', 'success');
          this.loadCredentials();
        } else {
          this.showToastMessage('Failed to delete credential', 'danger');
        }
      });
    }
  }

  getToolName(toolId: string): string {
    const tool = this.tools.find(t => t.id === toolId);
    return tool ? tool.name : 'Unknown Tool';
  }

  getProjectName(projectId: string): string {
    const project = this.projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
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