import { Component, OnInit } from '@angular/core';


 

import { ActivatedRoute } from '@angular/router';


 

import { JobService } from '../job.service';


 

import { UserService } from '../user.service';


 

import { AuthenticationService } from '../authentication.service';


 

@Component({


 

  selector: 'app-job-details',


 

  templateUrl: './job-details.component.html',


 

  styleUrls: ['./job-details.component.css']


 

})


 

export class JobDetailsComponent implements OnInit {


 

  jobId!: string;


 

  jobDetails: any;


 

  employeeName:string=''


 

  token: string | null = null;


 

    constructor(


 

      private jobService: JobService,


 

      private route: ActivatedRoute,


 

      private userService: UserService,


 

      private authService: AuthenticationService


 

    ){}


 

    ngOnInit(): void {


 

      const jobId = this.route.snapshot.paramMap.get('id');


 

      this.token = this.authService.getDetails().token || ''; // or wherever you're storing it


 

      this.loadUserProfile()


 

      if (!this.token) {

        console.error('Token is missing');

        return;

      }



 

      if (jobId && this.token) {

        this.jobService.getJobById(jobId, this.token).subscribe({

          next: (res) => {

            this.jobDetails = res.job;

            console.log('Job loaded:', this.jobDetails);

          },

          error: (err) => {

            console.error('Failed to load job', err);

          },

        });

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


 

          this.employeeName = data.user.name || 'Employee'; // Default to 'Employee' if name is not available


 

        },


 

        (error) => {


 

          console.error('Error fetching user profile:', error);


 

        }


 

      );


 

    }


 

    isJobOpen(): boolean {

      if (!this.jobDetails?.lastDate) return false; // If no lastDate, consider Closed or customize logic

   

      const today = new Date();

      const lastDate = new Date(this.jobDetails.lastDate);

   

      // If current date is before lastDate, job is open

      return today <= lastDate;

    }


 

}