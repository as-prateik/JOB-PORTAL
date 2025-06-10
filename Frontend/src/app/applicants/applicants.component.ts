import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { JobService } from '../job.service'; // Import your job service

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.css']
})
export class ApplicantsComponent implements OnInit {
  managerName: string = '';
  applicants: any[] = [];
  token: string = '';
  jobId: string = '';

  constructor(
    private authentication: AuthenticationService,
    private jobService: JobService,
    private route: ActivatedRoute
  ) { }

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

  viewProfile(applicant: any) {
    alert(`Viewing profile for ${applicant.name}`);
    // Replace this with actual navigation later
  }
}