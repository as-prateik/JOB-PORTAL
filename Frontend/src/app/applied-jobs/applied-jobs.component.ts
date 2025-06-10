import { Component, OnInit } from '@angular/core';

import { JobService } from '../job.service';

import { Router } from '@angular/router';

import { UserService } from '../user.service';

import { AuthenticationService } from '../authentication.service';

declare var bootstrap: any;


 

@Component({

  selector: 'app-applied-jobs',

  templateUrl: './applied-jobs.component.html',

  styleUrls: ['./applied-jobs.component.css'],

})

export class AppliedJobsComponent implements OnInit {

  employeeName: string = '';

  applications: any[] = [];

  currentPage: number = 1;

  itemsPerPage: number = 10;

  selectedApplication: any = null;

  token: string | null = null;

  jobDetails: any = null; // to hold fetched job details


 

  constructor(

    private jobService: JobService,

    private router: Router,

    private userService: UserService,

    private authService: AuthenticationService

  ) {}


 

  ngOnInit(): void {

    this.token = this.authService.getDetails().token || '';

    this.loadUserProfile();

    this.loadAppliedJobs();

  }


 

  loadAppliedJobs(): void {

    if (!this.token) {

      console.error('User not authenticated.');

      return;

    }

    console.log('in loadAppliedJobs method');

    this.userService.getUserApplications(this.token).subscribe(

      (data) => {

        console.log('Fetched applied jobs:', data);


 

        this.applications = (data.appliedJobs || []).map((application: any) => ({

          ...application,

          title: application.title || 'Unknown Title', // Use the populated title

          location: application.location || 'Unknown Location', // Use the populated location

        }));


 

        console.log('Mapped applications:', this.applications);

      },

      (error) => {

        console.error('Error fetching applied jobs:', error);

        this.applications = []; // Ensure applications is an empty array on error

      }

    );

  }


 

  loadUserProfile(): void {

    if (!this.token) {

      console.error('User not authenticated.');

      return;

    }

    this.userService.getUserProfile(this.token).subscribe(

      (data) => {

        console.log('Fetched user profile:', data);

        this.employeeName = data.user.name || 'Employee'; // Default to 'Employee' if name is not available

      },

      (error) => {

        console.error('Error fetching user profile:', error);

      }

    );

  }


 

  paginatedApplications() {

    const start = (this.currentPage - 1) * this.itemsPerPage;

    return this.applications.slice(start, start + this.itemsPerPage);

  }


 

  totalPages(): number {

    return Math.ceil(this.applications.length / this.itemsPerPage);

  }


 

  nextPage() {

    if (this.currentPage < this.totalPages()) {

      this.currentPage++;

    }

  }


 

  previousPage() {

    if (this.currentPage > 1) {

      this.currentPage--;

    }

  }


 

  confirmWithdraw(application: any): void {

    if (!this.token || !application?.jobId) return;


 

    const confirmed = confirm(

      `Are you sure you want to withdraw from "${application.title}"?`

    );


 

    if (!confirmed) return;


 

    this.jobService

      .withdrawApplication(application.jobId._id || application.jobId, this.token)

      .subscribe({

        next: () => {

          this.applications = this.applications.filter(

            (app) => app.jobId !== application.jobId

          );


 

          if (this.currentPage > this.totalPages()) {

            this.currentPage = this.totalPages();

          }

        },

        error: (error) => {

          console.error('Failed to withdraw application:', error);

          alert('Failed to withdraw application. Please try again.');

        },

      });

  }


 

  // Updated openModal to fetch job details from server

  openModal(application: any): void {

    if (!this.token) {

      console.error('Token is missing');

      return;

    }


 

    if (application.jobId && this.token) {

      this.jobService.getJobById(application.jobId, this.token).subscribe({

        next: (res) => {

          this.jobDetails = res.job;

          this.selectedApplication = this.jobDetails;


 

          const modalElement = document.getElementById('applicationModal');

          if (modalElement) {

            const modal = new bootstrap.Modal(modalElement);

            modal.show();

          }


 

          console.log('Job loaded:', this.jobDetails);

        },

        error: (err) => {

          console.error('Failed to load job', err);

          alert('Failed to load job details.');

        },

      });

    }

  }

}