import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token: string | null = null;
  private username: string | null = null;
  private role: string | null = null;
  private name: string | null = null;

  constructor(private http:HttpClient) { }


  login(payload: { username: string, password: string }){
    console.log('In login method of authentication service');
    console.log('payload is ', payload);
    console.log('prev username is ', this.username);
    
    
    // This method sends a POST request to the backend for user login
    // It expects a payload with username and password
    // Returns an Observable that can be subscribed to for the response
    this.http.post<any>('http://localhost:5000/api/auth/login', payload).subscribe({
        next: (response) => {
          console.log('response is ', response);
          this.token = response.token;
          this.username = response.username;
          this.role = response.role;
          this.name = response.name;
        },
        error: (err) => {
          // Optional: show error toast or message
          alert('Invalid username or password');
          console.log(err.message);
        },
      });

    return this.http.post<any>('http://localhost:5000/api/auth/login', payload);
  }

  getDetails(){
    // This method returns the current user's details
    // It includes token, username, role, and name
    return {
      token: this.token,
      username: this.username,
      role: this.role,
      name: this.name
    };
  }

  logout() {
    // This method clears the stored user details
    this.token = null;
    this.username = null;
    this.role = null;
    this.name = null;
  }
}
