import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';
import { provideAuth0, authHttpInterceptorFn } from '@auth0/auth0-angular';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import { environment } from '../environments/environment'
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApiServiceService } from './api-service.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    ApiServiceService,
    importProvidersFrom(SidebarModule, DropdownModule),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    IconSetService,
    provideAnimations(),
    provideAuth0({
      domain: environment.domain,
      clientId: environment.clientId,
      
      authorizationParams: {
        audience: environment.audience,
        redirect_uri: window.location.origin
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: `${environment.metricsApiUrl}/api/*`,
            allowAnonymous: false
          },
          {
            uri: `${environment.aiApiUrl}/api/*`,
            allowAnonymous: false
          }
        ]
      }
    })
  ]
};
