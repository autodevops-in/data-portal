import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  NavModule,
  TabsModule,
  UtilitiesModule,
  AlertModule
} from '@coreui/angular';
import { AuthService } from '../../services/auth.service';

declare const process: {
  env: {
    [key: string]: string;
  };
};

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    UtilitiesModule,
    NavModule,
    TabsModule,
    AlertModule
  ]
})
export class AdminComponent implements OnInit {
  activeTabIndex = 0;
  isAdmin = false;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // For production, use the real permission check
    if (process.env['NODE_ENV'] === 'production') {
      this.authService.isAdmin().subscribe(isAdmin => {
        this.isAdmin = isAdmin;
        this.isLoading = false;

        if (!isAdmin) {
          // Redirect to home if not admin
          this.router.navigate(['/']);
        }
      });
    } else {
      // For development/testing, use the mock check
      this.authService.mockIsAdmin().subscribe(isAdmin => {
        this.isAdmin = isAdmin;
        this.isLoading = false;

        if (!isAdmin) {
          // Redirect to home if not admin
          this.router.navigate(['/']);
        }
      });
    }
  }

  setActiveTab(index: number): void {
    this.activeTabIndex = index;
  }
}