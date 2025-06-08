import { Component } from '@angular/core';

import { JobService } from '../job.service';

declare var bootstrap: any; // Declare bootstrap as a global variable

@Component({
  selector: 'app-manager-dashboard',

  templateUrl: './manager-dashboard.component.html',

  styleUrls: ['./manager-dashboard.component.css'],
})
export class ManagerDashboardComponent {
  managerName: string = ''; // Replace with dynamic data if available

  jobs: any[] = [];

  newJob: any = {
    title: '',

    location: '',

    description: '',

    lastDate: '',

    status: 'open',

    skills: [],
  };

  token: string | null = null;

  isPostJobVisible = true;

  isPostedJobsVisible = false;

  selectedJob: any = null;

  selectedJobApplicants: any[] = [];

  selectedJobId: string | null = null; // For delete confirmation modal

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    this.managerName = localStorage.getItem('name') || 'Manager';

    this.loadJobs();
  }

  // Load all jobs posted by the manager

  loadJobs(): void {
    this.jobService.getJobs(this.token).subscribe(
      (data: any) => {
        console.log(data);

        this.jobs = data.jobs.map((job: any) => ({
          ...job,

          lastDate: new Date(job.lastDate).toLocaleDateString('en-GB'), // Format date as DD/MM/YYYY
        }));
      },

      (error: any) => {
        console.error('Error loading jobs:', error);
      }
    );
  }

  // Create a new job

  createJob(): void {
    this.newJob.skills = this.newJob.skills
      .split(',')
      .map((skill: string) => skill.trim()); // Split skills by comma and trim whitespace

    console.log(this.newJob);

    if (
      this.newJob.title &&
      this.newJob.location &&
      this.newJob.description &&
      this.newJob.lastDate
    ) {
      this.jobService.createJob(this.newJob, this.token).subscribe(
        (data: any) => {
          console.log('Job created successfully:', data);

          this.loadJobs(); // Refresh job list after creation

          this.resetForm(); // Clear the form after job is created

          const successModal = new bootstrap.Modal(
            document.getElementById('successModal')
          );

          successModal.show(); // Show success modal
        },

        (error: any) => {
          console.error('Error creating job:', error);
        }
      );
    }
  }

  // Reset the job creation form

  resetForm(): void {
    this.newJob = {
      title: '',

      location: '',

      description: '',

      lastDate: '',

      status: 'open',
    };
  }

  // Confirm delete modal

  confirmDelete(jobId: string): void {
    this.selectedJobId = jobId;

    const deleteModal = new bootstrap.Modal(
      document.getElementById('deleteModal')
    );

    deleteModal.show(); // Show delete confirmation modal
  }

  // Delete a job

  deleteJob(): void {
    if (this.selectedJobId) {
      this.jobService
        .deleteJob(this.selectedJobId, this.token)
        .subscribe(() => {
          this.loadJobs(); // Refresh after delete

          this.selectedJobId = null; // Reset selected job ID
        });
    }
  }

  // Toggle to show the "Post Job" form

  showPostJob(): void {
    this.isPostJobVisible = true;

    this.isPostedJobsVisible = false;
  }

  // Toggle to show the "Posted Jobs" list

  showPostedJobs(): void {
    this.isPostJobVisible = false;

    this.isPostedJobsVisible = true;
  }

  // View job details in a modal

  viewJob(job: any): void {
    this.selectedJob = job;

    const modal = new bootstrap.Modal(
      document.getElementById('jobDetailsModal')!
    );

    modal.show();
  }

  // View applicants for a job in a modal

  viewApplicants(job: any): void {
    this.jobService.getApplicants(job._id).subscribe(
      (data: any) => {
        this.selectedJobApplicants = data.applicants;

        const modal = new bootstrap.Modal(
          document.getElementById('applicantsModal')!
        );

        modal.show();
      },

      (error: any) => {
        console.error('Error fetching applicants:', error);
      }
    );
  }
}
