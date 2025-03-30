import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanMatch, Router, UrlTree } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

declare const process: {
  env: {
    [key: string]: string;
  };
};

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild, CanMatch {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.checkAdmin();
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.checkAdmin();
  }

  canMatch(): Observable<boolean> {
    return this.checkAdmin().pipe(
      map(result => result === true)
    );
  }

  private checkAdmin(): Observable<boolean | UrlTree> {
    // For production environments, use the real permission check
    if (process.env['NODE_ENV'] === 'production') {
      return this.authService.isAdmin().pipe(
        tap(isAdmin => {
          if (!isAdmin) {
            this.router.navigate(['/']);
          }
        })
      );
    }

    // For development/testing, use mockIsAdmin to simplify testing
    return this.authService.mockIsAdmin().pipe(
      tap(isAdmin => {
        if (!isAdmin) {
          this.router.navigate(['/']);
        }
      })
    );
  }
}