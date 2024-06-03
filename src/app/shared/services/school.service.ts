import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, Observable} from "rxjs";
import {ICounty, ISchool} from "../models/ISchool";
import {ISchoolType} from "../models/SchoolType";
import {Collection, Invoice} from "../models/Invoice";

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  apiUrl = `${environment.apiUrl}/schools`;
  constructor(private http: HttpClient) { }

  getSchools(userId:number | undefined):Observable<Array<ISchool>> {
    const params:URLSearchParams = new URLSearchParams();
    // params.append('userId',String(userId));
    params.append('_expand','product')
    params.append('_expand','schoolType')
    params.append('_expand','county')
    params.append('_expand','user')
    params.append('_embed','invoices')
    return this.http.get<ISchool[]>(`${environment.apiUrl}/schools?${params.toString()}` )
      .pipe(
        map((schools: ISchool[]) => {
          return schools.map((school)=>{
            let balance = 0;

            school.invoices?.forEach(invoice=>{
              balance = balance + Number(invoice.invoiceAmount)-Number(invoice.paidAmount)
            })
            school.balance = balance;
            return school;
          });
        })
      );
  }

  getUserSchools(userId: number | undefined):Observable<Array<ISchool>>{
    const params:URLSearchParams = new URLSearchParams();
    // params.append('userId',String(userId));
    params.append('_expand','product')
    params.append('userId',String(userId))
    return this.http.get<ISchool[]>(`${environment.apiUrl}/schools?${params.toString()}` )
}

  addSchool(school:ISchool):Observable<any>{
    return this.http.post(`${environment.apiUrl}/schools`,school)
  }

  getCounties():Observable<ICounty[]>{
    return this.http.get<ICounty[]>(`${environment.apiUrl}/counties`);
  }

  getSchoolTypes():Observable<ISchoolType[]>{
    return this.http.get<ISchoolType[]>(`${environment.apiUrl}/schoolTypes`);
  }
  getSchool(schoolId:number):Observable<ISchool>{
    const params:URLSearchParams = new URLSearchParams();
    params.append('_expand','product')
    params.append('_expand','schoolType')
    params.append('_expand','county')
    params.append('_expand','user')
    params.append('_embed','invoices')
    return this.http.get<ISchool>(`${environment.apiUrl}/schools/${schoolId}?${params.toString()}` ).pipe(
      map((school: ISchool) => {

          let balance = 0;

          school.invoices?.forEach(invoice=>{
            balance = balance + Number(invoice.invoiceAmount)-Number(invoice.paidAmount)
          })
          school.balance = balance;
          return school;

      })
    );
  }

  createInvoice(invoice:Invoice):Observable<Invoice>{
    return this.http.post<Invoice>(`${environment.apiUrl}/invoices`, invoice)
  }

  getInvoices(schoolId:number):Observable<Invoice[]>{
    const params:URLSearchParams = new URLSearchParams();
    params.append('_expand','product')
    params.append('_expand','user')
    params.append('_embed','collections')
    params.append('schoolId',String(schoolId))

    return this.http.get<Invoice[]>(`${environment.apiUrl}/invoices?${params.toString()}`)
      .pipe(
        map((invoices:Invoice[]  )=>{
          return  invoices.map((invoice:Invoice)=>{
            let paidAmount = 0;
            invoice.collections?.forEach((collection:Collection)=>{
              paidAmount += Number(collection.amount)
            })
            invoice.paidAmount = paidAmount;
            return invoice;
          })
        })
      );
  }

  getInvoice(invoiceId:number):Observable<Invoice>{
    const params:URLSearchParams = new URLSearchParams();
    params.append('id',String(invoiceId));
    params.append('_expand','product')
    params.append('_expand','user')
    params.append('_expand','school')
    params.append('_embed','collections')
    return this.http.get<Invoice>(`${environment.apiUrl}/invoices/${invoiceId}?${params.toString()}`)
      .pipe(
        map((invoice:Invoice )=>{
          let paidAmount = 0;
          invoice.collections?.forEach((collection:Collection)=>{
            paidAmount += Number(collection.amount)
          })
          invoice.paidAmount = paidAmount;
          return invoice;

      }));
  }

  getCollections(invoiceId:number):Observable<Collection[]>{
    const params:URLSearchParams = new URLSearchParams();
    params.append('invoiceId',String(invoiceId));
    params.append('_expand','user')
    return this.http.get<Collection[]>(`${environment.apiUrl}/collections?${params.toString()}`);
  }

  recordCollection(collection:Collection):Observable<Collection>{
    return this.http.post<Collection>(`${environment.apiUrl}/collections/`,collection);
  }

}
