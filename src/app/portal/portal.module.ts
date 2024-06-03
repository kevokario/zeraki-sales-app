import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalRoutingModule } from './portal-routing.module';
import { PortalComponent } from './portal.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import {SharedModule} from "../shared/shared.module";
import {TopNavComponent} from "./components/top-nav/top-nav.component";


@NgModule({
  declarations: [
    PortalComponent,
    SidenavComponent,
    TopNavComponent
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    SharedModule
  ]
})
export class PortalModule { }
