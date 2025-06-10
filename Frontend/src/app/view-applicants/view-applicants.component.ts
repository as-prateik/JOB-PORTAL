import { Component } from '@angular/core';

@Component({
  selector: 'app-view-applicants',
  templateUrl: './view-applicants.component.html',
  styleUrls: ['./view-applicants.component.css']
})
export class ViewApplicantsComponent {
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
