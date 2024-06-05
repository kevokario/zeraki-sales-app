import {IProduct} from "./Product";

export interface ITarget {
  collection?: number;
  status?: any;
  id?: number;
  userId?:number;
  productId:number;
  target:number;
  dueDate:string;
  startDate:string;
  product?:IProduct
}
