import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ITarget} from "../models/Target";

@Injectable({
  providedIn: 'root'
})
export class TargetService {

  apiUrl: string = `${environment.apiUrl}/targets`;
  constructor(private http: HttpClient) {
  }

  getUserTargets(userID: number | undefined):Observable<ITarget[]>{
    const params:URLSearchParams = new URLSearchParams();
    params.append('userId',String(userID))
    params.append('_expand','product')
    return this.http.get<ITarget[]>(`${this.apiUrl}?${ params.toString() }`);
  }

  setUserTarget(target:ITarget):Observable<any>{
    return this.http.post(`${this.apiUrl}`,target)
  }
}
