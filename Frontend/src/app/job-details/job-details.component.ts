import { Component } from '@angular/core';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent {
  jobs = [
    {
      id: 'JOB-001',
      title: 'Frontend Developer',
      location: 'Bangalore',
      postedBy: 'Infosys',
      lastDate: '2025-06-30',
      department: 'Web Development',
      description: 'Build responsive UIs using Angular and TailwindCSS.',
      skillsRequired: ['Angular', 'HTML', 'CSS', 'TypeScript'],
    },
    {
      id: 'JOB-002',
      title: 'Backend Developer',
      location: 'Chennai',
      postedBy: 'TCS',
      lastDate: '2025-06-25',
      department: 'Backend Services',
      description: 'Develop APIs using Node.js and Express.',
      skillsRequired: ['Node.js', 'MongoDB', 'Express'],
    },
  ];

  selectedJob: any = null;

  allSkills = ['Angular', 'HTML', 'CSS', 'TypeScript', 'Node.js', 'Express', 'MongoDB'];

  selectJob(job: any) {
    this.selectedJob = job;
  }
}
