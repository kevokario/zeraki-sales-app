import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IProduct} from "../models/Product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl:string = `${environment.apiUrl}/products`;
  constructor(private http:HttpClient) { }

  getProducts():Observable<Array<IProduct>> {
    return this.http.get<Array<IProduct>>(`${this.apiUrl}`);
  }
}
