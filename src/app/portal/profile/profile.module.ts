import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { UserComponent } from './user/user.component';
import { TargetsComponent } from './targets/targets.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    ProfileComponent,
    UserComponent,
    TargetsComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }
