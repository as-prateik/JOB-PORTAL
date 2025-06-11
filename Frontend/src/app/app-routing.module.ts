import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';

import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';

import { EditProfileComponent } from './edit-profile/edit-profile.component';

import { JobComponent } from './job/job.component';

import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';

import { JobDetailsComponent } from './job-details/job-details.component';

import { ApplicantsComponent } from './applicants/applicants.component';

import { AuthGuard } from './auth.guard';

import { ViewApplicantsComponent } from './view-applicants/view-applicants.component';


 

const routes: Routes = [

  { path: 'login', component: LoginComponent },


 

  { path: 'employee-dashboard', component: EmployeeDashboardComponent,canActivate: [AuthGuard] },


 

  { path: 'manager-dashboard', component: ManagerDashboardComponent, canActivate: [AuthGuard] },


 

  { path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthGuard] },


 

  { path: 'job', component: JobComponent, canActivate: [AuthGuard] },


 

  { path: 'applied-jobs', component: AppliedJobsComponent, canActivate: [AuthGuard] },


 

  { path: 'job-details/:id', component: JobDetailsComponent, canActivate: [AuthGuard] },


 

  { path: 'applicants/:jobId', component: ViewApplicantsComponent, canActivate: [AuthGuard] },


 

  { path: '**', redirectTo: 'login', pathMatch: 'full' },

];


 

@NgModule({

  imports: [RouterModule.forRoot(routes)],


 

  exports: [RouterModule],

})

export class AppRoutingModule {}


 