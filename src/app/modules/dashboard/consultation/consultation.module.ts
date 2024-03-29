import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultationRoutingModule } from './consultation-routing.module';
import { ConsultationComponent } from './consultation.component';
import { ConsultHeaderComponent } from './consult-header/consult-header.component';
import { PolicyFilterComponent } from './policy-content/policy-filter/policy-filter.component';
import {ReactiveFormsModule} from '@angular/forms';
import { PolicyTableComponent } from './policy-content/policy-table/policy-table.component';
import {MatSortModule} from '@angular/material/sort';
import {MaterialModule} from '../../../shared/modules/material.module';
import { BillsFilterComponent } from './bills-content/bills-filter/bills-filter.component';
import { BillsTableComponent } from './bills-content/bills-table/bills-table.component';
import { PolicyDetailsComponent } from './policy-details/policy-details/policy-details.component';
import { BillsTableConsultComponent } from './bills-content/bills-table-consult/bills-table-consult.component';
import { BillsFilterConsultComponent } from './bills-content/bills-filter-consult/bills-filter-consult.component';
import { ClaimTableComponent } from './claim/claim-table/claim-table.component';
import { ClaimFilterComponent } from './claim/claim-filter/claim-filter.component';
import { ReceiptTableComponent } from './receipt/receipt-table/receipt-table.component';
import { ReceiptFilterComponent } from './receipt/receipt-filter/receipt-filter.component';
import { AccountStatusTableComponent } from './accountStatus/account-status-table/account-status-table.component';
import { AccountStatusFilterComponent } from './accountStatus/account-status-filter/account-status-filter.component';

@NgModule({
  declarations: [ConsultationComponent, ConsultHeaderComponent, PolicyFilterComponent,
    PolicyTableComponent, BillsFilterComponent, BillsTableComponent, PolicyDetailsComponent,
    BillsTableConsultComponent, BillsFilterConsultComponent, ClaimTableComponent, ClaimFilterComponent,
    ReceiptTableComponent, ReceiptFilterComponent, AccountStatusTableComponent, AccountStatusFilterComponent],
  imports: [
    CommonModule,
    ConsultationRoutingModule,
    ReactiveFormsModule,
    MatSortModule,
    MaterialModule
  ]
})
export class ConsultationModule { }
