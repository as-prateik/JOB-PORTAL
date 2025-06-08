import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthenticationService } from '../authentication.service';
declare var bootstrap: any;

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
})

export class JobComponent implements OnInit {
  jobs: any[] = [];
  applications: any[] = []; // For applied jobs
  employeeName: string = '';
  employeeSkills: string[] = [];
  employeeCertifications: string[] = [];
  searchQuery: string = '';
  locationFilter: string = '';
  skillsFilter: string = '';
  token: string | null = null;

  constructor(
    private jobService: JobService,
    private router: Router,
    private userService: UserService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    console.log('in ng oninit of job component');
    this.token = this.authService.getDetails().token || '';
    this.loadUserProfile();
    this.loadAppliedJobs();
    this.loadJobs();
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

        this.employeeSkills = data.user.skills || [];

        this.employeeCertifications = data.user.certifications || [];
      },

      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  loadAppliedJobs(): void {
    if (!this.token) {
      console.error('User not authenticated.');
      return;
    }
    console.log('in loadAppliedJobs method');
    this.jobService.getAppliedJobs(this.token).subscribe(
      (data) => {
        console.log('Fetched applied jobs:', data);

        this.applications = (data.appliedJobs || []).map(
          (application: any) => ({
            ...application,
            title: application.jobId?.title || 'Unknown Title', // Use the populated title
            location: application.jobId?.location || 'Unknown Location', // Use the populated location
          })
        );
        console.log('Mapped applications:', this.applications);
      },

      (error) => {
        console.error('Error fetching applied jobs:', error);
        this.applications = []; // Ensure applications is an empty array on error
      }
    );
  }

  loadJobs(): void {
    this.jobService.getJobs(this.token).subscribe(
      (data) => {
        this.jobs = data.jobs;
      },

      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }

  // Filter logic for UI

  filteredJobs(): any[] {
    return this.jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        job.location.toLowerCase().includes(this.locationFilter.toLowerCase())
      );
    });
  }

  selectedJob: any = null;

  applyJob(job: any): void {
    console.log('job is', job);

    if (!this.token) {
      alert('You must be logged in to apply for a job.');
      return;
    }
    this.jobService.applyJob(job._id, this.token).subscribe(
      (response) => {
        if (!this.isApplied(job)) {
          this.applications.push({
            jobId: job._id,
            title: job.title,
            location: job.location,
            status: 'applied',
            appliedAt: new Date().toISOString(),
            notification: 'Application received',
          });
          const modal = new bootstrap.Modal(
            document.getElementById('applySuccessModal')!
          );
          modal.show();
        }
      },

      (error) => {
        if (error.status === 400) {
          alert(error.error.message || 'You have already applied to this job.');
        } else if (error.status === 500) {
          alert(
            'An error occurred while applying for the job. Please try again later.'
          );
        } else {
          alert('Failed to apply for the job. Please try again.');
        }

        console.error('Error applying for job:', error);
      }
    );
    console.log("end of apply job");
  }

  withdrawJob(): void {
    if (!this.selectedApplication || !this.token) {
      alert('No application selected or user not authenticated.');

      return;
    }

    console.log('Selected application:', this.selectedApplication); // Debugging

    console.log('Selected job ID:', this.selectedApplication.jobId); // Debugging

    // Call the backend API to withdraw the application

    this.jobService
      .withdrawApplication(this.selectedApplication.jobId, this.token)
      .subscribe(
        (response) => {
          // Remove the application from the local list

          this.applications = this.applications.filter(
            (application) =>
              application.jobId !== this.selectedApplication.jobId
          );

          this.selectedApplication = null;

          // Hide the modal

          const modal = bootstrap.Modal.getInstance(
            document.getElementById('withdrawConfirmModal')!
          );

          modal?.hide();

          //alert('Application withdrawn successfully.');
        },

        (error) => {
          console.error('Error withdrawing application:', error);

          //alert('Failed to withdraw the application. Please try again.');
        }
      );
  }

  selectedApplication: any = null;

  confirmWithdraw(application: any): void {
    if (!application || !application.jobId) {
      console.error(
        'Invalid application selected for withdrawal:',
        application
      );

      alert('Invalid application selected.');

      return;
    }

    this.selectedApplication = application;

    const modal = new bootstrap.Modal(
      document.getElementById('withdrawConfirmModal')!
    );

    modal.show();
  }

  isApplied(job: any): boolean {
    const applied = this.applications.some(
      (application) => application.jobId?._id === job._id
    );

    console.log(`Job ${job._id} applied:`, applied);

    return applied;
  }

  viewJobDescription(job: any): void {
    this.selectedJob = job;

    const modal = new bootstrap.Modal(
      document.getElementById('jobDetailsModal')!
    );

    modal.show();
  }

  notifications: string[] = [
    'Application approved',
    'New job posted',
    'Deadline extended',
  ];

  showNotifications = false;

  toggleNotifications(event: MouseEvent): void {
    event.preventDefault();

    this.showNotifications = !this.showNotifications;
  }

  logout() {
    this.router.navigate(['/login']);
  }

  onTouch() {
    this.router.navigate(['/edit-profile']);
  }
}
