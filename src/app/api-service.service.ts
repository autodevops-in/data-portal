import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.post<any>(`${this.apiUrl}/api/auth/sers/profile`, profileData, { headers: this.headers });
  }

  getUserProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/auth/users/profile/${userId}`, { headers: this.headers });
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
