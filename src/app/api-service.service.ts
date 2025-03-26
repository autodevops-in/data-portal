import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private apiUrl = environment.metricsApiUrl
  private aiApiUrl = environment.aiApiUrl

    constructor(private http: HttpClient) { }

    fetchedprojects(): Observable<any[]> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any[]>(`${this.apiUrl}/api/items`, {headers});
    }

    generateCode(prompt: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(`${this.aiApiUrl}/api/generate-code`, { prompt }, { headers });
    }

    updateUserProfile(profileData: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.patch<any>(`${this.apiUrl}/api/users/profile`, profileData, { headers });
    }

    // DevOps Metrics API Endpoints

    // Deployment Metrics
    getDeploymentFrequency(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(`${this.apiUrl}/api/metrics/deployment-frequency`, {headers});
    }

    getDeploymentSuccess(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(`${this.apiUrl}/api/metrics/deployment-success`, {headers});
    }

    // Lead Time Metrics
    getLeadTime(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(`${this.apiUrl}/api/metrics/lead-time`, {headers});
    }

    // MTTR Metrics (Mean Time to Recovery)
    getMTTR(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(`${this.apiUrl}/api/metrics/mttr`, {headers});
    }

    // Change Failure Rate
    getChangeFailureRate(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(`${this.apiUrl}/api/metrics/change-failure-rate`, {headers});
    }

    // Infrastructure Metrics
    getInfrastructureMetrics(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(`${this.apiUrl}/api/metrics/infrastructure`, {headers});
    }

    // Code Quality Metrics
    getCodeQualityMetrics(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(`${this.apiUrl}/api/metrics/code-quality`, {headers});
    }

    // Test Coverage Metrics
    getTestCoverageMetrics(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(`${this.apiUrl}/api/metrics/test-coverage`, {headers});
    }

    // Security Metrics
    getSecurityMetrics(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(`${this.apiUrl}/api/metrics/security`, {headers});
    }
}
