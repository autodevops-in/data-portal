import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { ApiServiceService } from '../../api-service.service';
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

// Define an interface for the user profile
interface UserProfile {
  sub?: string;  // Make sub optional to match Auth0 User type
  given_name?: string;
  family_name?: string;
  name?: string;
  nickname?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
  updated_at?: string;
  locale?: string;
  [key: string]: any; // Allow for additional properties
}

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
  userProfile: UserProfile | null = null;
  profileForm: FormGroup;
  isLoading: boolean = false;
  isSaving: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private apiService: ApiServiceService,
    @Inject(DOCUMENT) public document: Document
  ) {
    this.profileForm = this.fb.group({
      given_name: ['', Validators.required],
      family_name: ['', Validators.required],
      nickname: [''],
      name: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      picture: [''],
      user_metadata: this.fb.group({
        preferred_color: [''],
        preferred_language: ['']
      })
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.auth.user$.subscribe(user => {
      if (user) {
        // Convert Auth0 User to our UserProfile type
        this.userProfile = {
          sub: user.sub,
          given_name: user.given_name,
          family_name: user.family_name,
          name: user.name,
          nickname: user.nickname,
          email: user.email,
          email_verified: user.email_verified,
          picture: user.picture,
          updated_at: user.updated_at,
          locale: user.locale,
          // Copy any other properties
          ...user
        };

        // Split the name into given_name and family_name if available
        let givenName = '';
        let familyName = '';

        if (user.name) {
          const nameParts = user.name.split(' ');
          givenName = nameParts[0] || '';
          familyName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        }

        // Use existing given_name and family_name if available
        givenName = user.given_name || givenName;
        familyName = user.family_name || familyName;

        this.profileForm.patchValue({
          given_name: givenName,
          family_name: familyName,
          nickname: user.nickname || '',
          name: user.name || '',
          email: user.email || '',
          picture: user.picture || '',
          user_metadata: {
            preferred_color: user['user_metadata']?.preferred_color || '',
            preferred_language: user['user_metadata']?.preferred_language || ''
          }
        });
      } else {
        this.userProfile = null;
      }
      this.isLoading = false;
    });
  }

  // This method is temporarily disabled until the API is ready
  updateProfile(): void {
    // Profile updates are currently disabled
    console.log('Profile updates are currently disabled until the API is ready');

    // Show a message to the user
    this.successMessage = '';
    this.errorMessage = 'Profile updates are currently disabled until the API is ready.';

    /*
    // The following code will be re-enabled once the API is ready
    if (this.profileForm.valid) {
      this.isSaving = true;
      this.successMessage = '';
      this.errorMessage = '';

      // Get form values with proper typing
      interface ProfileFormValues {
        given_name: string;
        family_name: string;
        nickname: string;
        name: string;
        email: string;
        picture: string;
        user_metadata: {
          preferred_color: string;
          preferred_language: string;
        };
      }

      const formValues = this.profileForm.getRawValue() as ProfileFormValues;

      // Construct the full name from given_name and family_name
      const fullName = `${formValues.given_name} ${formValues.family_name}`.trim();

      // Define the profile data structure to match API expectations
      interface ProfileApiData {
        given_name: string;
        family_name: string;
        nickname: string;
        name: string;
        picture: string;
        user_metadata: {
          preferred_color: string;
          preferred_language: string;
        };
        user_id: string;
      }

      const profileData: ProfileApiData = {
        given_name: formValues.given_name,
        family_name: formValues.family_name,
        nickname: formValues.nickname,
        name: fullName,
        picture: formValues.picture,
        user_metadata: formValues.user_metadata,
        user_id: this.userProfile?.sub || '' // Include the user ID from Auth0
      };

      this.apiService.updateUserProfile(profileData).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.successMessage = 'Profile updated successfully!';
          this.isSaving = false;

          // Update the local user profile data
          if (this.userProfile) {
            this.userProfile = {
              ...this.userProfile,
              given_name: profileData.given_name,
              family_name: profileData.family_name,
              name: profileData.name,
              nickname: profileData.nickname,
              picture: profileData.picture,
              ['user_metadata']: profileData.user_metadata
            };
          }

          // Update the name field in the form
          this.profileForm.patchValue({
            name: profileData.name
          });
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.errorMessage = 'Failed to update profile. Error: ' +
            (error.error?.error || error.error?.message || error.message || JSON.stringify(error));
          this.isSaving = false;
        }
      });
    }
    */
  }
}
