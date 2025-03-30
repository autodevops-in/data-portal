import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsResolver implements Resolve<string[]> {
  constructor(private authService: AuthService) {}

  resolve(): Observable<string[]> {
    return this.authService.getAllPermissions();
  }
}
