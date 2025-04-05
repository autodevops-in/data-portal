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
  user_metadata?: {
    preferred_color?: string;
    preferred_language?: string;
    [key: string]: any; // Allow for additional metadata properties
  };
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

  // Language options for the dropdown
  languageOptions = [
    { code: '', name: 'Select a language' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  // Color options for the dropdown
  colorOptions = [
    { code: '', name: 'Select a color' },
    { code: 'red', name: 'Red' },
    { code: 'blue', name: 'Blue' },
    { code: 'green', name: 'Green' },
    { code: 'yellow', name: 'Yellow' },
    { code: 'purple', name: 'Purple' },
    { code: 'orange', name: 'Orange' },
    { code: 'pink', name: 'Pink' },
    { code: 'teal', name: 'Teal' },
    { code: 'cyan', name: 'Cyan' },
    { code: 'gray', name: 'Gray' },
    { code: 'black', name: 'Black' }
  ];

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
        console.log('User data received:', user);

        // Extract user metadata for preferences
        const userMetadata = user['user_metadata'] || {};
        console.log('User metadata:', userMetadata);

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
          user_metadata: {
            preferred_color: userMetadata.preferred_color || '',
            preferred_language: userMetadata.preferred_language || '',
            ...userMetadata
          },
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

        // Check if the user has a preferred color that matches our options
        const preferredColor = this.userProfile.user_metadata?.preferred_color || '';
        const colorExists = this.colorOptions.some(color => color.code === preferredColor);

        // Check if the user has a preferred language that matches our options
        const preferredLanguage = this.userProfile.user_metadata?.preferred_language || '';
        const languageExists = this.languageOptions.some(language => language.code === preferredLanguage);

        this.profileForm.patchValue({
          given_name: givenName,
          family_name: familyName,
          nickname: user.nickname || '',
          name: user.name || '',
          email: user.email || '',
          picture: user.picture || '',
          user_metadata: {
            preferred_color: colorExists ? preferredColor : '',
            preferred_language: languageExists ? preferredLanguage : ''
          }
        });

        // If the user has previously saved preferences, log them
        if (preferredColor || preferredLanguage) {
          console.log('User has previously saved preferences:', {
            color: preferredColor,
            language: preferredLanguage
          });
        }

        // We don't need to fetch the profile on initial load since it might not exist yet
        // The user will create their profile when they first save it
        console.log('User profile loaded from Auth0, ready for editing');
      } else {
        this.userProfile = null;
      }
      this.isLoading = false;
    });
  }



  // Helper method to get language name from code
  getLanguageName(code: string | undefined): string {
    if (!code) return 'None';
    const language = this.languageOptions.find(lang => lang.code === code);
    return language ? language.name : code;
  }

  // Helper method to get color name from code
  getColorName(code: string | undefined): string {
    if (!code) return 'None';
    const color = this.colorOptions.find(col => col.code === code);
    return color ? color.name : code;
  }

  // Clear success message when alert is dismissed
  clearSuccessMessage(): void {
    this.successMessage = '';
  }

  // Clear error message when alert is dismissed
  clearErrorMessage(): void {
    this.errorMessage = '';
  }

  // Method to update user profile
  updateProfile(): void {
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
          this.successMessage = 'Your profile has been updated successfully!';
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

          // Handle specific error cases
          if (error.status === 404) {
            // This is likely the first time the user is saving their profile
            console.log('Profile not found, creating a new one...');

            // Try to create the profile instead
            this.apiService.createUserProfile(profileData).subscribe({
              next: (response) => {
                console.log('Profile created successfully:', response);
                this.successMessage = 'Your profile has been created successfully!';
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
              error: (createError) => {
                console.error('Error creating profile:', createError);
                this.errorMessage = 'Failed to create profile. Please try again later.';
                this.isSaving = false;
              }
            });
          } else {
            // Handle other types of errors
            this.errorMessage = 'Failed to update profile: ' +
              (error.error?.detail || error.message || 'Unknown error occurred');
            this.isSaving = false;
          }
        }
      });
    }
  }
}
