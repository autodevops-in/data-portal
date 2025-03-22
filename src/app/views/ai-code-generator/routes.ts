import { Routes } from '@angular/router';
import { AiCodeGeneratorComponent } from './ai-code-generator.component';

export const AI_CODE_GENERATOR_ROUTES: Routes = [
  {
    path: '',
    component: AiCodeGeneratorComponent,
    data: {
      title: 'AI Code Generator'
    }
  }
];