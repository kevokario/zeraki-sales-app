import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PortalComponent} from "./portal.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PortalComponent,
    children:[
      /**
       *
       * Lazy load the two modules here
       * */
      {
        path:'dashboard',
        loadChildren:()=> import('./dashboard/dashboard.module').then(m=>m.DashboardModule),
      },
      {
        path:'schools',
        loadChildren:()=> import('./schools/schools.module').then(m=>m.SchoolsModule),
      },
      {
        path:'profile',
        loadChildren:()=> import('./profile/profile.module').then(m=>m.ProfileModule),
      },
      {
        path:'',
        redirectTo:'dashboard',
        pathMatch:'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
