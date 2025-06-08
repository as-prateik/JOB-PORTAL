import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',

  templateUrl: './login.component.html',

  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';

  password: string = '';

  showPassword: boolean = false;

  showSuccessAnimation: boolean = false; // <-- Add this

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const payload = { username: this.username, password: this.password };

    this.http
      .post<any>('http://localhost:5000/api/auth/login', payload)
      .subscribe({
        next: (response) => {
          console.log('response is ', response);

          localStorage.setItem('token', response.token);

          localStorage.setItem('username', response.username);

          localStorage.setItem('role', response.role);

          localStorage.setItem('name', response.name);

          if (response.token) {
            this.showSuccessAnimation = true;

            setTimeout(() => {
              if (response.role === 'employee') {
                console.log(response.role);

                this.router.navigate(['/employee-dashboard']);
              } else if (response.role === 'hr') {
                console.log(response.role);

                this.router.navigate(['/hr-dashboard']);
              } else if (response.role === 'manager') {
                console.log(response.role);

                this.router.navigate(['/manager-dashboard']);
              }
            }, 1000); // 2 seconds before navigating
          }
        },

        error: (err) => {
          // Optional: show error toast or message

          alert('Invalid username or password');

          console.log(err.message);
        },
      });
  }
}
