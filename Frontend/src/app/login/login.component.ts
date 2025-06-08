import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',

  templateUrl: './login.component.html',

  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  showSuccessAnimation: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authservice: AuthenticationService
  ) {}

  onLogin() {
    const payload = { username: this.username, password: this.password };
    this.authservice.login(payload).subscribe((response: any) => {
      console.log('Login response:', response);
      
      const token = response.token;
      const role = response.role;
      if (token) {
        this.showSuccessAnimation = true;
        setTimeout(() => {
          if (role === 'employee') {
            this.router.navigate(['/employee-dashboard']);
          } else if (role === 'manager') {
            this.router.navigate(['/manager-dashboard']);
          }
        }, 1000);
      }
    });
  }
}
