import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(private http : HttpClient ) { }
  private apiUrl = 'http://localhost:5000/api/transfer';

  createTransfer(transferData: any,token:string): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(`${this.apiUrl}/request-transfer`, transferData, { headers });
  };

  getTranferRequests(token:string){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/get-transfer`, { headers });
  };

  respondToTransferRequest(transferData:any,token:string):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/transfer-response`, transferData, { headers: new HttpHeaders({
      Authorization: `Bearer ${token}`,
    }) })
  }}
