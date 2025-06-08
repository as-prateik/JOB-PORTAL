import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Importing CUSTOM_ELEMENTS_SCHEMA

import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';

import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';

// import { HrDashboardComponent } from './hr-dashboard/hr-dashboard.component';

import { EditProfileComponent } from './edit-profile/edit-profile.component';

import { NavbarComponent } from './navbar/navbar.component';

import { JobComponent } from './job/job.component';

import { SubmenuComponent } from './submenu/submenu.component';

import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';
import { JobDetailsComponent } from './job-details/job-details.component';

@NgModule({
  declarations: [
    AppComponent,

    LoginComponent,

    EmployeeDashboardComponent,

    ManagerDashboardComponent,

    // HrDashboardComponent,

    EditProfileComponent,

    NavbarComponent,

    JobComponent,

    SubmenuComponent,

    AppliedJobsComponent,
      JobDetailsComponent,
  ],

  imports: [
    BrowserModule,

    AppRoutingModule,

    HttpClientModule,

    FormsModule,

    ReactiveFormsModule,
  ],

  providers: [],

  bootstrap: [AppComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 2. Add CUSTOM_ELEMENTS_SCHEMA here
})
export class AppModule {}
