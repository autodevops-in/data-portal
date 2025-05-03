import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from '../../api-service.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-azure-devops-pipelines',
  templateUrl: './azure-devops-pipelines.component.html',
  styleUrls: ['./azure-devops-pipelines.component.scss']
})
export class AzureDevOpsPipelinesComponent implements OnInit {
  projects: any[] = [];
  repositories: any[] = [];
  pipelines: any[] = [];
  selectedProject: any = null;
  selectedRepository: any = null;
  pipelineForm: FormGroup;
  isLoading = false;
  isProjectsLoading = false;
  isRepositoriesLoading = false;
  isPipelinesLoading = false;
  isGenerating = false;
  generatedPipeline: any = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private apiService: ApiServiceService,
    private fb: FormBuilder
  ) {
    this.pipelineForm = this.fb.group({
      projectId: ['', Validators.required],
      repositoryId: ['', Validators.required],
      prompt: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isProjectsLoading = true;
    this.apiService.getAzureDevOpsProjects()
      .pipe(finalize(() => this.isProjectsLoading = false))
      .subscribe({
        next: (data) => {
          // Ensure data is an array
          if (Array.isArray(data)) {
            this.projects = data;
          } else if (data && typeof data === 'object') {
            // If data is an object with a property that contains the array
            // Try common response formats
            if (Array.isArray(data.value)) {
              this.projects = data.value;
            } else if (Array.isArray(data.items)) {
              this.projects = data.items;
            } else if (Array.isArray(data.projects)) {
              this.projects = data.projects;
            } else if (Array.isArray(data.data)) {
              this.projects = data.data;
            } else {
              // If we can't find an array, convert the object to an array
              console.warn('API returned an object instead of an array for projects. Converting to array.');
              this.projects = Object.values(data);
            }
          } else {
            console.error('Unexpected data format for projects:', data);
            this.projects = [];
            this.errorMessage = 'Failed to load Azure DevOps projects. Unexpected data format.';
          }
        },
        error: (error) => {
          console.error('Error loading projects:', error);
          this.errorMessage = 'Failed to load Azure DevOps projects. Please try again.';
        }
      });
  }

  onProjectChange(projectId: string | null | undefined): void {
    if (!projectId) {
      this.repositories = [];
      this.selectedRepository = null;
      this.pipelines = [];
      this.pipelineForm.get('repositoryId')?.setValue('');
      return;
    }
    
    this.selectedProject = this.projects.find(p => p.id === projectId);
    this.repositories = [];
    this.selectedRepository = null;
    this.pipelines = [];
    this.pipelineForm.get('repositoryId')?.setValue('');
    
    this.loadRepositories(projectId);
  }

  loadRepositories(projectId: string): void {
    this.isRepositoriesLoading = true;
    this.apiService.getAzureDevOpsRepositories(projectId)
      .pipe(finalize(() => this.isRepositoriesLoading = false))
      .subscribe({
        next: (data) => {
          // Ensure data is an array
          if (Array.isArray(data)) {
            this.repositories = data;
          } else if (data && typeof data === 'object') {
            // If data is an object with a property that contains the array
            // Try common response formats
            if (Array.isArray(data.value)) {
              this.repositories = data.value;
            } else if (Array.isArray(data.items)) {
              this.repositories = data.items;
            } else if (Array.isArray(data.repositories)) {
              this.repositories = data.repositories;
            } else if (Array.isArray(data.data)) {
              this.repositories = data.data;
            } else {
              // If we can't find an array, convert the object to an array
              console.warn('API returned an object instead of an array for repositories. Converting to array.');
              this.repositories = Object.values(data);
            }
          } else {
            console.error('Unexpected data format for repositories:', data);
            this.repositories = [];
            this.errorMessage = 'Failed to load repositories. Unexpected data format.';
          }
        },
        error: (error) => {
          console.error('Error loading repositories:', error);
          this.errorMessage = 'Failed to load repositories. Please try again.';
        }
      });
  }

  onRepositoryChange(repositoryId: string | null | undefined): void {
    if (!repositoryId) {
      return;
    }
    
    this.selectedRepository = this.repositories.find(r => r.id === repositoryId);
    
    const projectId = this.pipelineForm.get('projectId')?.value;
    if (projectId) {
      this.loadPipelines(projectId);
    }
  }

  loadPipelines(projectId: string): void {
    if (!projectId) {
      return;
    }
    
    this.isPipelinesLoading = true;
    this.apiService.getAzureDevOpsPipelines(projectId)
      .pipe(finalize(() => this.isPipelinesLoading = false))
      .subscribe({
        next: (data) => {
          // Ensure data is an array
          if (Array.isArray(data)) {
            this.pipelines = data;
          } else if (data && typeof data === 'object') {
            // If data is an object with a property that contains the array
            // Try common response formats
            if (Array.isArray(data.value)) {
              this.pipelines = data.value;
            } else if (Array.isArray(data.items)) {
              this.pipelines = data.items;
            } else if (Array.isArray(data.pipelines)) {
              this.pipelines = data.pipelines;
            } else if (Array.isArray(data.data)) {
              this.pipelines = data.data;
            } else {
              // If we can't find an array, convert the object to an array
              console.warn('API returned an object instead of an array for pipelines. Converting to array.');
              this.pipelines = Object.values(data);
            }
          } else {
            console.error('Unexpected data format for pipelines:', data);
            this.pipelines = [];
            this.errorMessage = 'Failed to load pipelines. Unexpected data format.';
          }
        },
        error: (error) => {
          console.error('Error loading pipelines:', error);
          this.errorMessage = 'Failed to load pipelines. Please try again.';
        }
      });
  }

  generatePipeline(): void {
    if (this.pipelineForm.invalid) {
      this.markFormGroupTouched(this.pipelineForm);
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isGenerating = true;
    const { projectId, repositoryId, prompt } = this.pipelineForm.value;

    console.log('Generating pipeline with prompt:', prompt);

    this.apiService.generatePipelineWithAI(prompt, projectId, repositoryId)
      .pipe(finalize(() => this.isGenerating = false))
      .subscribe({
        next: (response) => {
          console.log('Generated pipeline response:', response);
          
          // Ensure we have a valid response
          if (!response) {
            this.errorMessage = 'Received empty response from AI service.';
            return;
          }
          
          // Store the response
          this.generatedPipeline = response;
          
          // If the response doesn't have a name, add one
          if (!this.generatedPipeline.name) {
            this.generatedPipeline.name = 'AI Generated Pipeline';
          }
          
          // If the response doesn't have a description, add one
          if (!this.generatedPipeline.description) {
            this.generatedPipeline.description = 'Pipeline generated with AI based on user prompt';
          }
          
          // Ensure we have YAML content in a standard format
          if (!this.generatedPipeline.yaml && !this.generatedPipeline.yamlContent) {
            // Try to extract YAML from the response
            if (typeof response === 'string') {
              this.generatedPipeline.yaml = response;
            } else if (response.content) {
              this.generatedPipeline.yaml = response.content;
            } else if (response.pipeline) {
              this.generatedPipeline.yaml = response.pipeline;
            } else if (response.yaml) {
              this.generatedPipeline.yaml = response.yaml;
            } else if (response.code) {
              this.generatedPipeline.yaml = response.code;
            } else if (response.configuration && typeof response.configuration === 'string') {
              this.generatedPipeline.yaml = response.configuration;
            } else if (response.configuration) {
              try {
                this.generatedPipeline.yaml = JSON.stringify(response.configuration, null, 2);
              } catch (e) {
                console.error('Error stringifying configuration:', e);
              }
            }
            
            // If we still don't have YAML content, try to extract it from markdown code blocks
            if (this.generatedPipeline.yaml && this.generatedPipeline.yaml.includes('```')) {
              const yamlMatch = this.generatedPipeline.yaml.match(/```ya?ml\n([\s\S]*?)```/);
              if (yamlMatch && yamlMatch[1]) {
                this.generatedPipeline.yaml = yamlMatch[1];
              } else {
                // Try to match any code block
                const codeMatch = this.generatedPipeline.yaml.match(/```\n?([\s\S]*?)```/);
                if (codeMatch && codeMatch[1]) {
                  this.generatedPipeline.yaml = codeMatch[1];
                }
              }
            }
          }
          
          // Log the final YAML content for debugging
          console.log('Final YAML content:', this.generatedPipeline.yaml);
          
          this.successMessage = 'Pipeline generated successfully!';
        },
        error: (error) => {
          console.error('Error generating pipeline:', error);
          this.errorMessage = 'Failed to generate pipeline. Please try again.';
        }
      });
  }

  createPipeline(): void {
    if (!this.generatedPipeline) {
      this.errorMessage = 'Please generate a pipeline first.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Get the project and repository IDs
    const projectId = this.pipelineForm.get('projectId')?.value;
    const repositoryId = this.pipelineForm.get('repositoryId')?.value;

    if (!projectId || !repositoryId) {
      this.errorMessage = 'Project and repository are required.';
      this.isLoading = false;
      return;
    }

    // Ensure we have YAML content
    const yamlContent = this.displayPipelineContent();

    if (!yamlContent) {
      this.errorMessage = 'No pipeline content available to create.';
      this.isLoading = false;
      return;
    }

    // Save the pipeline YAML to local storage
    this.savePipelineToLocalStorage(yamlContent);

    // Create the pipeline data object with the required fields based on the Postman example
    const pipelineData = {
      name: this.generatedPipeline.name || 'AI Generated Pipeline',
      project_id: projectId,
      repository_id: repositoryId,
      yaml_path: '/azure-pipelines.yml'
    };

    console.log('Creating pipeline with data:', pipelineData);

    this.apiService.createAzureDevOpsPipeline(pipelineData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          console.log('Pipeline created successfully:', response);
          this.successMessage = 'Pipeline created successfully!';
          this.loadPipelines(projectId);
        },
        error: (error) => {
          console.error('Error creating pipeline:', error);
          if (error.error && error.error.detail) {
            // Extract more specific error information if available
            const errorDetails = Array.isArray(error.error.detail) 
              ? error.error.detail.map((e: any) => {
                  if (e.loc && Array.isArray(e.loc)) {
                    return `${e.msg} at ${e.loc.join('.')}`;
                  }
                  return e.msg || JSON.stringify(e);
                }).join(', ')
              : error.error.detail;
            this.errorMessage = `Failed to create pipeline: ${errorDetails}`;
          } else if (error.status === 422) {
            this.errorMessage = 'Failed to create pipeline: Missing required fields. Check the console for details.';
          } else {
            this.errorMessage = 'Failed to create pipeline. Please try again.';
          }
        }
      });
  }

  // Save pipeline YAML to local storage
  private savePipelineToLocalStorage(yamlContent: string): void {
    try {
      // Create a key based on project and repository IDs
      const projectId = this.pipelineForm.get('projectId')?.value;
      const repositoryId = this.pipelineForm.get('repositoryId')?.value;
      const storageKey = `pipeline_${projectId}_${repositoryId}`;
      
      // Save the YAML content to local storage
      localStorage.setItem(storageKey, yamlContent);
      
      // Also save the most recent pipeline for easy access
      localStorage.setItem('most_recent_pipeline', yamlContent);
      
      console.log('Pipeline YAML saved to local storage with key:', storageKey);
    } catch (e) {
      console.error('Error saving pipeline to local storage:', e);
    }
  }
  
  // Download the pipeline YAML as a file
  downloadPipelineYaml(): void {
    if (!this.generatedPipeline) {
      this.errorMessage = 'No pipeline content available to download.';
      return;
    }
    
    const yamlContent = this.displayPipelineContent();
    if (!yamlContent) {
      this.errorMessage = 'No pipeline content available to download.';
      return;
    }
    
    try {
      // Create a blob with the YAML content
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const a = document.createElement('a');
      a.href = url;
      a.download = 'azure-pipelines.yml';
      
      // Append the link to the body
      document.body.appendChild(a);
      
      // Click the link to trigger the download
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Pipeline YAML downloaded successfully');
    } catch (e) {
      console.error('Error downloading pipeline YAML:', e);
      this.errorMessage = 'Failed to download pipeline YAML. Please try again.';
    }
  }

  clearForm(): void {
    this.pipelineForm.reset();
    this.generatedPipeline = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  displayPipelineContent(): string {
    if (!this.generatedPipeline) {
      return '';
    }

    // Check for YAML content in various properties
    if (this.generatedPipeline.yaml) {
      return this.cleanYamlContent(this.generatedPipeline.yaml);
    }

    if (this.generatedPipeline.yamlContent) {
      return this.cleanYamlContent(this.generatedPipeline.yamlContent);
    }

    if (this.generatedPipeline.code) {
      return this.cleanYamlContent(this.generatedPipeline.code);
    }

    if (this.generatedPipeline.content) {
      return this.cleanYamlContent(this.generatedPipeline.content);
    }

    if (this.generatedPipeline.pipeline) {
      return this.cleanYamlContent(this.generatedPipeline.pipeline);
    }

    if (this.generatedPipeline.configuration) {
      if (typeof this.generatedPipeline.configuration === 'string') {
        return this.cleanYamlContent(this.generatedPipeline.configuration);
      } else {
        try {
          return JSON.stringify(this.generatedPipeline.configuration, null, 2);
        } catch (e) {
          return 'Error displaying pipeline configuration';
        }
      }
    }

    // If we have a raw response, try to display it
    if (this.generatedPipeline.rawResponse) {
      if (typeof this.generatedPipeline.rawResponse === 'string') {
        return this.cleanYamlContent(this.generatedPipeline.rawResponse);
      } else {
        try {
          return JSON.stringify(this.generatedPipeline.rawResponse, null, 2);
        } catch (e) {
          return 'Error displaying raw response';
        }
      }
    }

    return 'No pipeline content available';
  }

  // Helper method to clean YAML content
  private cleanYamlContent(content: string): string {
    if (!content) {
      return '';
    }

    // Remove markdown code block markers if present
    let cleaned = content.replace(/```ya?ml\n/g, '').replace(/```\n?/g, '');

    // If the content appears to be JSON, try to extract YAML from it
    if (cleaned.trim().startsWith('{') && cleaned.includes('"')) {
      try {
        const jsonObj = JSON.parse(cleaned);
        if (jsonObj.yaml) {
          cleaned = jsonObj.yaml;
        } else if (jsonObj.code) {
          cleaned = jsonObj.code;
        } else if (jsonObj.content) {
          cleaned = jsonObj.content;
        } else if (jsonObj.pipeline) {
          cleaned = jsonObj.pipeline;
        }
      } catch (e) {
        console.error('Error parsing JSON in YAML content:', e);
      }
    }

    return cleaned;
  }

  formatLastRunDate(pipeline: any): string {
    if (!pipeline || !pipeline.lastRun || !pipeline.lastRun.finishedDate) {
      return 'Never';
    }
    
    try {
      const date = new Date(pipeline.lastRun.finishedDate);
      return date.toLocaleString();
    } catch (e) {
      return 'Invalid date';
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}