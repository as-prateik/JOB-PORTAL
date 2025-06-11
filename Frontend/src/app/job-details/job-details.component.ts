import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { JobService } from '../job.service';

import { UserService } from '../user.service';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-job-details',

  templateUrl: './job-details.component.html',

  styleUrls: ['./job-details.component.css'],
})
export class JobDetailsComponent implements OnInit {
  jobId!: string;

  jobDetails: any;

  employeeName: string = '';

  token: string | null = null;

  termsAccepted: boolean = false;

  applications: any[] = [];

  constructor(
    private jobService: JobService,

    private route: ActivatedRoute,

    private userService: UserService,

    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getDetails().token || '';
    this.loadUserProfile();

    const jobId = this.route.snapshot.paramMap.get('id');

    if (!this.token || !jobId) {
      console.error('Token or Job ID missing');
      return;
    }

    this.jobService.getJobById(jobId, this.token).subscribe({
      next: (res) => {
        this.jobDetails = res.job;

        this.loadAppliedJobs(); // ⬅️ Load applications *after* job is ready
      },
      error: (err) => {
        console.error('Failed to load job', err);
      },
    });
  }

  loadAppliedJobs(): void {
    if (!this.token) return;

    this.jobService.getAppliedJobs(this.token).subscribe(
      (data) => {
        this.applications = (data.appliedJobs || []).map((app: any) => ({
          ...app,
          jobId: app.jobId?._id || app.jobId,
        }));

        if (this.jobDetails) {
          this.jobDetails.applied = this.isApplied(this.jobDetails);
        }
      },
      (error) => {
        console.error('Error fetching applied jobs:', error);
        this.applications = [];
      }
    );
  }

  updateApplicationStatus(): void {
    const isAlreadyApplied = this.isApplied(this.jobDetails);
    if (isAlreadyApplied) {
      this.jobDetails.applied = true; // flag for template
    }
  }

  loadUserProfile(): void {
    if (!this.token) {
      console.error('User not authenticated.');

      return;
    }

    this.userService.getUserProfile(this.token).subscribe(
      (data) => {
        console.log('Fetched user profile:', data);

        this.employeeName = data.user.name || 'Employee'; // Default to 'Employee' if name is not availabl
      },

      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  applyForJob(): void {
    console.log('existing applications are ', this.applications);
    console.log('current application is:-  ', this.jobDetails);

    if (!this.termsAccepted) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }

    if (!this.jobDetails) {
      alert('Job details not available.');

      return;
    }

    const job = this.jobDetails;

    if (this.isApplied(job)) {
      alert('You have already applied to this job.');

      return;
    }

    if (!this.token) {
      alert('You must be logged in to apply for a job.');

      return;
    }

    this.jobService.applyJob(job._id, this.token).subscribe(
      (response) => {
        console.log('Job application response:', response);

        this.loadAppliedJobs();

        if (!this.isApplied(job)) {
          this.applications.push({
            jobId: job._id,

            title: job.title,

            location: job.location,

            status: 'applied',

            appliedAt: new Date().toISOString(),

            notification: 'Application received',
          });
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

    console.log('end of apply job');
  }

  isApplied(job: any): boolean {
    if (!job || !job.jobId) return false;

    return this.applications.some(
      (application) => application.jobId === job.jobId
    );
  }

  applyJob(): void {
    if (this.isApplied(this.jobDetails)) {
      alert('You have already applied to this job.');

      return;
    }

    if (!this.token) {
      alert('You must be logged in to apply for a job.');

      return;
    }

    this.jobService.applyJob(this.jobDetails._id, this.token).subscribe(
      (response) => {
        if (!this.isApplied(this.jobDetails)) {
          this.applications.push({
            jobId: this.jobDetails._id,

            title: this.jobDetails.title,

            location: this.jobDetails.location,

            status: 'applied',

            appliedAt: new Date().toISOString(),

            notification: 'Application received',
          });

          this.loadAppliedJobs();
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

    console.log('end of apply job');
  }

  isJobOpen(): boolean {
    if (!this.jobDetails?.lastDate) return false; // If no lastDate, consider Closed or customize logic

    const today = new Date();

    const lastDate = new Date(this.jobDetails.lastDate);

    // If current date is before lastDate, job is open

    return today <= lastDate;
  }
}
