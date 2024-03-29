import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ReceiptService } from '../services/receipt.service';
import { HttpParams } from '@angular/common/http';
import { AppComponent } from '../../../../../app.component';
import { UserService } from '../../../../../core/services/user/user.service';
import { environment } from 'src/environments/environment';
import {CountryRolesService} from '../../../../../shared/services/country-roles.service';
import {CountryRoleTypes} from '../../../../../shared/utils/keys/country-role-types';


@Component({
  selector: 'app-receipt-table',
  templateUrl: './receipt-table.component.html',
  styleUrls: ['./receipt-table.component.scss']
})
export class ReceiptTableComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  receiptfilter;
  // @Output() pendingBillsEmitter = new EventEmitter<number>();
  @Input() policyId;
  @Input() set filters(receiptfilter) {
    if (receiptfilter) {
      this.receiptfilter = receiptfilter;
      this.loadData();
    } else {
      this.receiptfilter = {
        numeroFactura: '',
        nombre: '',
        from: '',
        to: '',
      };
    }
  }
  BASE_URL: any = `${environment.fileUrlHttps}`;
  dataSource;
  data = [];
  displayedColumns: string[] = ['receiptNumber', 'client', 'rec', 'chargeDate', 'paymentType',
    'amountCharge', 'actions'];

  constructor(
    private receiptService: ReceiptService,
    private appComponent: AppComponent,
    private userService: UserService,
    private countryRolesService: CountryRolesService,
  ) { }
  userRole;
  ngOnInit() {
    // this.appComponent.showOverlay = true;
    this.userRole = this.countryRolesService.getLocalStorageCountry().dominio;
    this.loadData();
  }

  getBillDownloadLink(billId) {
    const country = this.countryRolesService.getLocalStorageCountry();
    return `${this.BASE_URL}/InvoiceView/ExportToPDF/${country.codigoPortal}/Reembolsos/${billId}/${this.policyId}`;
  }

  loadData() {
    let httpParams = this.constructQueryParams();

    if (this.countryRolesService.userHasMoreThanOneRole()) {
      const country = this.countryRolesService.getLocalStorageCountry();
      httpParams = httpParams.append('country', country.codigoPortal);
    }

    this.receiptService.getReceipts(httpParams, this.policyId).subscribe((res: any) => {
      this.data = res.data || [];
      console.log(this.policyId);
      console.log(res);
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.appComponent.showOverlay = false;
    });
  }

  constructQueryParams(): HttpParams {
    let httpParams = new HttpParams();
    if (this.receiptfilter.numeroFactura && this.receiptfilter.numeroFactura !== '') {
      httpParams = httpParams.append('numeroFactura', this.receiptfilter.numeroFactura.toString());
    }

    if (this.receiptfilter.nombre && this.receiptfilter.nombre !== '') {
      httpParams = httpParams.append('nombre', this.receiptfilter.nombre.toString());
    }


    if (this.receiptfilter.from && this.receiptfilter.from !== '') {
      httpParams = httpParams.append('from', this.receiptfilter.from.toString());
    }

    if (this.receiptfilter.to && this.receiptfilter.to !== '') {
      httpParams = httpParams.append('to', this.receiptfilter.to.toString());
    }

    return httpParams;
  }
}
