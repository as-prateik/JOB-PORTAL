import { Component } from '@angular/core';


 

import { JobService } from '../job.service';


 

import { AuthenticationService } from '../authentication.service';


 

import { Router } from '@angular/router';


 

declare var bootstrap: any; // Declare bootstrap as a global variable


 

@Component({

  selector: 'app-manager-dashboard',


 

  templateUrl: './manager-dashboard.component.html',


 

  styleUrls: ['./manager-dashboard.component.css'],

})

export class ManagerDashboardComponent {

  managerName: string = ''; // Replace with dynamic data if available


 

  jobs: any[] = [];

  minDate: string = '';


 

  newJob: any = {

    title: '',


 

    location: '',


 

    description: '',


 

    lastDate: '',


 

    status: 'open',


 

    skillsRequired: [],

  };


 

  token: string = '';


 

  isPostJobVisible = true;


 

  isPostedJobsVisible = false;


 

  selectedJob: any = null;


 

  selectedJobApplicants: any[] = [];


 

  selectedJobId: string | null = null; // For delete confirmation modal


 

  constructor(

    private jobService: JobService,


 

    private authentication: AuthenticationService,


 

    private router: Router

  ) { }


 

  ngOnInit(): void {

    this.token = this.authentication.getDetails().token || ''; // Get token from authentication service


 

    this.managerName = this.authentication.getDetails().name || 'Manager'; //


 

    this.loadJobs();

    this.setMinDate();

  }


 

  updateApplicantStatus(jobId: string, employeeId: string, status: string): void {

    this.jobService.updateApplicantStatus(jobId, employeeId, status).subscribe(

      () => {

        // Refresh the applicants list

        this.viewApplicants(this.selectedJob);

      },

      (error) => {

        console.error(`Failed to update status to ${status}:`, error);

      }

    );

  }


 

  approveApplicantTransfer(jobId: string, employeeId: string): void {

    this.jobService.approveApplicantTransfer(jobId, employeeId).subscribe(

      () => {

        // Refresh the applicants list

        this.viewApplicants(this.selectedJob);

      },

      (error) => {

        console.error('Failed to approve applicant transfer:', error);

      }

    );

  }



 

  viewJobDescription(job: any): void {

    this.router.navigate([`/job-details/${job.jobId}`])

  }


 

  // Load all jobs posted by the manager


 

  loadJobs(): void {

    this.jobService.getMyJobs(this.token).subscribe(

      (data: any) => {

        console.log(data);


 

        this.jobs = data.jobs.map((job: any) => ({

          ...job,


 

          // lastDate: new Date(job.lastDate).toLocaleDateString('en-GB'), // Format date as DD/MM/YYYY

          lastDate: new Date(job.lastDate)

        }));

      },


 

      (error: any) => {

        console.error('Error loading jobs:', error);

      }

    );

  }


 

  setMinDate(): void {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');

    const day = String(today.getDate()).padStart(2, '0');

    this.minDate = `${year}-${month}-${day}`;

  }


 

  // Create a new job


 

  createJob(): void {

    console.log('Creating job with data:', this.newJob);


 

    console.log('skills before processing:', this.newJob.skills);


 

    if (typeof this.newJob.skillsRequired === 'string') {

      this.newJob.skillsRequired = this.newJob.skillsRequired


 

        .split(',')


 

        .map((skill: string) => skill.trim().toLowerCase())


 

        .filter((skill: string) => skill.length > 0);

    } else if (Array.isArray(this.newJob.skillsRequired)) {

      this.newJob.skillsRequired = this.newJob.skillsRequired


 

        .map((skill: string) => skill.trim().toLowerCase())


 

        .filter((skill: string) => skill.length > 0);

    }


 

    console.log('skills after processing:', this.newJob.skills);


 

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


 

  confirmAndCloseDelete(): void {

    if (this.selectedJobId) {

      this.jobService

        .deleteJob(this.selectedJobId, this.token)

        .subscribe(() => {

          this.loadJobs(); // Refresh the job list


 

          this.selectedJobId = null;


 

          // Close the modal manually


 

          const modalElement = document.getElementById('deleteModal');


 

          if (modalElement) {

            const modalInstance = bootstrap.Modal.getInstance(modalElement);


 

            modalInstance?.hide(); // Close the modal after deletion

          }

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

    this.jobService.getApplicants(job._id, this.token).subscribe(

      (data: any) => {

        this.selectedJobApplicants = data.applicants;


 

        console.log(this.selectedJobApplicants, ' applicants');


 

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


 