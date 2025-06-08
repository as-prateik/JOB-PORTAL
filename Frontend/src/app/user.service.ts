import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users'; // Backend API endpoint

  constructor(private http: HttpClient) {}

  getUserProfile(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateUserProfile(token: string, profileData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(`${this.apiUrl}/profile`, profileData, {
      headers,
    });
  }

  uploadUserFiles(
    token: string,
    files: { [key: string]: File }
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const uploadForm = new FormData();

    Object.keys(files).forEach((key) => {
      uploadForm.append(key, files[key]);
    });

    return this.http.post<any>(`${this.apiUrl}/upload`, uploadForm, {
      headers,
    });
  }
}
