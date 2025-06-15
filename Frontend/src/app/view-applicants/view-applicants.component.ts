import { ActivatedRoute } from '@angular/router';

import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../authentication.service';

import { JobService } from '../job.service'; // Import your job service

import { TransferService } from '../transfer.service';

declare var bootstrap: any;

@Component({
  selector: 'app-view-applicants',

  templateUrl: './view-applicants.component.html',

  styleUrls: ['./view-applicants.component.css'],
})
export class ViewApplicantsComponent implements OnInit {
  managerName: string = '';

  applicants: any[] = [];

  token: string = '';

  jobId: string = '';

  modalMessage: string = '';

  currentView: 'applicants' | 'employeeProfile' = 'applicants';

  selectedEmployee: any;

  constructor(
    private authentication: AuthenticationService,

    private jobService: JobService,

    private route: ActivatedRoute,

    private transferService: TransferService
  ) {}

  ngOnInit(): void {
    this.managerName = this.authentication.getDetails().name || 'Manager';

    this.token = this.authentication.getDetails().token || ''; // Adjust if your service uses a different method

    this.jobId = this.route.snapshot.paramMap.get('jobId') || '';

    if (this.jobId && this.token) {
      this.jobService.getApplicants(this.jobId, this.token).subscribe(
        (data: any) => {
          this.applicants = data.applicants || [];

          console.log(this.applicants, 'applicants');
        },

        (error) => {
          console.error('Error fetching applicants:', error);
        }
      );
    }
  }

  showView(view: 'applicants' | 'employeeProfile'): void {
    this.currentView = view;
  }

  viewProfile(applicant: any) {
    this.showView('employeeProfile');

    this.selectedEmployee = applicant;

    // Replace this with actual navigation later
  }

  submitStatus(applicant: any) {
    // Adjust depending on where you store the token

    if (!this.token) {
      alert('Authorization token not found.');

      return;
    }

    if (applicant.status === 'Accepted - Pending Approval') {
      console.log('jobId is', this.jobId);

      const transferData = {
        employeeId: applicant.userId,

        jobId: this.jobId,
      };

      this.transferService.createTransfer(transferData, this.token).subscribe(
        (response) => {
          console.log('Transfer request sent:', response);

          // alert(`Transfer request created for ${applicant.name}`);

          this.updateApplicantStatus(applicant);
        },

        (error) => {
          console.error('Transfer request failed:', error);

          alert(`Failed to create transfer request for ${applicant.name}`);
        }
      );
    } else {
      // Handle other statuses

      this.updateApplicantStatus(applicant);
    }
  }

  updateApplicantStatus(applicant: any) {
    // Replace with real update logic or API call

    console.log(
      'jobId is',

      this.jobId,

      'user id is ',

      applicant.userId,

      'status is ',

      applicant.status
    );

    console.log(`Status for ${applicant.name} updated to ${applicant.status}`);

    this.jobService

      .updateApplicantStatus(
        this.jobId,

        applicant.userId,

        applicant.status,

        this.token
      )

      .subscribe(
        (response) => {
          console.log('Applicant status updated:', response);

          this.modalMessage = `Status updated for ${applicant.name} to "${applicant.status}"`;

          const modalElement = document.getElementById('statusUpdateModal');

          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);

            modal.show();
          }
        },

        (error) => {
          console.error('Error updating applicant status:', error);

          this.modalMessage = `Failed to update status for ${applicant.name}`;

          const modalElement = document.getElementById('statusUpdateModal');

          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);

            modal.show();
          }
        }
      );
  }
}
