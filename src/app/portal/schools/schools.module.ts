import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolsRoutingModule } from './schools-routing.module';
import { SchoolListComponent } from './school-list/school-list.component';
import { SchoolDetailsComponent } from './school-details/school-details.component';
import {SharedModule} from "../../shared/shared.module";
import { InvoiceCollectionsComponent } from './invoice-collections/invoice-collections.component';


@NgModule({
    declarations: [
        SchoolListComponent,
        SchoolDetailsComponent,
        InvoiceCollectionsComponent
    ],
    exports: [
        InvoiceCollectionsComponent
    ],
    imports: [
        CommonModule,
        SchoolsRoutingModule,
        SharedModule
    ]
})
export class SchoolsModule { }
