import {ISchoolType} from "./SchoolType";
import {User} from "./User";
import {IProduct} from "./Product";
import {Invoice} from "./Invoice";

export interface ICounty {
  id:number,
  name:string,
}

export interface ISchool {
  id?:number,
  schoolTypeId:number,
  schoolType?:ISchoolType,
  name:string,
  countyId:number,
  county?:ICounty,
  product?:IProduct,
  registrationDate:string,
  contactPerson:string,
  contactPhone:string,
  userId?:number,
  user?:User,
  invoices?:Array<Invoice>
  productId:number,
  balance?:number,
}
