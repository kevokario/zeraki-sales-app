import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SchoolListComponent} from "./school-list/school-list.component";
import {SchoolDetailsComponent} from "./school-details/school-details.component";
import {InvoiceCollectionsComponent} from "./invoice-collections/invoice-collections.component";

const routes: Routes = [{
  path:'',
  component:SchoolListComponent
},{
  path:':id',
  component: SchoolDetailsComponent
},{
  path:':id/collections/:invoiceId',
  component:InvoiceCollectionsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolsRoutingModule { }
