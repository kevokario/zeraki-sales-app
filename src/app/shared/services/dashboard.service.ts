import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ISchool} from "../models/ISchool";
import {environment} from "../../../environments/environment";
import {Collection, Invoice} from "../models/Invoice";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getTotalCollections(userId:number|undefined):Observable<Collection[]>{
    const params:URLSearchParams = new URLSearchParams();
    params.append('userId',String(userId));
    return this.http.get<Collection[]>(`${environment.apiUrl}/collections?${ params.toString() }`);
  }

  getTotalRevenue():Observable<Invoice[]>{
    return this.http.get<Invoice[]>(`${environment.apiUrl}/invoices`);
  }

  getUserSignups(userId:number|undefined):Observable<ISchool[]>{
    const params:URLSearchParams = new URLSearchParams();
    params.append('userId',String(userId));
    return this.http.get<ISchool[]>(`${environment.apiUrl}/schools?${ params.toString() }`);
  }
}
