import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ImgModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { AuthService } from '../../services/auth.service';

declare const process: {
  env: {
    [key: string]: string;
  };
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    ImgModule
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems: any[] = [];
  public isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // For production, use the real permission check
    if (process.env['NODE_ENV'] === 'production') {
      this.authService.isAdmin().subscribe(isAdmin => {
        this.isAdmin = isAdmin;
        this.updateNavItems();
      });
    } else {
      // For development/testing, use the mock check
      this.authService.mockIsAdmin().subscribe(isAdmin => {
        this.isAdmin = isAdmin;
        this.updateNavItems();
      });
    }
  }

  updateNavItems(): void {
    // Filter navigation items based on permissions
    this.navItems = navItems.filter(item => {
      // Always show Projects and AI Code Generator
      if (item.name === 'Projects' || item.name === 'AI Code Generator') {
        return true;
      }

      // Only show Admin section if user has admin permissions
      if (item.name === 'Admin') {
        return this.isAdmin;
      }

      return false;
    });
  }

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
}
