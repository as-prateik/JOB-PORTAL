import { Component } from '@angular/core';

import { TransferService } from '../transfer.service';

import { AuthenticationService } from '../authentication.service';


 

@Component({

  selector: 'app-transfer',

  templateUrl: './transfer.component.html',

  styleUrls: ['./transfer.component.css'],

})

export class TransferComponent {

  constructor(

    private transferService: TransferService,

    private authentication: AuthenticationService

  ) { }


 

  token: string = '';

  transferRequests: any[] = [];

  displayedColumns: string[] = ['requestId','employeeId', 'jobId', 'fromManagerId', 'status', 'actions'];


 

  ngOnInit() {

    this.token = this.authentication.getDetails().token || ''; // Get token from authentication service

    this.loadTransferRequests();

  }


 

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {

    switch (status) {

      case 'approved': return 'primary';

      case 'rejected': return 'warn';

      default: return 'accent'; // pending

    }

  }


 

  viewDetails(request: any): void {

    // optionally use Angular Material Dialog

    alert(`

    Employee: ${request.employeeId}

    Job ID: ${request.jobId}

    From Manager: ${request.fromManagerId}

    To Manager: ${request.toManagerId}

    Status: ${request.status}

    Requested On: ${new Date(request.createdAt).toLocaleString()}

  `);

  }



 

  loadTransferRequests() {

    this.transferService.getTranferRequests(this.token).subscribe(

      (data) => {

        console.log("data is",data);

       

        this.transferRequests = data;

        console.log("transfer requests are",this.transferRequests);

      },

      (error) => {

        console.error('Error loading transfer requests:', error);

      }

    );

  }


 

  reject(job: any) {

    this.onRequestStatusChange(job, 'rejected');

  }


 

  accept(job: any) {

    this.onRequestStatusChange(job, 'approved');

  }


 

  onRequestStatusChange(job: any, transferStatus: string) {

    let transferData = {

      jobId: job.jobId,

      status: transferStatus,

    };

    this.transferService

      .respondToTransferRequest(transferData, this.token)

      .subscribe(

        (data) => {

          console.log(data);

          if (data) {

            this.loadTransferRequests();

          }

        },

        (error) => {

          console.error('Error updating transfer requests:', error);

        }

      );

  }

}


 