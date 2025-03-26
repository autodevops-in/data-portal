import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from '../../api-service.service';
import { AuthService } from '@auth0/auth0-angular';
import {
  CardModule,
  ButtonModule,
  FormModule,
  GridModule,
  AlertModule,
  SpinnerModule,
  AccordionModule,
  AvatarModule
} from '@coreui/angular';

@Component({
  selector: 'app-ai-code-generator',
  templateUrl: './ai-code-generator.component.html',
  styleUrls: ['./ai-code-generator.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    FormModule,
    GridModule,
    AlertModule,
    SpinnerModule,
    AccordionModule,
    AvatarModule
  ]
})
export class AiCodeGeneratorComponent implements OnInit {
  prompt: string = '';
  generatedCode: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  isAuthenticated: boolean = false;
  userProfile: any = null;

  // Sample prompts focused on DevOps and DevSecOps
  samplePrompts: { title: string; prompt: string }[] = [
    // DevSecOps Prompts
    {
      title: 'Secure CI/CD Pipeline',
      prompt: 'Create a GitHub Actions workflow that includes security scanning steps for a Node.js application. Include SAST with SonarQube, dependency scanning with OWASP Dependency Check, container scanning with Trivy, and secret scanning with GitLeaks.'
    },
    {
      title: 'Infrastructure as Code Security',
      prompt: 'Write Terraform code to provision an AWS infrastructure with security best practices. Include a VPC with private/public subnets, security groups with least privilege access, KMS encryption for S3 buckets, and AWS WAF configuration for an Application Load Balancer.'
    },
    {
      title: 'Kubernetes Security Policy',
      prompt: 'Create a Kubernetes Pod Security Policy (PSP) that enforces security best practices. Include restrictions on privileged containers, host namespace sharing, volume types, and user/group IDs. Also add NetworkPolicy resources to restrict pod-to-pod communication.'
    },
    {
      title: 'Docker Security Hardening',
      prompt: 'Write a Dockerfile for a Node.js application that follows security best practices. Include using a minimal base image, non-root user, multi-stage builds, removal of unnecessary tools, and proper handling of secrets.'
    },
    {
      title: 'Security Compliance Checks',
      prompt: 'Create an Ansible playbook that performs CIS benchmark compliance checks on Linux servers. Include checks for file permissions, user access, network configuration, and system hardening. Generate a compliance report in JSON format.'
    },
    {
      title: 'Automated Security Testing',
      prompt: 'Write a Python script that automates security testing for a web application. Include OWASP ZAP for vulnerability scanning, Selenium for authentication testing, and API security testing with custom headers and payloads.'
    },
    {
      title: 'AWS Security Monitoring',
      prompt: 'Create a CloudFormation template that sets up AWS security monitoring. Include CloudTrail for API logging, Config for compliance monitoring, GuardDuty for threat detection, and Security Hub for centralized security management.'
    },
    {
      title: 'Secret Management',
      prompt: 'Write a Bash script that integrates HashiCorp Vault with a CI/CD pipeline. Include authentication, secret retrieval, dynamic credential generation, and proper error handling for a secure deployment process.'
    },
    {
      title: 'Container Runtime Security',
      prompt: 'Create a Falco configuration file with custom rules to detect suspicious activities in a Kubernetes cluster. Include rules for detecting privilege escalation, unusual network connections, and unauthorized file access.'
    },
    {
      title: 'Compliance as Code',
      prompt: 'Write an InSpec profile that checks compliance with NIST 800-53 security controls for a Linux server. Include tests for access control, audit logging, encryption, and network security.'
    },

    // DevOps Prompts
    {
      title: 'Kubernetes Deployment',
      prompt: 'Create a Kubernetes deployment manifest for a microservice architecture. Include deployments, services, ingress, config maps, and secrets for a frontend, backend API, and database. Add resource limits, health checks, and auto-scaling configuration.'
    },
    {
      title: 'CI/CD for Microservices',
      prompt: 'Write a Jenkins pipeline (Jenkinsfile) for a microservices application with multiple components. Include stages for building, testing, and deploying each service independently. Add parallel execution where possible and proper error handling.'
    },
    {
      title: 'Infrastructure Automation',
      prompt: 'Create a Terraform module to provision a scalable AWS EKS cluster with node groups, networking, and supporting services. Include autoscaling, logging, monitoring, and backup solutions. Structure the code with proper variables, outputs, and documentation.'
    },
    {
      title: 'Monitoring Stack',
      prompt: 'Write a Docker Compose file for a complete monitoring stack with Prometheus, Grafana, Alertmanager, and Node Exporter. Include proper volume mounts for persistence, default dashboards, and alert configurations for common system and application metrics.'
    },
    {
      title: 'Database Migration',
      prompt: 'Create a script for safely migrating a PostgreSQL database between environments with minimal downtime. Include data validation, backup procedures, schema migration, and rollback mechanisms. Add monitoring and notification steps.'
    },
    {
      title: 'GitOps Workflow',
      prompt: 'Set up an ArgoCD configuration for implementing GitOps in a Kubernetes environment. Include application definitions, sync policies, and RBAC settings. Add examples of promoting changes through dev, staging, and production environments.'
    },
    {
      title: 'Load Testing Automation',
      prompt: 'Write a k6 load testing script for a REST API that simulates realistic user behavior. Include ramp-up phases, different user scenarios, and thresholds for acceptable performance. Add output formatting for CI/CD integration.'
    },
    {
      title: 'Disaster Recovery Plan',
      prompt: 'Create an AWS CloudFormation template that implements a disaster recovery solution for a critical application. Include multi-region resources, automated backups, failover mechanisms, and monitoring. Document the recovery process and testing procedures.'
    },
    {
      title: 'Configuration Management',
      prompt: 'Write an Ansible playbook for configuring a fleet of web servers with NGINX, PHP-FPM, and application code deployment. Include hardening steps, log rotation, performance tuning, and integration with a central monitoring system.'
    },
    {
      title: 'Serverless Application',
      prompt: 'Create an AWS SAM template for a serverless application with API Gateway, Lambda functions, DynamoDB, and S3. Include proper IAM roles, API authentication, error handling, and logging configuration. Add CI/CD pipeline code for deployment.'
    }
  ];

  constructor(
    private apiService: ApiServiceService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;

      if (isAuthenticated) {
        // Get user profile information
        this.auth.user$.subscribe(user => {
          this.userProfile = user;
        });
      }
    });
  }

  generateCode(): void {
    if (!this.prompt) {
      this.errorMessage = 'Please enter a prompt for code generation.';
      return;
    }

    if (!this.isAuthenticated) {
      this.errorMessage = 'Please log in to use the code generation feature.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.generatedCode = '';

    // Use the API service directly - the Auth0 interceptor will handle the token
    this.apiService.generateCode(this.prompt).subscribe({
      next: (response) => {
        console.log('API response:', response);
        // Handle different possible response formats
        if (typeof response === 'string') {
          this.generatedCode = response;
        } else if (response && typeof response === 'object') {
          this.generatedCode = response.code || response.result || response.data || JSON.stringify(response);
        } else {
          this.generatedCode = 'Received response but no code was found.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error generating code:', error);
        this.errorMessage = 'Failed to generate code. Error: ' +
          (error.error?.error || error.error?.message || error.message || JSON.stringify(error));
        this.isLoading = false;
      }
    });
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  // Method to use a sample prompt
  useSamplePrompt(prompt: string): void {
    this.prompt = prompt;
  }

  // Method to copy generated code to clipboard
  copyToClipboard(): void {
    if (this.generatedCode) {
      navigator.clipboard.writeText(this.generatedCode)
        .then(() => {
          // You could add a toast notification here if you have a notification service
          console.log('Code copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy code: ', err);
        });
    }
  }
}