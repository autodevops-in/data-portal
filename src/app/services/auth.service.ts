import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth0Service: Auth0Service) {}

  // Check if the user has a specific permission
  hasPermission(permission: string): Observable<boolean> {
    // Get permissions from the access token
    return this.auth0Service.getAccessTokenSilently().pipe(
      mergeMap(token => {
        // Parse the JWT token to get the payload
        const payload = this.parseJwt(token);

        // Extract permissions from the token payload
        // Auth0 typically includes permissions in the 'permissions' claim
        const permissions: string[] = payload?.permissions || [];

        return of(Array.isArray(permissions) && permissions.includes(permission));
      }),
      catchError(() => of(false))
    );
  }

  // Parse JWT token to get the payload
  private parseJwt(token: string): any {
    try {
      // Split the token into parts
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      // Decode the base64 string
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT token:', e);
      return null;
    }
  }

  // Check if the user has admin role
  isAdmin(): Observable<boolean> {
    return this.hasPermission('user:admin');
  }

  // For testing purposes - mock admin status
  // In a real app, you would remove this and rely solely on Auth0 permissions
  mockIsAdmin(): Observable<boolean> {
    // For development, you can return true to simulate admin access
    // For production, this should be removed
    return of(true);
  }

  // Get all permissions from the token
  getAllPermissions(): Observable<string[]> {
    return this.auth0Service.getAccessTokenSilently().pipe(
      map(token => {
        const payload = this.parseJwt(token);
        return payload?.permissions || [];
      }),
      catchError(() => of([]))
    );
  }
}