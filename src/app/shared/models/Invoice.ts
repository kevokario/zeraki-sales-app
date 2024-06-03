import {ISchool} from "./ISchool";
import {User} from "./User";
import {IProduct} from "./Product";

export interface Invoice {
  id?: number;
  schoolId?:number;
  userId?:number;
  productId:number;
  invoiceNumber?:string;
  creationDate:string;
  dueDate:string;
  invoiceAmount:number;
  paidAmount:number;
  completionStatus:string;
  school?:ISchool;
  user?:User;
  product?:IProduct,
  collections?:Collection[]
}

export interface Collection {
  id?:number,
  collectionDate:string,
  status?:string,
  amount:number,
  userId?:number,
  invoiceId:number,
  user?:User;
  invoice?:Invoice
}
