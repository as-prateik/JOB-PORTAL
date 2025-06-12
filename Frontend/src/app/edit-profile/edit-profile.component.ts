import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Component } from '@angular/core';

import { OnInit } from '@angular/core';

import { AuthenticationService } from '../authentication.service';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormsModule,
} from '@angular/forms';

import { Router } from '@angular/router';

import { ElementRef, ViewChild } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-edit-profile',

  templateUrl: './edit-profile.component.html',

  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  profileForm!: FormGroup;

  isHR: boolean = false;

  user: any = null;

  loading: boolean = false;

  errorMessage: string = '';

  successMessage: string = '';

  token: string | null = null;

  selectedFiles: File[] = [];

  showSuccessAnimation: boolean = false;

  constructor(
    private fb: FormBuilder,

    private http: HttpClient,

    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getDetails().token || '';

    this.buildForm();

    this.loadUserProfile();
  }

  buildForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      phone: [''],

      location: [''],

      employeeId: [{ value: '', disabled: true }, Validators.required],

      skills: this.fb.array([]),

      certifications: this.fb.array([]),
    });
  }

  uploadFiles: { [key: string]: File } = {};

  onFileChange(event: any, type: 'resume' | 'coverLetter' | 'profilePhoto') {
    const file = event.target.files[0];

    if (file) {
      this.uploadFiles[type] = file;
    }
  }

  getProfilePhotoUrl(): string {
    if (!this.user?.profilePhotoUrl) return 'assets/default-profile.png';

    if (this.user.profilePhotoUrl.startsWith('http'))
      return this.user.profilePhotoUrl;

    return 'http://localhost:5000' + this.user.profilePhotoUrl;
  }

  removeFileFromProfile(type: 'resume' | 'coverLetter' | 'profilePhoto') {
    // Optionally, call backend to remove file reference

    this.user[type + 'Url'] = '';

    // You may want to send an update to backend here to clear the field
  }

  loadUserProfile(): void {
    console.log('in load user profile');

    this.loading = true;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    this.http
      .get<any>('http://localhost:5000/api/users/profile', { headers })
      .subscribe({
        next: (res) => {
          const user = res.user;

          console.log('user is ', user);

          console.log('name is', user.name);

          this.isHR = user.role === 'hr';

          this.profileForm.patchValue({
            name: user.name,

            email: user.email,

            phone: user.phone,

            location: user.location,

            employeeId: user.employeeId || 'N/A',

            skills: user.skills || [],
          });

          this.user = {
            name: user.name,

            email: user.email,

            employeeId: user.employeeId || 'N/A',

            role: user.role,

            description: user.description || '',

            skills: user.skills,

            location: user.location || '',

            phone: user.phone || '',


            certifications: user.certifications || [],

            profilePhotoUrl: user.profilePhotoUrl || '',

            resumeUrl: user.resumeUrl || '',

            coverLetterUrl: user.coverLetterUrl || '',
          };

          console.log('loaded skills are ', this.user.skills);

          console.log('loaded certifications are ', user.certifications);

          this.setFormArray('skills', user.skills);

          this.setFormArray('certifications', user.certifications);

          console.log('Profile photo URL:', user.profilePhotoUrl);

          if (!this.isHR) {
            this.profileForm.get('employeeId')?.disable();
          }

          this.loading = false;
        },

        error: (err) => {
          this.errorMessage = 'Failed to load profile';

          this.loading = false;
        },
      });
  }

  setFormArray(field: string, values: string[]) {
    const formArray = this.profileForm.get(field) as FormArray;

    formArray.clear();

    values.forEach((value) => formArray.push(this.fb.control(value)));
  }

  get skills() {
    return this.profileForm.get('skills') as FormArray;
  }

  get certifications() {
    return this.profileForm.get('certifications') as FormArray;
  }

  addSkill(): void {
    this.skills.push(this.fb.control(''));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  addCertification(): void {
    this.certifications.push(this.fb.control(''));
  }

  removeCertification(index: number): void {
    this.certifications.removeAt(index);
  }

  onFileSelected(event: any): void {
    const files = event.target.files;

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  triggerFileInput(): void {
    // Optional enhancement if you're handling file inputs more dynamically
  }

  saveChanges() {}

  @ViewChild('saveSuccessModal') saveSuccessModalRef!: ElementRef;

  private saveModalInstance: any;

  update(): void {
    console.log('in update function');

    if (this.profileForm.invalid) return;

    const formData = this.profileForm.getRawValue(); // Get disabled fields too

    console.log('form', formData);

    delete formData.employeeId;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    console.log(formData);

    this.http
      .put('http://localhost:5000/api/users/profile', formData, { headers })
      .subscribe({
        next: () => {
          // Then upload files if any

          if (Object.keys(this.uploadFiles).length > 0) {
            const uploadForm = new FormData();

            Object.keys(this.uploadFiles).forEach((key) => {
              uploadForm.append(key, this.uploadFiles[key]);
            });

            console.log('uploading files', uploadForm);

            this.http
              .post('http://localhost:5000/api/users/upload', uploadForm, {
                headers,
              })
              .subscribe({
                next: (res: any) => {
                  this.successMessage =
                    'Profile and files updated successfully';

                  this.user = res.user; // update user with new file URLs
                },

                error: () => {
                  this.errorMessage = 'Failed to upload files';
                },
              });
          } else {
            this.successMessage = 'Profile updated successfully';
          }
        },

        error: () => {
          this.errorMessage = 'Failed to update profile';
        },
      });
  }

  showSuccessModal(): void {
    this.saveModalInstance.show();
  }
}
