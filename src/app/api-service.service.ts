import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private apiUrl = environment.metricsApiUrl;
  private aiApiUrl = environment.aiApiUrl;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  fetchedprojects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/items`, { headers: this.headers });
  }

  generateCode(prompt: string): Observable<any> {
    return this.http.post<any>(`${this.aiApiUrl}/api/generate-code`, { prompt }, { headers: this.headers });
  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/auth/users/profile`, profileData, { headers: this.headers });
  }

  createUserProfile(profileData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/auth/users/profile`, profileData, { headers: this.headers });
  }

  getUserProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/auth/users/profile/${userId}`, { headers: this.headers });
  }

  // Azure DevOps API Endpoints
  getAzureDevOpsProjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/azure-devops/projects`, { headers: this.headers });
  }

  getAzureDevOpsProject(projectId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/azure-devops/projects/${projectId}`, { headers: this.headers });
  }

  getAzureDevOpsRepositories(projectId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/azure-devops/repositories?project_id=${projectId}`, { headers: this.headers });
  }

  getAzureDevOpsRepository(projectId: string, repositoryId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/azure-devops/repositories/${repositoryId}?project_id=${projectId}`, { headers: this.headers });
  }

  getAzureDevOpsPipelines(projectId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/azure-devops/pipelines?project_id=${projectId}`, { headers: this.headers });
  }

  getAzureDevOpsPipeline(pipelineId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/azure-devops/pipelines/${pipelineId}`, { headers: this.headers });
  }

  createAzureDevOpsPipeline(pipelineData: any): Observable<any> {
    // Ensure we're using the correct content type for the request
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    // Get the YAML content from local storage if available
    let yamlContent = '';
    try {
      // Try to get the specific pipeline YAML first
      const storageKey = `pipeline_${pipelineData.project_id}_${pipelineData.repository_id}`;
      yamlContent = localStorage.getItem(storageKey) || '';
      
      // If not found, try to get the most recent pipeline
      if (!yamlContent) {
        yamlContent = localStorage.getItem('most_recent_pipeline') || '';
      }
      
      // If we have YAML content, add it to the request
      if (yamlContent) {
        console.log('Retrieved pipeline YAML from local storage');
        pipelineData.yaml_content = yamlContent;
      }
    } catch (e) {
      console.error('Error retrieving pipeline from local storage:', e);
    }
    
    // Log the request for debugging
    console.log('Creating pipeline with URL:', `${this.apiUrl}/api/azure-devops/pipelines`);
    console.log('Pipeline data:', pipelineData);
    
    return this.http.post<any>(
      `${this.apiUrl}/api/azure-devops/pipelines`, 
      pipelineData, 
      { headers: headers }
    );
  }

  runAzureDevOpsPipeline(pipelineData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/azure-devops/pipelines/run`, pipelineData, { headers: this.headers });
  }

  getAzureDevOpsPipelineRun(pipelineId: string, runId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/azure-devops/pipelines/${pipelineId}/runs/${runId}`, { headers: this.headers });
  }

  // Generate Pipeline with AI
  generatePipelineWithAI(prompt: string, projectId: string, repositoryId: string): Observable<any> {
    // Ensure we're using the correct content type for the request
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    // Create the request payload with both camelCase and snake_case versions
    const payload = {
      prompt: `Generate Azure DevOps pipeline for project ${projectId}, repository ${repositoryId}: ${prompt}`,
      projectId,
      project_id: projectId,
      repositoryId,
      repository_id: repositoryId,
      yaml_path: 'azure-pipelines.yml',
      description: `AI generated pipeline based on prompt: ${prompt}`
    };
    
    // Log the request for debugging
    console.log('Generating pipeline with URL:', `${this.aiApiUrl}/api/generate-code`);
    console.log('Request payload:', payload);
    
    return this.http.post<any>(
      `${this.aiApiUrl}/api/generate-code`, 
      payload, 
      { headers: headers }
    ).pipe(
      map(response => {
        console.log('Raw response from code generation API:', response);
        
        // Transform the response to match the expected format for pipeline generation
        let transformedResponse = {
          name: 'AI Generated Pipeline',
          description: `AI generated pipeline based on prompt: ${prompt}`,
          yaml: '',
          yaml_path: 'azure-pipelines.yml',
          rawResponse: response // Store the raw response for debugging
        };
        
        // Extract YAML content from the response based on its structure
        if (typeof response === 'string') {
          // If the response is a string, assume it's the YAML content
          transformedResponse.yaml = response;
        } else if (response && typeof response === 'object') {
          // If the response is an object, try to extract the YAML content
          if (response.code) {
            transformedResponse.yaml = response.code;
          } else if (response.content) {
            transformedResponse.yaml = response.content;
          } else if (response.yaml) {
            transformedResponse.yaml = response.yaml;
          } else if (response.pipeline) {
            transformedResponse.yaml = response.pipeline;
          } else if (response.choices && response.choices.length > 0) {
            // Handle OpenAI-like response format
            const content = response.choices[0].message?.content || response.choices[0].text;
            if (content) {
              transformedResponse.yaml = content;
            }
          } else if (response.result) {
            transformedResponse.yaml = response.result;
          } else if (response.data) {
            // Try to extract from data field
            if (typeof response.data === 'string') {
              transformedResponse.yaml = response.data;
            } else if (response.data.code) {
              transformedResponse.yaml = response.data.code;
            } else if (response.data.content) {
              transformedResponse.yaml = response.data.content;
            } else if (response.data.yaml) {
              transformedResponse.yaml = response.data.yaml;
            }
          } else {
            // Last resort: try to use the entire response as YAML
            try {
              transformedResponse.yaml = JSON.stringify(response, null, 2);
            } catch (e) {
              console.error('Error stringifying response:', e);
            }
          }
        }
        
        // Clean up the YAML content if needed
        if (transformedResponse.yaml) {
          // Remove markdown code block markers if present
          transformedResponse.yaml = transformedResponse.yaml.replace(/```ya?ml\n/g, '').replace(/```\n?/g, '');
          
          // If the content appears to be JSON, try to extract YAML from it
          if (transformedResponse.yaml.trim().startsWith('{') && transformedResponse.yaml.includes('"')) {
            try {
              const jsonObj = JSON.parse(transformedResponse.yaml);
              if (jsonObj.yaml) {
                transformedResponse.yaml = jsonObj.yaml;
              } else if (jsonObj.code) {
                transformedResponse.yaml = jsonObj.code;
              } else if (jsonObj.content) {
                transformedResponse.yaml = jsonObj.content;
              } else if (jsonObj.pipeline) {
                transformedResponse.yaml = jsonObj.pipeline;
              }
            } catch (e) {
              console.error('Error parsing JSON in YAML content:', e);
            }
          }
        }
        
        console.log('Transformed response for pipeline generation:', transformedResponse);
        return transformedResponse;
      })
    );
  }

  // DevOps Metrics API Endpoints
  getDeploymentFrequency(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/metrics/deployment-frequency`, { headers: this.headers });
  }

  getDeploymentSuccess(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/metrics/deployment-success`, { headers: this.headers });
  }

  getLeadTime(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/metrics/lead-time`, { headers: this.headers });
  }

  getMTTR(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/metrics/mttr`, { headers: this.headers });
  }

  getChangeFailureRate(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/metrics/change-failure-rate`, { headers: this.headers });
  }

  getInfrastructureMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/metrics/infrastructure`, { headers: this.headers });
  }

  getCodeQualityMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/metrics/code-quality`, { headers: this.headers });
  }

  getTestCoverageMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/metrics/test-coverage`, { headers: this.headers });
  }

  getSecurityMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/metrics/security`, { headers: this.headers });
  }
}
