import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import {
  ButtonDirective, // Ensure this is used for simpler button styling
  ButtonGroupComponent,
  CardComponent,
  CardBodyComponent,
  DropdownComponent,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  BadgeComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

interface AIMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonDirective,
    ButtonGroupComponent,
    CardComponent,
    CardBodyComponent,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    BadgeComponent,
    IconDirective
  ]
})
export class DashboardHeaderComponent implements OnInit {
  currentProject: Project | null = null;
  aiAssistantActive = false;
  aiQuery = '';
  aiMessages: AIMessage[] = [];
  isAITyping = false;

  constructor(
    public auth: AuthService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.projectService.currentProject$.subscribe(project => {
      this.currentProject = project;
    });
  }

  toggleAIAssistant(): void {
    this.aiAssistantActive = !this.aiAssistantActive;
  }

  showAIAssistant(): void {
    this.aiAssistantActive = true;
  }

  sendAIQuery(): void {
    if (!this.aiQuery.trim()) return;

    // Add user message
    this.aiMessages.push({
      text: this.aiQuery,
      isUser: true,
      timestamp: new Date()
    });

    // Clear input
    const query = this.aiQuery;
    this.aiQuery = '';

    // Show typing indicator
    this.isAITyping = true;

    // Simulate AI response (would be replaced with actual API call)
    setTimeout(() => {
      this.isAITyping = false;

      // Generate a simple response based on the query
      let response = '';
      if (query.toLowerCase().includes('pipeline')) {
        response = 'I can help you optimize your pipeline configuration. Would you like me to analyze your current setup?';
      } else if (query.toLowerCase().includes('deploy') || query.toLowerCase().includes('deployment')) {
        response = 'I can assist with deployment strategies. Would you like to see some best practices for your environment?';
      } else if (query.toLowerCase().includes('error') || query.toLowerCase().includes('issue')) {
        response = 'I can help troubleshoot issues. Please provide more details about the error you\'re experiencing.';
      } else {
        response = 'I understand you\'re asking about "' + query + '". How can I assist you with this specifically?';
      }

      // Add AI response
      this.aiMessages.push({
        text: response,
        isUser: false,
        timestamp: new Date()
      });
    }, 1500);
  }

  getProjectIcon(project: Project): string {
    // Determine icon based on project name or type
    if (project.name.toLowerCase().includes('frontend')) {
      return 'cil-monitor';
    } else if (project.name.toLowerCase().includes('backend') || project.name.toLowerCase().includes('api')) {
      return 'cil-layers';
    } else if (project.name.toLowerCase().includes('mobile')) {
      return 'cil-mobile';
    } else if (project.name.toLowerCase().includes('infrastructure')) {
      return 'cil-storage';
    } else if (project.name.toLowerCase().includes('auth')) {
      return 'cil-lock-locked';
    } else if (project.name.toLowerCase().includes('data')) {
      return 'cil-chart';
    } else {
      return 'cil-folder';
    }
  }

  getEnvironmentClass(environment?: string): string {
    if (!environment) return 'info';

    switch (environment.toLowerCase()) {
      case 'production':
        return 'success';
      case 'staging':
        return 'warning';
      case 'development':
        return 'info';
      case 'testflight':
        return 'primary';
      default:
        return 'secondary';
    }
  }
}