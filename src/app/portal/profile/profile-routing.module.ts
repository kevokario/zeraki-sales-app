import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "./profile.component";
import {UserComponent} from "./user/user.component";
import {TargetsComponent} from "./targets/targets.component";

const routes: Routes = [{
  path:'',
  component: ProfileComponent,
  children:[{
    path:'',
    component:UserComponent,
  },{
    path:'targets',
    component:TargetsComponent,
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
