import { Component, OnInit, ViewChild } from '@angular/core';
import { PolicyAdministrationService } from './services/policy-administration.service';
import { AppComponent } from 'src/app/app.component';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormHandlerService } from 'src/app/core/services/forms/form-handler.service';
import { UserService } from '../../../core/services/user/user.service';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { environment } from 'src/environments/environment';
import { DisabilityService } from '../requests/new-request/disability/services/disability.service';
import { LifeService } from '../requests/new-request/life/services/life.service';
import {CountryRolesService} from '../../../shared/services/country-roles.service';

@Component({
	selector: 'app-policy-administration',
	templateUrl: './policy-administration.component.html',
	styles: []
})
export class PolicyAdministrationComponent implements OnInit {

	constructor(
		private router: Router,
		private policyAdministrationService: PolicyAdministrationService,
		public life: LifeService,
		public disability: DisabilityService,
		private formHandlerService: FormHandlerService,
		private appComponent: AppComponent,
		private userService: UserService,
  private countryRolesService: CountryRolesService,
  ) { }

	statusTypes = [
		{ value: 0, view: 'Revisar' },
		{ value: 1, view: 'En revisión' },
		{ value: 2, view: 'Aceptada' },
	];

	fillType = 'tipoSeguro';

	fills = {
		status: this.statusTypes,
		fillType: this.fillType
	};


	newRequestButtonOptions: MatProgressButtonOptions = {
		active: false,
		text: 'Nueva Solicitud',
		buttonColor: 'accent',
		barColor: 'primary',
		raised: true,
		stroked: false,
		mode: 'indeterminate',
		value: 0,
		disabled: false,
		fullWidth: true,
		customClass: 'dashboard-button'
	};

	// tslint:disable-next-line: max-line-length
	displayedColumns: string[] = ['id', 'idNumber', 'ramo', 'solicitud','personName', 'creationDate', 'createdBy', 'status', 'confirmDate', 'acciones'];

	dataSource;
	requests: any;
	role: any;

	loading = false;
	isWWSeguros = false;

	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	BASE_URL: any = `${environment.fileUrl}`;

	getRequests(params: HttpParams = new HttpParams()) {
		let data;

		if (this.countryRolesService.userHasMoreThanOneRole()) {
      const country = this.countryRolesService.getLocalStorageCountry();
			params = params.append('country', country.codigoPortal);
		}

		this.loading = true;

		setTimeout(() => {
			this.appComponent.showOverlay = true;
		});
		this.policyAdministrationService.getRequests(params)
			.subscribe(res => {
				setTimeout(() => {
					this.appComponent.showOverlay = false;
				});

				data = res;
				this.requests = data.data;
				this.dataSource = new MatTableDataSource(this.requests);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.loading = false;
				// console.log(data);
			}, err => console.log(err));
	}

	ngOnInit() {
		if (this.userService.getRoles().includes('wws_intermediario_admin')) {
			this.isWWSeguros = true;
		}

		this.role = this.countryRolesService.getLocalStorageCountry().dominio;
		this.getRequests();
	}

	newRequest() {
		this.newRequestButtonOptions.active = true;
		this.router.navigateByUrl('/dashboard/policy-administration/new-policy');
	}

	editRequest(Id: number) {
		this.router.navigate([`../dashboard/policy-administration/new-policy/edit`, { id: Id }]);
	}


	// confirmRequest(id: number) {
	// 	this.formHandlerService.policyAdministration(id, 'confirm', this.appComponent);
	// }

	// rejectRequest(id: number) {
	// 	this.formHandlerService.policyAdministration(id, 'deny', this.appComponent);
	// }
}

