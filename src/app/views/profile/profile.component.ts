import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import {
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  ButtonDirective,
  ColDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  AlertComponent,
  AvatarComponent,
  SpinnerComponent
} from '@coreui/angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    FormControlDirective,
    ReactiveFormsModule,
    FormsModule,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    ButtonDirective,
    ColDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    AlertComponent,
    AvatarComponent,
    SpinnerComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userProfile: any = null;
  profileForm: FormGroup;
  isLoading: boolean = false;
  isSaving: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    @Inject(DOCUMENT) public document: Document
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      nickname: [''],
      email: [{ value: '', disabled: true }],
      picture: ['']
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.auth.user$.subscribe(user => {
      this.userProfile = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name || '',
          nickname: user.nickname || '',
          email: user.email || '',
          picture: user.picture || ''
        });
      }
      this.isLoading = false;
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;
      this.successMessage = '';
      this.errorMessage = '';

      // For Auth0, we need to use the Management API to update user profiles
      // This would typically be done through a backend service
      // For now, we'll redirect to Auth0's profile editor
      this.auth.loginWithRedirect({
        authorizationParams: {
          screen_hint: 'profile'
        }
      });
    }
  }
}
