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
import { Tool } from '../../../models/tool.model';

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.scss'],
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
export class AdminToolsComponent implements OnInit {
  tools: Tool[] = [];
  toolForm: FormGroup;
  showModal = false;
  isEditMode = false;
  currentToolId: string | null = null;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(
    private toolService: ToolService,
    private fb: FormBuilder
  ) {
    this.toolForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
      icon: ['']
    });
  }

  ngOnInit(): void {
    this.loadTools();
  }

  loadTools(): void {
    this.toolService.getAllTools().subscribe(tools => {
      this.tools = tools;
    });
  }

  openModal(isEdit = false, tool?: Tool): void {
    this.isEditMode = isEdit;
    this.showModal = true;
    
    if (isEdit && tool) {
      this.currentToolId = tool.id;
      this.toolForm.patchValue({
        name: tool.name,
        description: tool.description,
        type: tool.type,
        icon: tool.icon || ''
      });
    } else {
      this.currentToolId = null;
      this.toolForm.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.toolForm.reset();
  }

  saveTool(): void {
    if (this.toolForm.invalid) {
      return;
    }

    const formValues = this.toolForm.value;
    const toolData = {
      name: formValues.name,
      description: formValues.description,
      type: formValues.type,
      icon: formValues.icon || undefined
    };

    if (this.isEditMode && this.currentToolId) {
      // Update existing tool
      this.toolService.updateTool(this.currentToolId, toolData).subscribe(tool => {
        if (tool) {
          this.showToastMessage('Tool updated successfully', 'success');
          this.loadTools();
        } else {
          this.showToastMessage('Failed to update tool', 'danger');
        }
      });
    } else {
      // Create new tool
      this.toolService.createTool(toolData).subscribe(tool => {
        this.showToastMessage('Tool created successfully', 'success');
        this.loadTools();
      });
    }

    this.closeModal();
  }

  deleteTool(tool: Tool): void {
    if (confirm(`Are you sure you want to delete ${tool.name}?`)) {
      this.toolService.deleteTool(tool.id).subscribe(success => {
        if (success) {
          this.showToastMessage('Tool deleted successfully', 'success');
          this.loadTools();
        } else {
          this.showToastMessage('Failed to delete tool', 'danger');
        }
      });
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