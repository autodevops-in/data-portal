import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private apiUrl = environment.metricsApiUrl

    constructor(private http: HttpClient) { }

    fetchedprojects(): Observable<any[]> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any[]>(`${this.apiUrl}/api/items`, {headers});
    }

}
