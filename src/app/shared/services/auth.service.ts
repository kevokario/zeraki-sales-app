import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/User";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl:string = `${environment.apiUrl}/users`;

  currentUser$:BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private toastr:ToastrService) { }

  registerUser(user:User):Observable<any> {
    return this.http.post(this.apiUrl,user);
  }
  getUserByEmail(email:string):Observable<Array<User>>{
    const params:URLSearchParams  = new URLSearchParams();
    params.append('email',email);
    return this.http.get<Array<User>>(`${this.apiUrl}?${ params.toString() }`);
  }

  loginUser(email:string,password:string):Observable<Array<User>>{
    const params:URLSearchParams  = new URLSearchParams();
    params.append('email',email);
    params.append('password',password);
    return this.http.get<Array<User>>(`${this.apiUrl}?${ params.toString() }`);
  }

  setCurrentUser(user:User):void{
    this.currentUser$.next(user);
  }
  get currentUser():Observable<User | null> {
    return new Observable<User | null>(subscriber => {
      const token = localStorage.getItem(environment.userToken);
      if(token) subscriber.next(JSON.parse(token));
      else subscriber.next(null)
    })
  }

  error(message:string = "Restart Json Server", title:string="An error occurred!"){
    this.toastr.error(message,title)
  }


  logout() {
    return new Observable(subscriber => {
      this.currentUser$.next(null);
      localStorage.removeItem(environment.userToken);
      subscriber.next("success");
    });
  }

  checkEmailExitsForUser(email:string,userId:number):Observable<Array<User>>{
    const params:URLSearchParams  = new URLSearchParams();
    params.append('email',email);
    params.append('id_ne',userId.toString());
    return this.http.get<Array<User>>(`${this.apiUrl}?${ params.toString() }`);
  }
  updateUser(user:User):Observable<any> {
    return this.http.patch(`${this.apiUrl}/${user.id}`,user)
  }
}
