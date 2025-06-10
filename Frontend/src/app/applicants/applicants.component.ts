import { Component } from '@angular/core';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.css']
})
export class ApplicantsComponent {
  applicants = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'Frontend Developer',
      status: 'Pending'
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      position: 'Backend Developer',
      status: 'Shortlisted'
    },
    {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      position: 'Data Analyst',
      status: 'Rejected'
    }
  ];

  viewProfile(applicant: any) {
    alert(`Viewing profile for ${applicant.name}`);
    // Replace this with actual navigation later
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status pending';
      case 'shortlisted':
        return 'status shortlisted';
      case 'rejected':
        return 'status rejected';
      default:
        return 'status';
    }
  }
}
