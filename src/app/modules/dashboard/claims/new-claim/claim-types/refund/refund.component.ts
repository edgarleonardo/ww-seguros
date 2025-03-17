import { Component, OnInit, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { FieldConfig, Validator } from '../../../../../../shared/components/form-components/models/field-config';
import { FormHandlerService } from '../../../../../../core/services/forms/form-handler.service';
import { RefundService } from '../../../../claims/new-claim/claim-types/refund/services/refund.service';
import { Observable } from 'rxjs';
import { BaseDialogComponent } from 'src/app/shared/components/base-dialog/base-dialog.component';
import { map, first, startWith } from 'rxjs/operators';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { DialogOptionService } from 'src/app/core/services/dialog/dialog-option.service';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from '../../../../../../app.component';
import { UserService } from '../../../../../../core/services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { ClaimsService } from '../../../../services/claims/claims.service';
import { HttpParams } from '@angular/common/http';
import { RequestsService } from 'src/app/modules/dashboard/services/requests/requests.service';
import { FormDataFillingService } from 'src/app/modules/dashboard/services/shared/formDataFillingService';
import {CountryRolesService} from '../../../../../../shared/services/country-roles.service';


// tslint:disable: no-string-literal
// tslint:disable: max-line-length

@Component({
	selector: 'app-refund',
	templateUrl: './refund.component.html',
	styleUrls: ['./refund.component.scss']
})
export class RefundComponent implements OnInit {
	accordionTitles = [
		'Información del Asegurado / Paciente',
		'Diagnóstico o Naturaleza de condición Médica / Accidente',
		'Información para fines de pago',
		'Declaración'
	];

	totalAmount: number;
	totalAmountPesos: number;
	todayDate = new Date();
	validDatesCounter = 0;
	filesInformation = [];
	showContent = false;
	step: number;

	formaPago: FieldConfig = {
		label: 'Especifique forma de pago',
		options: [
			{
				value: 'TRANSFERENCIA',
				viewValue: 'TRANSFERENCIA'
			},
			// {
			// 	value: 'CHEQUE',
			// 	viewValue: 'CHEQUE'
			// }
		]
	};

	tipoReclamo: FieldConfig = {
		label: 'Tipo Reclamo',
		options: [
			{
				value: 'LOCAL',
				viewValue: 'Local'
			},
			{
				value: 'INTERNACIONAL',
				viewValue: 'Internacional'
			}
		]
	};

	tipoReclamoLocal: FieldConfig = {
		label: 'Moneda',
		options: [
			{
				value: 'PESOS',
				viewValue: 'Pesos'
			},
			{
				value: 'DOLARES',
				viewValue: 'Dólares'
			}
		]
	};
	tipoMonedaLocalInfo: FieldConfig = {
		label: 'Moneda',
		options: [
			{
				value: 'PESOS',
				viewValue: 'Pesos'
			}
		]
	};

	tipoMoneda: FieldConfig = {
		label: 'Moneda',
		options: [
			{
				value: 'DOLARES',
				viewValue: 'Dolares'
			},
			{
				value: 'PESOS',
				viewValue: 'Pesos'
			}
		]
	};

	tipoReclamoInternacional: FieldConfig = {
		label: 'Moneda',
		options: [
			{
				value: 'DOLARES',
				viewValue: 'Dolares'
			}
		]
	};

	dataAutoCompleteIdNumber = [];
	dataAutoCompleteIdNumberObject = [];
	dataAutoCompleteName = [];
	dataAutoCompletePolicy = [];



	filteredOptions: Observable<any[]>;
	filteredOptionsProveedor = [];
	filteredOptionsBanks: Observable<any[]>;
	cuentaTipos: FieldConfig = {
		label: 'Tipo de Cuenta',
		options: [
			{
				value: 'AHORROS',
				viewValue: 'AHORROS'
			},
			{
				value: 'CORRIENTE',
				viewValue: 'CORRIENTE'
			}
		]
	};

	filterOptions: FieldConfig = {
		label: 'Filtro',
		options: [
			{
				value: 'NOMBRE',
				viewValue: 'Nombre'
			},
			{
				value: 'ID',
				viewValue: 'ID'
			},
			{
				value: 'POLIZA',
				viewValue: 'No. de Póliza'
			}
		]
	};

	Otrosproveedores = [];

	OtrosproveedoresField = {
		label: 'Proveedor',
		options: this.Otrosproveedores
	};

	Centros = [];

	CentrosField = {
		label: 'Proveedor',
		options: this.Centros
	};

	farmacias = [];

	farmaciasField = {
		label: 'Proveedor',
		options: this.farmacias
	};

	clinicas = [];

	clinicasField = {
		label: 'Proveedor',
		options: this.clinicas
	};

	labs = [];

	labsField = {
		label: 'Proveedor',
		options: this.labs
	};

	medicos = [];

	medicosField = {
		label: 'Proveedor',
		options: this.medicos
	};

	categorias = [];

	categoriasField = {
		label: 'Categoria',
		options: this.categorias
	};

	banks = [];

	banksField = {
		label: 'Banco Emisor',
		options: this.banks
	};

	filterValueArray = [];
	categoriaSubscribe: any = [];

	idNumber2FieldVisible = false;
	searchIdNumberAccess = false;

	idNumber2Options = [];

	// idNumber2Label = 'Asegurados poliza ';

	idNumber2Field = {
		label: 'Asegurados misma póliza',
		options: this.idNumber2Options
	};

	refundForm: FormGroup;
	diagnosticList: FormArray;
	@ViewChild('form', { static: false }) form;

	constructor(
		private fb: FormBuilder,
		public formHandler: FormHandlerService,
		private refund: RefundService,
		public dialogModal: DialogService,
		private dialogOption: DialogOptionService,
		public dialog: MatDialog,
		private appComponent: AppComponent,
		private userService: UserService,
		private route: ActivatedRoute,
		private cd: ChangeDetectorRef,
		private claimsService: ClaimsService,
		public requestService: RequestsService,
		private dataMappingFromApi: FormDataFillingService,
    private countryRolesService: CountryRolesService
	) { }

	ID = null;

	timeAutoComplete = 0;

	ngOnInit() {
		console.log('El largo de this.idNumber2Options es ' + this.idNumber2Options.length);
		setTimeout(() => {
			this.appComponent.showOverlay = true;
		  });
		this.returnCategorias();
		// this.returnProveedores();
		this.returnBanks();
		this.returnAutoCompleteData();
		// setTimeout(() => {
		// 	this.appComponent.showOverlay = true;
		// });
		// setTimeout(() => {

		// 	this.route.params.subscribe(res => {
		// 		this.ID = res.id;
		// 	});

		// 	if (this.ID != null) {
		// 		console.log('El ID es ' + this.ID);
		// 		this.getData(this.ID);
		// 	} else if (this.ID == null) {
		// 		console.log('ID esta vacio');
		// 	}

		// 	console.log(this.ID);

		// 	this.refundForm = this.fb.group({
		// 		fecha: [new Date(), Validators.required],
		// 		informacion: this.fb.group({
		// 			noPoliza: [{ value: '', disabled: true }, [Validators.required]],
		// 			idNumber: ['', Validators.required],
		// 			nombre: [{ value: '', disabled: true }, [Validators.required]],
		// 			direccion: ['', Validators.required],
		// 			telefono: ['', Validators.required],
		// 			correo: ['', [Validators.required, Validators.email]],
		// 		}),
		// 		diagnosticos: this.fb.array([this.createDiagnostic()]),
		// 		haveAditionalComentary: [''],
		// 		comentary: [''],
		// 		forma: ['', Validators.required],
		// 		totalAmount: ['', Validators.required],
		// 		agreeWithDeclaration: ['', [Validators.required, Validators.requiredTrue]],
		// 		isComplete: [false, Validators.required],
		// 		areDiagnosticDatesValid: [true, Validators.required],
		// 	});

		// 	this.diagnosticList = this.refundForm.get('diagnosticos') as FormArray;

		// 	this.refundForm.get('diagnosticos').valueChanges.subscribe(value => {
		// 		this.validDatesCounter = 0;
		// 		let total = 0;

		// 		for (const element in value) {
		// 			if (value.hasOwnProperty(element)) {
		// 				total += this.refundForm.get('diagnosticos').get(element.toString()).value.monto;

		// 				if (this.calculatedDate(this.refundForm.get('diagnosticos').get(element.toString()).value.fecha) >= 6) {
		// 					this.receiveDateValidator(false);

		// 				} else {
		// 					this.receiveDateValidator(true);

		// 				}
		// 			}
		// 		}
		// 		this.refundForm.get('totalAmount').setValue(total);
		// 		this.totalAmount = total;
		// 	});

		// 	this.filteredOptions = this.refundForm.get('informacion').get('idNumber').valueChanges
		// 		.pipe(
		// 			startWith(''),
		// 			map(value => typeof value === 'string' ? value : value),
		// 			map(value => value ? this._filter(value) : this.dataAutoCompleteIdNumber.slice())
		// 		);

		// 	this.timeAutoComplete = 1;
		// 	this.appComponent.showOverlay = false;

		// }, 15000);
		this.route.params.subscribe(res => {
			this.ID = res.id;
		});

		if (this.ID != null) {
			console.log('El ID es ' + this.ID);
			this.getData(this.ID);
		} else if (this.ID == null) {
			console.log('ID esta vacio');
		}

		console.log(this.ID);

		this.refundForm = this.fb.group({
			fecha: [new Date(), Validators.required],
			informacion: this.fb.group({
				tipoReclamo: ['', Validators.required],
				noPoliza: [{ value: '', disabled: true }, [Validators.required]],
				filterType: ['', Validators.required],
				idNumber: ['', Validators.required],
				idNumber2: [''],
				nombre: [{ value: '', disabled: true }, [Validators.required]],
				direccion: ['',],
				telefono: ['',],
				correo: ['', [Validators.required, Validators.email]],
			}),
			diagnosticos: this.fb.array([this.createDiagnostic()]),
			haveAditionalComentary: [''],
			comentary: [''],
			forma: ['', Validators.required],
			idNumber: [{ value: '', disabled: true }, Validators.required],
			totalAmount: ['', Validators.required],
			totalAmountPesos: ['', Validators.required],
			agreeWithDeclaration: ['', [Validators.requiredTrue]],
			isComplete: [false, Validators.required],
			areDiagnosticDatesValid: [true, Validators.required],
		});

		this.diagnosticList = this.refundForm.get('diagnosticos') as FormArray;

		console.log('diagnosticos', this.refundForm.get('diagnosticos').value);

		this.refundForm.get('haveAditionalComentary').valueChanges.subscribe((valueAditional) => {
			if (valueAditional == '' || valueAditional == false) {
				this.refundForm.get('comentary').setValue('');
			}
		});

		if (!this.ID) {
			this.refundForm.get('diagnosticos').valueChanges.subscribe((value) => {
				this.validDatesCounter = 0;
				let total = 0;
				let totalPesos = 0;


				for (const element in value) {
					if (value.hasOwnProperty(element)) {
						console.log(this.refundForm.get('diagnosticos').get(element.toString()));
						if (this.refundForm.get('diagnosticos').get(element.toString()).get('tipoReclamoMoneda')) {
							if (this.refundForm.get('diagnosticos').get(element.toString()).get(
								'tipoReclamoMoneda').value != null) {
								if (this.refundForm.get('diagnosticos').get(element.toString()).get(
									'tipoReclamoMoneda').value === 'DOLARES') {
									console.log('total', this.refundForm.get('diagnosticos').get(element.toString()).value.monto);
									total += this.refundForm.get('diagnosticos').get(element.toString()).value.monto;
								}
								if (this.refundForm.get('diagnosticos').get(element.toString()).get(
									'tipoReclamoMoneda').value === 'PESOS') {
									totalPesos += this.refundForm.get('diagnosticos').get(element.toString()).value.monto;
								}
							}
						}

						if (this.calculatedDate(this.refundForm.get('diagnosticos').get(element.toString()).value.fecha) >= 6) {
							this.receiveDateValidator(false);

						} else {
							this.receiveDateValidator(true);

						}
					}
				}
				this.refundForm.get('totalAmount').setValue(total);
				this.totalAmount = total;
				this.refundForm.get('totalAmountPesos').setValue(totalPesos);
				this.totalAmountPesos = totalPesos;
			});
		}

		this.refundForm.get('informacion').get('filterType').valueChanges.subscribe(valueFilter => {

			this.refundForm.get('informacion').get('idNumber').setValue('');
			this.refundForm.get('informacion').get('idNumber').markAsUntouched();

			this.idNumber2FieldVisible = false;
			this.searchIdNumberAccess = false;
			this.idNumber2Options.splice(0, this.idNumber2Options.length);
			this.refundForm.get('informacion').get('idNumber2').setValue('');
			this.refundForm.get('informacion').get('idNumber2').markAsUntouched();

			if (valueFilter == 'NOMBRE') {
				this.filteredOptions = this.refundForm.get('informacion').get('idNumber').valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value),
						map(value => value ? this._filter(value) : this.dataAutoCompleteName.slice())
					);
			}
			if (valueFilter == 'ID') {
				this.filteredOptions = this.refundForm.get('informacion').get('idNumber').valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value),
						map(value => value ? this._filter(value) : this.dataAutoCompleteIdNumber.slice())
					);
			}
			if (valueFilter == 'POLIZA') {
				this.filteredOptions = this.refundForm.get('informacion').get('idNumber').valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value),
						map(value => value ? this._filter(value) : this.dataAutoCompletePolicy.slice())
					);
			}
		});

		this.refundForm.get('informacion').get('idNumber').valueChanges.subscribe(valueIdNumber => {

			if (this.idNumber2Options.length > 0) {
				if (this.idNumber2Options[0].policy) {
					if (this.idNumber2Options[0].policy != valueIdNumber) {

						this.idNumber2FieldVisible = false;
						this.searchIdNumberAccess = false;
						this.idNumber2Options.splice(0, this.idNumber2Options.length);
						this.refundForm.get('informacion').get('idNumber2').setValue('');
						this.refundForm.get('informacion').get('idNumber2').markAsUntouched();
					}
				}
			}
		});

		this.manageFilters(0);

		// tslint:disable-next-line: prefer-for-of
		// for (let x = 0; x < this.diagnosticList.length; x++) {

		// 	this.refundForm.get('diagnosticos').get(x.toString()).get('categoria').valueChanges.subscribe(valueFilter => {

		// 		this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').setValue('');
		// 		this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').markAsUntouched();

		// 		if (valueFilter == 'OTROS_PROVEEDORES') {
		// 			this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
		// 				.pipe(
		// 					startWith(''),
		// 					map(value => typeof value === 'string' ? value : value),
		// 					map(value => value ? this._filterProveedores(value) : this.Otrosproveedores.slice())
		// 				);
		// 		}
		// 		if (valueFilter == 'CENTROS_ESPECIALIZADOS') {
		// 			this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
		// 				.pipe(
		// 					startWith(''),
		// 					map(value => typeof value === 'string' ? value : value),
		// 					map(value => value ? this._filterProveedores(value) : this.Centros.slice())
		// 				);
		// 		}
		// 		if (valueFilter == 'FARMACIAS') {
		// 			this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
		// 				.pipe(
		// 					startWith(''),
		// 					map(value => typeof value === 'string' ? value : value),
		// 					map(value => value ? this._filterProveedores(value) : this.farmacias.slice())
		// 				);
		// 		}
		// 		if (valueFilter == 'CLINICAS_HOSPITALES') {
		// 			this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
		// 				.pipe(
		// 					startWith(''),
		// 					map(value => typeof value === 'string' ? value : value),
		// 					map(value => value ? this._filterProveedores(value) : this.clinicas.slice())
		// 				);
		// 		}
		// 		if (valueFilter == 'LABORATORIOS') {
		// 			this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
		// 				.pipe(
		// 					startWith(''),
		// 					map(value => typeof value === 'string' ? value : value),
		// 					map(value => value ? this._filterProveedores(value) : this.labs.slice())
		// 				);
		// 		}
		// 		if (valueFilter == 'MEDICOS') {
		// 			this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
		// 				.pipe(
		// 					startWith(''),
		// 					map(value => typeof value === 'string' ? value : value),
		// 					map(value => value ? this._filterProveedores(value) : this.medicos.slice())
		// 				);
		// 		}
		// 		console.log(this.filteredOptionsProveedor);
		// 	});
		// }

		this.refundForm.get('informacion').get('tipoReclamo').valueChanges.subscribe(valueReclamo => {

			if (valueReclamo == 'INTERNACIONAL') {
				for (let x = 0; x < this.diagnosticList.length; x++) {
					// setTimeout(() => {
					this.refundForm.get('diagnosticos').get(x.toString()).get('tipoReclamoMoneda').setValue('DOLARES');
					this.refundForm.get('diagnosticos').get(x.toString()).get('categoria').setValue('INTERNACIONAL');
					this.refundForm.get('diagnosticos').get(x.toString()).get('categoria').disable();
					// this.categoriaSubscribe[x].unsubscribe();
					// }, 1000);
				}
				if (this.refundForm.get('infoTransferencia')) {
					(this.refundForm.get('infoTransferencia') as FormGroup).addControl('instruccion', this.fb.control('', Validators.required));
					(this.refundForm.get('infoTransferencia') as FormGroup).addControl('tipoMoneda', this.fb.control('', Validators.required));
					this.refundForm.get('infoTransferencia').get('tipoMoneda').setValue('');
					// if (!this.refundForm.get('infoTransferencia').get('instruccion').valid) {
					// 	this.refundForm.get('infoTransferencia').get('instruccion').markAsTouched();
					// 	this.refundForm.get('infoTransferencia').get('instruccion').updateValueAndValidity();
					// }
				}

			}
			else {
				for (let x = 0; x < this.diagnosticList.length; x++) {
					this.refundForm.get('diagnosticos').get(x.toString()).get('tipoReclamoMoneda').setValue('');
					setTimeout(() => {
						// this.refundForm.get('diagnosticos').get(x.toString()).get('categoria').setValue('');
						this.refundForm.get('diagnosticos').get(x.toString()).get('categoria').enable();
						this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').setValue('');
						this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').markAsUntouched();
					}, 500);
					// this.manageFilters(x);
				}
				if (this.refundForm.get('infoTransferencia')) {
					(this.refundForm.get('infoTransferencia') as FormGroup).removeControl('instruccion');
					(this.refundForm.get('infoTransferencia') as FormGroup).addControl('tipoMoneda', this.fb.control('', Validators.required));
					this.refundForm.get('infoTransferencia').get('tipoMoneda').setValue('');
				}
			}
		});

		// if (this.refundForm.get('infoTransferencia')) {
		// 	this.filteredOptionsBanks = this.refundForm.get('infoTransferencia').get('bancoEmisor').valueChanges
		// 		.pipe(
		// 			startWith(''),
		// 			map(value => typeof value === 'string' ? value : value),
		// 			map(value => value ? this._filterBanks(value) : this.banks.slice())
		// 		);
		// }

		console.log('El json de todo el formulario: ', JSON.stringify(this.refundForm.value));
		
	}
	// role;
	// idd;
	// getRefunds(params: HttpParams = new HttpParams()) {
	// 	let data;
	// 	this.claimsService.getRefunds(params)
	// 		.subscribe(res => {
	// 			data = res;
	// 			console.log(data);
	// 			console.log(data.data[0].id);
	// 			this.idd = data.data[0].id;
	// 		});
	// 	this.role = this.userService.getRoleCotizador();
	// 	}

	manageFilters(index) {
		// for (let x = 0; x < this.diagnosticList.length; x++) {

		this.categoriaSubscribe[index] = this.refundForm.get('diagnosticos').get(index.toString()).get('categoria').valueChanges.subscribe(valueFilter => {

			if (this.refundForm.get('diagnosticos').get(index.toString())) {
				this.refundForm.get('diagnosticos').get(index.toString()).get('proveedor').setValue('');
				this.refundForm.get('diagnosticos').get(index.toString()).get('proveedor').markAsUntouched();

				if (valueFilter == 'OTROS_PROVEEDORES') {
					this.filteredOptionsProveedor[index] = this.refundForm.get('diagnosticos').get(index.toString()).get('proveedor').valueChanges
						.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value),
							map(value => value ? this._filterProveedores(index, value) : this.Otrosproveedores.slice())
						);
				}
				if (valueFilter == 'CENTROS_ESPECIALIZADOS') {
					this.filteredOptionsProveedor[index] = this.refundForm.get('diagnosticos').get(index.toString()).get('proveedor').valueChanges
						.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value),
							map(value => value ? this._filterProveedores(index, value) : this.Centros.slice())
						);
				}
				if (valueFilter == 'FARMACIAS') {
					this.filteredOptionsProveedor[index] = this.refundForm.get('diagnosticos').get(index.toString()).get('proveedor').valueChanges
						.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value),
							map(value => value ? this._filterProveedores(index, value) : this.farmacias.slice())
						);
				}
				if (valueFilter == 'CLINICAS_HOSPITALES') {
					this.filteredOptionsProveedor[index] = this.refundForm.get('diagnosticos').get(index.toString()).get('proveedor').valueChanges
						.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value),
							map(value => value ? this._filterProveedores(index, value) : this.clinicas.slice())
						);
				}
				if (valueFilter == 'LABORATORIOS') {
					this.filteredOptionsProveedor[index] = this.refundForm.get('diagnosticos').get(index.toString()).get('proveedor').valueChanges
						.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value),
							map(value => value ? this._filterProveedores(index, value) : this.labs.slice())
						);
				}
				if (valueFilter == 'MEDICOS') {
					this.filteredOptionsProveedor[index] = this.refundForm.get('diagnosticos').get(index.toString()).get('proveedor').valueChanges
						.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value),
							map(value => value ? this._filterProveedores(index, value) : this.medicos.slice())
						);
				}
			}
			console.log(this.filteredOptionsProveedor);
		});
		// }
	}

	showWarningDot(form: any): boolean {
		if (!this.ID) {
			if (form === this.refundForm.get('forma') && this.refundForm.get('infoTransferencia')) {
				if (!this.refundForm.get('infoTransferencia').valid && this.form.submitted) {
					return true;
				} else {
					return false;
				}
			} else {
				if (form.invalid && this.form.submitted) {
					return true;
				} else {
					return false;
				}
			}
		} else {
			if (form === this.refundForm.get('forma') && this.refundForm.get('infoTransferencia')) {
				if (!this.refundForm.get('infoTransferencia').valid) {
					return true;
				} else {
					return false;
				}
			} else {
				if (form.invalid) {
					return true;
				} else {
					return false;
				}
			}
		}
	}

	displayFn(user: any) {
		return user ? user : '';
	}

	setStep(index: number) {
		this.step = index;
	}

	nextStep() {
		this.step++;

	}

	private _filter(value): any[] {
		// let n: Number;

		// n.toString
		// let arrayValue;

		if (this.refundForm.get('informacion').get('filterType').value == 'NOMBRE') {
			const filterValue = value.toLowerCase();

			return this.dataAutoCompleteName.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
		}
		if (this.refundForm.get('informacion').get('filterType').value == 'ID') {
			const filterValueNumber = value.toString();

			return this.dataAutoCompleteIdNumber.filter(option => option.toString().indexOf(filterValueNumber) === 0);
		}
		if (this.refundForm.get('informacion').get('filterType').value == 'POLIZA') {
			const filterValue = value.toLowerCase();

			return this.dataAutoCompletePolicy.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
		}
		// return arrayValue;
	}

	private _filterProveedores(index, value?): any[] {

		if (this.refundForm.get('diagnosticos').get(index.toString())) {
			// tslint:disable-next-line: prefer-for-of
			// for (let x = 0; x < this.diagnosticList.length; x++) {
			if (this.refundForm.get('diagnosticos').get(index.toString()).get('categoria').value == 'OTROS_PROVEEDORES') {
				// let filterValue: any[];
				this.filterValueArray[index] = value.toLowerCase();
				return this.Otrosproveedores.filter(option => option.toLowerCase().indexOf(this.filterValueArray[index]) === 0);
			}
			if (this.refundForm.get('diagnosticos').get(index.toString()).get('categoria').value == 'CENTROS_ESPECIALIZADOS') {
				// let filterValue: any[];
				this.filterValueArray[index] = value.toLowerCase();
				return this.Centros.filter(option => option.toLowerCase().indexOf(this.filterValueArray[index]) === 0);
			}
			if (this.refundForm.get('diagnosticos').get(index.toString()).get('categoria').value == 'FARMACIAS') {
				// let filterValue: any[];
				this.filterValueArray[index] = value.toLowerCase();
				return this.farmacias.filter(option => option.toLowerCase().indexOf(this.filterValueArray[index]) === 0);
			}
			if (this.refundForm.get('diagnosticos').get(index.toString()).get('categoria').value == 'CLINICAS_HOSPITALES') {
				// let filterValue: any[];
				this.filterValueArray[index] = value.toLowerCase();
				return this.clinicas.filter(option => option.toLowerCase().indexOf(this.filterValueArray[index]) === 0);
			}
			if (this.refundForm.get('diagnosticos').get(index.toString()).get('categoria').value == 'LABORATORIOS') {
				// let filterValue: any[];
				this.filterValueArray[index] = value.toLowerCase();
				return this.labs.filter(option => option.toLowerCase().indexOf(this.filterValueArray[index]) === 0);
			}
			if (this.refundForm.get('diagnosticos').get(index.toString()).get('categoria').value == 'MEDICOS') {
				// let filterValue: any[];
				this.filterValueArray[index] = value.toLowerCase();
				return this.medicos.filter(option => option.toLowerCase().indexOf(this.filterValueArray[index]) === 0);
			}
			// }
		}
	}

	private _filterBanks(value): any[] {


		// if (this.refundForm.get('informacion').get('filterType').value == 'NOMBRE') {
		// 	const filterValue = value.toLowerCase();

		// 	return this.dataAutoCompleteName.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
		// }
		const filterValue = value.toLowerCase();

		return this.banks.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
	}

	//   consoleMethod(nameOption){
	// 	// console.log("El valor de name es " + nameOption);
	// 	// console.log("El value de idNumber es " + this.refundForm.get('informacion').get('idNumber').value);
	// 	// console.log("El json de todo el formulario: ", JSON.stringify(this.refundForm.value) );
	// 	console.log('El tipo de dato de ' +
	// 	// tslint:disable-next-line: radix
	// 	Number.parseInt((nameOption).slice((nameOption).indexOf(' - ') + 3)) + ' es: ' +
	// 	// tslint:disable-next-line: radix
	// 	(typeof Number.parseInt((nameOption).slice((nameOption).indexOf(' - ') + 3)) ) );
	//   }

	returnCategorias() {
		this.refund.getCategoriasDatosProveedores().subscribe(data => {
			console.log(data.data);

			// tslint:disable-next-line: prefer-for-of
			for (let x = 0; x < data.data.length; x++) {
				this.categorias.push({
					value: data.data[x].categoria,
					viewValue: data.data[x].categoria,
				});

				// tslint:disable-next-line: prefer-for-of
				for (let y = 0; y < data.data[x].categoryList.length; y++) {
					if (data.data[x].categoria == 'OTROS_PROVEEDORES') {
						this.Otrosproveedores.push(
							// {
							// value: data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono,
							// viewValue: data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono
							// }
							data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono
						);
					}
					else if (data.data[x].categoria == 'CENTROS_ESPECIALIZADOS') {
						this.Centros.push(
							// {
							// value: data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono,
							// viewValue: data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono
							// }
							data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono
						);
					}
					else if (data.data[x].categoria == 'FARMACIAS') {
						this.farmacias.push(
							// {
							// value: data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono,
							// viewValue: data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono
							// }
							data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono
						);
					}
					else if (data.data[x].categoria == 'CLINICAS_HOSPITALES') {
						this.clinicas.push(
							// {
							// value: data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono,
							// viewValue: data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono
							// }
							data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono
						);
					}
					else if (data.data[x].categoria == 'LABORATORIOS') {
						this.labs.push(
							// {
							// value: data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono,
							// viewValue: data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono
							// }
							data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono
						);
					}
					else if (data.data[x].categoria == 'MEDICOS') {
						this.medicos.push(
							// {
							// value: data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono,
							// viewValue: data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono
							// }
							data.data[x].categoryList[y].nombre + ' - ' + data.data[x].categoryList[y].telefono
						);
					}
					// this.proveedores.find()
				}
			}
			console.log(this.OtrosproveedoresField);
			console.log(this.CentrosField);
			console.log(this.farmaciasField);
			console.log(this.clinicasField);
			console.log(this.labsField);
			console.log(this.medicosField);
		});
	}

	// returnProveedores() {
	// 	this.refund.getProveedores().subscribe(data => {
	// 		console.log(data.data);


	// 		// tslint:disable-next-line: prefer-for-of
	// 		for (let x = 0; x < data.data.length; x++) {
	// 			this.Otrosproveedores.push({
	// 				value: data.data[x].nombre,
	// 				viewValue: data.data[x].nombre,
	// 			});
	// 		}
	// 	});
	// }

	returnBanks() {
		this.refund.getBanks().subscribe(data => {
			console.log(data);


			// tslint:disable-next-line: prefer-for-of
			for (let x = 0; x < data.data.length; x++) {
				// this.banks.push({
				// 	value: data.data[x].descripcion,
				// 	viewValue: data.data[x].descripcion,
				// });
				this.banks.push(data.data[x].descripcion);
			}
		});
	}

	returnAutoCompleteData() {

		this.refund.getIdNumbers().subscribe(data => {
			console.log(data.data);
			// tslint:disable-next-line: prefer-for-of
			for (let x = 0; x < data.data.length; x++) {
				// this.dataAutoCompleteIdNumber.push(data.data[x].asegurado.nombres_asegurado +
				// 	' ' + data.data[x].asegurado.apellidos_asegurado + ' - '
				// 	+ data.data[x].asegurado.id_asegurado);

				this.dataAutoCompleteIdNumberObject.push({
					name: data.data[x].asegurado.nombres_asegurado + ' ' + data.data[x].asegurado.apellidos_asegurado,
					// id: data.data[x].asegurado.id_asegurado,
					policy: data.data[x].asegurado.no_poliza,
					value: data.data[x].asegurado.id_asegurado
				});
				this.dataAutoCompleteName.push(data.data[x].asegurado.nombres_asegurado + ' ' + data.data[x].asegurado.apellidos_asegurado);

				this.dataAutoCompleteIdNumber.push(data.data[x].asegurado.id_asegurado);

				this.dataAutoCompletePolicy.push(data.data[x].asegurado.no_poliza);

				//NO BORRAR, estas lineas de código son para eliminar las posiciones repetidas.
				this.dataAutoCompletePolicy = this.dataAutoCompletePolicy.reduce((unique, o) => {
					if(!unique.some(obj => obj === o)) {
					  unique.push(o);
					}
					return unique;
				  },[]);
			}
			this.timeAutoComplete = 1;
			this.appComponent.showOverlay = false;
		});
	}

	onFileChange(event, formName, index, idx) {
		const reader = new FileReader();

		if (event.target.files && event.target.files.length) {
			const [file] = event.target.files;
			reader.readAsDataURL(file);

			reader.onload = () => {
				this.refundForm.get('diagnosticos').get(index.toString()).get('files').get(formName).get(idx.toString()).patchValue({
					[formName]: reader.result
				});

				// need to run CD since file load runs outside of zone
				this.cd.markForCheck();
			};
		}
	}

	fileNameWatcher(type?: string, index?: number, index2?: number) {
		if (this.filesInformation[index]) {
			if (this.filesInformation[index].files[type][index2]) {
				if (this.filesInformation[index].files[type][index2][type + 'Url'] && this.refundForm.get('diagnosticos').get(index.toString()).get('files').get(type).get(index2.toString()).get(type).value !== '') {
					return this.filesInformation[index].files[type][index2][type + 'Url'];
				}
			}
		}
	}

	clearArchives(formName, index) {
		this.refundForm.get('diagnosticos').get(index.toString()).get('files').get(formName).setValue('');
	}

	calculatedDate(value: any) {
		const date = this.todayDate.getTime() - value;
		return Math.floor(date / (1000 * 3600 * 24) / 30.4375);
	}

	receiveDateValidator(value: any) {
		const testing = [];

		testing.push(value);

		for (const key in testing) {
			if (testing.hasOwnProperty(key)) {
				if (testing[key] === false) {
					this.validDatesCounter++;
				}
			}
		}

		if (this.validDatesCounter > 0) { this.refundForm.get('areDiagnosticDatesValid').setValue(false); } else { this.refundForm.get('areDiagnosticDatesValid').setValue(true); }

	}

	changePayment(event) {
		if (event.value === 'CHEQUE') {
			this.refundForm.removeControl('infoTransferencia');
			// this.filteredOptionsBanks.unsubscribe();
		} else if (event.value === 'TRANSFERENCIA') {
			this.refundForm.addControl(
				'infoTransferencia',
				this.fb.group({
					noCuenta: ['', [Validators.required, this.accountNumberValidator()]],
					tipoCuenta: ['', Validators.required],
					bancoEmisor: ['', [Validators.required, this.bankValidator()]],
					// tipoMoneda: ['', Validators.required]
				})
			);

			if (this.refundForm.get('infoTransferencia') &&
				this.refundForm.get('informacion').get('tipoReclamo').value == 'INTERNACIONAL' &&
				!this.refundForm.get('infoTransferencia').get('instruccion')) {
				(this.refundForm.get('infoTransferencia') as FormGroup).addControl('instruccion', this.fb.control('', Validators.required));
				// if (!this.refundForm.get('infoTransferencia').get('instruccion').valid) {
				// 	this.refundForm.get('infoTransferencia').get('instruccion').markAsTouched();
				// 	this.refundForm.get('infoTransferencia').get('instruccion').updateValueAndValidity();
				// }
			}

			if (this.refundForm.get('infoTransferencia') &&
				(this.refundForm.get('informacion').get('tipoReclamo').value == 'INTERNACIONAL' ||
					this.refundForm.get('informacion').get('tipoReclamo').value == 'LOCAL') &&
				!this.refundForm.get('infoTransferencia').get('tipoMoneda')) {
				(this.refundForm.get('infoTransferencia') as FormGroup).addControl('tipoMoneda', this.fb.control('', Validators.required));
				this.refundForm.get('infoTransferencia').get('tipoMoneda').setValue('');
			}

			this.filteredOptionsBanks = this.refundForm.get('infoTransferencia').get('bancoEmisor').valueChanges
				.pipe(
					startWith(''),
					map(value => typeof value === 'string' ? value : value),
					map(value => value ? this._filterBanks(value) : this.banks.slice())
				);
		}
	}

	createInfo(): FormGroup {
		return this.fb.group({
			// cedula: ['', Validators.required],
			noCuenta: ['', [Validators.required, this.accountNumberValidator()]],
			tipoCuenta: ['', Validators.required],
			bancoEmisor: ['', [Validators.required, this.bankValidator()]],
			// tipoMoneda: ['', Validators.required],
			// correo: ['', Validators.required]
		});
	}

	bankValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
		  // Get the input value
		  const inputValue: string = control.value;

		  // Check your validation condition here
		  if (!this.banks.includes(inputValue)) {
			return { 'customValidation': { value: ''} };
		  }
	  
		  // Return null if validation passes
		  return null;
		};
	}

	accountNumberValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
		  if(control.value == null && control.touched) {
			return { 'customValidation': { value: control.value } };
		  }
		  // Get the input value
		  const inputValue: string = control.value.toString();

		  // Check your validation condition here
		  if (inputValue.length < 6) { 
			return { 'customValidation': { value: control.value } };
		  }
	  
		  // Return null if validation passes
		  return null;
		};
	}

	createDiagnostic(): FormGroup {
		return this.fb.group({
			fecha: ['', Validators.required],
			lugar: ['', Validators.required],
			diagnostico: ['', Validators.required],
			tipoReclamoMoneda: ['', Validators.required],
			descripcion: ['', Validators.required],
			monto: ['', Validators.required],
			categoria: ['', Validators.required],
			proveedor: ['', Validators.required],
			files: this.fb.group({
				invoices: this.fb.array([this.createFormArray('invoices')]),
				indications: this.fb.array([this.createFormArray('indications')]),
				medicReports: this.fb.array([this.createFormArray('medicReports')]),
				paymentVouchers: this.fb.array([this.createFormArray('paymentVouchers')]),
				otros: this.fb.array([this.createFormArray('otros')]),
			})
		});
	}

	atLeastOneInvoiceAttached(control: AbstractControl): ValidationErrors | null {
		const formGroup = control as FormGroup;

		// Check if any FormArray has at least one valid FormGroup
		const isAnyArrayValid = Object.keys(formGroup.controls).some(key => {
			if (key != 'id' && key == 'invoices') {
				const formArray = formGroup.get(key) as FormArray;
				return formArray.value[0][key].length > 0;
			}
			return false;
		});

		return isAnyArrayValid ? null : { noArrayValid: true };
	}

	addDiagnostic() {
		console.log('diagnosticos: ', this.refundForm.get('diagnosticos').value);
		this.diagnosticList.push(this.createDiagnostic());
		this.manageFilters(this.diagnosticList.length - 1);
		this.filterValueArray.push();

		// this.refundForm.get('informacion').get('tipoReclamo').valueChanges.subscribe( valueReclamo => {

		if (this.refundForm.get('informacion').get('tipoReclamo').value == 'INTERNACIONAL') {
			// for (let x = 0; x < this.diagnosticList.length; x++) {
			// setTimeout(() => {
			this.refundForm.get('diagnosticos').get((this.diagnosticList.length - 1).toString()
			).get('tipoReclamoMoneda').setValue('DOLARES');
			this.refundForm.get('diagnosticos').get((this.diagnosticList.length - 1).toString()).get('categoria').setValue('INTERNACIONAL');
			this.refundForm.get('diagnosticos').get((this.diagnosticList.length - 1).toString()).get('categoria').disable();
			// this.categoriaSubscribe[(this.diagnosticList.length - 1)].unsubscribe();
			// }, 2000);
			// }
		}
		// });
	}

	createFormArray(type: string): any {
		switch (type) {
			case 'invoices':
				return this.fb.group({
					invoices: ['',Validators.required],
				});

			case 'indications':
				return this.fb.group({
					indications: [''],
				});

			case 'medicReports':
				return this.fb.group({
					medicReports: [''],
				});

			case 'paymentVouchers':
				return this.fb.group({
					paymentVouchers: [''],
				});

			case 'otros':
				return this.fb.group({
					otros: [''],
				});

			default:
				break;
		}
	}

	addToList(list: any, type: string) {
		console.log('list: ', list);
		console.log('ADD LIST');
		list.push(this.createFormArray(type));
	}

	removeToList(index, list: any) {
		list.removeAt(index);
	}

	returnAsFormArray(formArray: any) {
		return formArray as FormArray;

	}

	removeDiagnostic(index) {

		let valuePrueba = [];
		let valuePrueba2 = [];

		for (let x = 0; x < this.diagnosticList.length; x++) {
			valuePrueba.push(this.refundForm.get('diagnosticos').get((x).toString()).get('categoria').value);
			valuePrueba2.push(this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor').value);
		}
		valuePrueba.splice(index, 1);
		valuePrueba2.splice(index, 1);
		console.log(valuePrueba);
		console.log(valuePrueba2);

		let y = 0;
		if (this.refundForm.get('diagnosticos').get((index + 1).toString())) {

			for (let x = index; x < this.diagnosticList.length; x++) {

				// if (this.refundForm.get('diagnosticos').get((x + 1).toString())) {

				if (y == 0) {
					this.filteredOptionsProveedor.splice(index, 1);
					this.filterValueArray.splice(index, 1);
					this.categoriaSubscribe[index].unsubscribe();
					this.categoriaSubscribe.splice(index, 1);
					this.diagnosticList.removeAt(index);
					y++;
				}
				this.filteredOptionsProveedor.splice(x, 1);
				this.filterValueArray.splice(x, 1);
				this.categoriaSubscribe[x].unsubscribe();
				this.manageFilters(x);
				// this.refundForm.get('diagnosticos').get((x).toString()).get('categoria').setValue('');
				this.refundForm.get('diagnosticos').get((x).toString()).get('categoria').setValue(valuePrueba[x].toUpperCase());
				this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor').setValue('');
				// this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor').updateValueAndValidity();
				this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor').setValue(valuePrueba2[x].toUpperCase());

				setTimeout(() => {
					this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor'
					).setValue(valuePrueba2[x].toUpperCase() + ' ');
					console.log('yaaaaaaaaaaaaaa proveedor ' + x + ' eliminar');
				},
					500);

				setTimeout(() => {
					this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor'
					).setValue(valuePrueba2[x].toUpperCase());
					console.log('yaaaaaaaaaaaaaa proveedor ' + x + ' eliminar, parte 2');
				},
					500);

				this.refundForm.get('diagnosticos').updateValueAndValidity();

				// }
			}
		}
		else {
			this.diagnosticList.removeAt(index);
		}
	}

	canDeactivate(): Observable<boolean> | boolean {
		if (this.form.submitted) {
			return true;
		}

		if (this.refundForm.dirty && !this.form.submitted) {
			const dialogRef = this.dialog.open(BaseDialogComponent, {
				data: this.dialogOption.exitConfirm,
				minWidth: 385,
			});
			return dialogRef.componentInstance.dialogRef.afterClosed().pipe(map(result => {
				if (result === 'true') {
					return true;
				}
			}), first());
		}
		return true;
	}

	searchIdNumber(idNumber: string) {

		let idNumberObject;

		if (idNumber != '' && idNumber != null && idNumber != undefined) {
			console.log(idNumber);
			if (this.refundForm.get('informacion').get('filterType').value == 'NOMBRE') {
				this.searchIdNumberAccess = true;
				if (this.dataAutoCompleteIdNumberObject.find(nombre => nombre.name == idNumber)) {
					console.log('Asegurado encontrado');
					idNumberObject = this.dataAutoCompleteIdNumberObject.find(nombre =>
						nombre.name == idNumber);
					idNumber = (idNumberObject.value).toString();
				}
				else {
					console.log('Asegurado no encontrado');
				}
			}
			if (this.refundForm.get('informacion').get('filterType').value == 'ID') {
				this.searchIdNumberAccess = true;
				idNumber = (idNumber).toString();
			}
			if (this.refundForm.get('informacion').get('filterType').value == 'POLIZA' && this.idNumber2Options.length == 0) {
				this.appComponent.showOverlay = true;
				if (this.dataAutoCompleteIdNumberObject.find(nombre => nombre.policy == idNumber)) {
					console.log('Póliza encontrada');
					const idNumber2Policy = idNumber;
					// tslint:disable-next-line: prefer-for-of
					for (let x = 0; x < this.dataAutoCompleteIdNumberObject.length; x++) {
						if (idNumber2Policy == this.dataAutoCompleteIdNumberObject[x].policy) {
							this.idNumber2Options.push({
								value: this.dataAutoCompleteIdNumberObject[x].name,
								viewValue: this.dataAutoCompleteIdNumberObject[x].name,
								policy: this.dataAutoCompleteIdNumberObject[x].policy
							});
						}
					}
					if (this.idNumber2Options.length > 1) {
						this.idNumber2FieldVisible = true;
						this.searchIdNumberAccess = false;
					}
					else {
						this.idNumber2FieldVisible = false;
						this.searchIdNumberAccess = true;
						this.refundForm.get('informacion').get('idNumber2').setValue('');
						this.refundForm.get('informacion').get('idNumber2').markAsUntouched();

						idNumberObject = this.dataAutoCompleteIdNumberObject.find(nombre =>
							nombre.policy == idNumber);
						idNumber = (idNumberObject.value).toString();
						this.idNumber2Options.splice(0, this.idNumber2Options.length);
					}
				}
				else {
					console.log('Póliza no encontrada');
					this.searchIdNumberAccess = true;
				}
				// setTimeout(() => {
				this.appComponent.showOverlay = false;
				// }, 1000);
			}

			if (this.refundForm.get('informacion').get('idNumber2').value != '' && this.idNumber2FieldVisible == true) {
				this.searchIdNumberAccess = true;
				const idNumber2Value = this.refundForm.get('informacion').get('idNumber2').value;

				idNumberObject = this.dataAutoCompleteIdNumberObject.find(nombre =>
					nombre.name == idNumber2Value);
				idNumber = (idNumberObject.value).toString();
			}

			// idNumberObject = this.dataAutoCompleteIdNumberObject.find(nombre =>
			// 	nombre.name == idNumber);
			// console.log(idNumberObject);

			if (this.searchIdNumberAccess == true) {

				this.appComponent.showOverlay = true;

        const country = this.countryRolesService.getLocalStorageCountry();
				this.userService.getInsurancePeople(idNumber, country.codigoPortal)
					.subscribe((response: any) => {
						console.log(response);
						this.appComponent.showOverlay = false;
						if (response.data !== null) {
							this.showContent = true;
							const dialogRef = this.dialog.open(BaseDialogComponent, {
								data: this.dialogOption.idNumberFound(response.data),
								minWidth: 385,
							});
							setTimeout(() => {
								dialogRef.close();
							}, 4000);

							this.refundForm.get('informacion').get('nombre').setValue(`${response.data.asegurado.nombres_asegurado} ${response.data.asegurado.apellidos_asegurado}`);
							// this.refundForm.get('informacion').get('noPoliza').setValue(response.data.asegurado.no_poliza);
							this.refundForm.get('idNumber').setValue(response.data.asegurado.id_asegurado);

							if (this.dataAutoCompleteIdNumberObject.find(nombre => nombre.name == this.refundForm.get('informacion').get('nombre').value)) {
								console.log('el nombre de response.data es igual a nombre.name');
								console.log(this.dataAutoCompleteIdNumberObject.find(nombre => nombre.name == this.refundForm.get('informacion').get('nombre').value).policy);
								this.refundForm.get('informacion').get('noPoliza').setValue(this.dataAutoCompleteIdNumberObject.find(nombre => nombre.name == this.refundForm.get('informacion').get('nombre').value).policy);
							}

						} else {
							this.showContent = false;
							const dialogRef = this.dialog.open(BaseDialogComponent, {
								data: this.dialogOption.idNumberNotFound,
								minWidth: 385,
							});
							setTimeout(() => {
								dialogRef.close();
							}, 4000);

							this.refundForm.get('informacion').get('nombre').setValue('');
							this.refundForm.get('informacion').get('noPoliza').setValue('');

						}
					});
			}
		}
	}

	getData(id) {
		setTimeout(() => {
			this.appComponent.showOverlay = true;
		});
		this.refund.returnData(id).subscribe(data => {
			console.log(data);
			this.refundForm.get('informacion').get('idNumber').disable();
			this.refundForm.get('informacion').get('filterType').disable();
			this.refundForm.get('informacion').get('idNumber2').disable();

			this.dataMappingFromApi.iterateThroughtAllObject(data.data, this.refundForm);

			this.refundForm.get('informacion').get('idNumber2').clearValidators();
			this.refundForm.get('informacion').get('idNumber2').updateValueAndValidity();

			this.diagnosticList = this.refundForm.get('diagnosticos') as FormArray;
			this.filesInformation = data.data.diagnosticos;

			if (data.data.agreeWithDeclaration === 'true' || data.data.agreeWithDeclaration === 'TRUE') {
				this.refundForm.get('agreeWithDeclaration').setValue(true);
			}

			if (this.refundForm.get('countryRoleCode')) { this.refundForm.get('countryRoleCode').setValidators(null); }

			// if (this.refundForm.get('haveAditionalComentary').value === 'FALSE') {
			// 	this.refundForm.get('haveAditionalComentary').setValue('');
			// }
			// if (this.refundForm.get('agreeWithDeclaration').value === 'FALSE') {
			// 	this.refundForm.get('agreeWithDeclaration').setValue(''); data.informacion.idNumber2
			// }
			if (data.data.informacion.idNumber2 != '') {
				console.log('Entro');
				// if (this.dataAutoCompleteIdNumberObject.find(nombre => nombre.policy == data.data.informacion.idNumber)) {
				// 	console.log('Entro 2');
				// 	console.log('Poliza en editar encontrada. La poliza es ' + data.data.informacion.idNumber);
				// 	const idNumber2Policy = data.data.informacion.idNumber;
				// 	// tslint:disable-next-line: prefer-for-of
				// 	for (let x = 0; x < this.dataAutoCompleteIdNumberObject.length; x++) {
				// 		if (idNumber2Policy == this.dataAutoCompleteIdNumberObject[x].policy) {
				// 			this.idNumber2Options.push({
				// 					value: this.dataAutoCompleteIdNumberObject[x].name,
				// 					viewValue: this.dataAutoCompleteIdNumberObject[x].name,
				// 					policy: this.dataAutoCompleteIdNumberObject[x].policy
				// 				});
				// 		}
				// 	}
				// 	if (this.idNumber2Options.length > 1) {
				// 		this.refundForm.get('informacion').get('idNumber2').setValue(data.data.informacion.idNumber2);
				// 		this.idNumber2FieldVisible = true;
				// 	}
				// 	else {
				// 		this.idNumber2FieldVisible = false;
				// 		this.refundForm.get('informacion').get('idNumber2').setValue('');
				// 		this.refundForm.get('informacion').get('idNumber2').markAsUntouched();

				// 		this.idNumber2Options.splice(0, this.idNumber2Options.length);
				// 	}
				// }
				// else {
				// 	console.log('NO Entro 2');
				// }
				this.idNumber2Options.push({
					value: data.data.informacion.idNumber2,
					viewValue: data.data.informacion.idNumber2,
					policy: data.data.informacion.noPoliza
				});
				this.refundForm.get('informacion').get('idNumber2').setValue(data.data.informacion.idNumber2);
				this.idNumber2FieldVisible = true;
			}
			this.showContent = true;
			this.refundForm.markAllAsTouched();
			this.refundForm.updateValueAndValidity();
			this.cd.markForCheck();

			this.refundForm.get('diagnosticos').valueChanges.subscribe((value) => {
				this.validDatesCounter = 0;
				let total = 0;
				let totalPesos = 0;


				for (const element in value) {
					if (value.hasOwnProperty(element)) {
						console.log(this.refundForm.get('diagnosticos').get(element.toString()));
						if (this.refundForm.get('diagnosticos').get(element.toString()).get('tipoReclamoMoneda')) {
							if (this.refundForm.get('diagnosticos').get(element.toString()).get(
								'tipoReclamoMoneda').value != null) {
								if (this.refundForm.get('diagnosticos').get(element.toString()).get(
									'tipoReclamoMoneda').value === 'DOLARES') {
									console.log('total', this.refundForm.get('diagnosticos').get(element.toString()).value.monto);
									total += Number.parseFloat(this.refundForm.get('diagnosticos').get(element.toString()).value.monto);
								}
								if (this.refundForm.get('diagnosticos').get(element.toString()).get(
									'tipoReclamoMoneda').value === 'PESOS') {
									totalPesos += Number.parseFloat(this.refundForm.get('diagnosticos').get(element.toString()).value.monto);
								}
							}
						}

						if (this.calculatedDate(this.refundForm.get('diagnosticos').get(element.toString()).value.fecha) >= 6) {
							this.receiveDateValidator(false);

						} else {
							this.receiveDateValidator(true);

						}
					}
				}
				this.refundForm.get('totalAmount').setValue(total);
				this.totalAmount = total;
				this.refundForm.get('totalAmountPesos').setValue(totalPesos);
				this.totalAmountPesos = totalPesos;
			});

			this.totalAmount = data.data.totalAmount;
			this.totalAmountPesos = data.data.totalAmountPesos;

			for (let x = 0; x < data.data.diagnosticos.length; x++) {
				// this.manageFilters(x);

				let valueFilter = this.refundForm.get('diagnosticos').get(x.toString()).get('categoria').value;
				if (valueFilter == 'OTROS_PROVEEDORES') {
					this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
						.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value),
							map(value => value ? this._filterProveedores(x, value) : this.Otrosproveedores.slice())
						);
				}
				if (valueFilter == 'CENTROS_ESPECIALIZADOS') {
					this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
						.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value),
							map(value => value ? this._filterProveedores(x, value) : this.Centros.slice())
						);
				}
				if (valueFilter == 'FARMACIAS') {
					this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
						.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value),
							map(value => value ? this._filterProveedores(x, value) : this.farmacias.slice())
						);
				}
				if (valueFilter == 'CLINICAS_HOSPITALES') {
					this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
						.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value),
							map(value => value ? this._filterProveedores(x, value) : this.clinicas.slice())
						);
				}
				if (valueFilter == 'LABORATORIOS') {
					this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
						.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value),
							map(value => value ? this._filterProveedores(x, value) : this.labs.slice())
						);
				}
				if (valueFilter == 'MEDICOS') {
					this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
						.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value),
							map(value => value ? this._filterProveedores(x, value) : this.medicos.slice())
						);
				}

				this.categoriaSubscribe[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('categoria').valueChanges.subscribe(valueFilterEdit => {

					if (this.refundForm.get('diagnosticos').get(x.toString())) {
						this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').setValue('');
						this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').markAsUntouched();

						if (valueFilterEdit == 'OTROS_PROVEEDORES') {
							this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
								.pipe(
									startWith(''),
									map(value => typeof value === 'string' ? value : value),
									map(value => value ? this._filterProveedores(x, value) : this.Otrosproveedores.slice())
								);
						}
						if (valueFilterEdit == 'CENTROS_ESPECIALIZADOS') {
							this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
								.pipe(
									startWith(''),
									map(value => typeof value === 'string' ? value : value),
									map(value => value ? this._filterProveedores(x, value) : this.Centros.slice())
								);
						}
						if (valueFilterEdit == 'FARMACIAS') {
							this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
								.pipe(
									startWith(''),
									map(value => typeof value === 'string' ? value : value),
									map(value => value ? this._filterProveedores(x, value) : this.farmacias.slice())
								);
						}
						if (valueFilterEdit == 'CLINICAS_HOSPITALES') {
							this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
								.pipe(
									startWith(''),
									map(value => typeof value === 'string' ? value : value),
									map(value => value ? this._filterProveedores(x, value) : this.clinicas.slice())
								);
						}
						if (valueFilterEdit == 'LABORATORIOS') {
							this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
								.pipe(
									startWith(''),
									map(value => typeof value === 'string' ? value : value),
									map(value => value ? this._filterProveedores(x, value) : this.labs.slice())
								);
						}
						if (valueFilterEdit == 'MEDICOS') {
							this.filteredOptionsProveedor[x] = this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').valueChanges
								.pipe(
									startWith(''),
									map(value => typeof value === 'string' ? value : value),
									map(value => value ? this._filterProveedores(x, value) : this.medicos.slice())
								);
						}
					}
					console.log(this.filteredOptionsProveedor);
				});

				this.filterValueArray.push();

				const valueProveedorArray = this.refundForm.get('diagnosticos').get((x).toString()
				).get('proveedor').value;

				setTimeout(() => {
					this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor'
					).setValue(valueProveedorArray + ' ');
					console.log('yaaaaaaaaaaaaaa proveedor ' + x);
				},
					500);

				setTimeout(() => {
					this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor'
					).setValue(valueProveedorArray);
					console.log('yaaaaaaaaaaaaaa proveedor ' + x + ', parte 2');
				},
					1000);

				setTimeout(() => {
					if (this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').value == '') {
						this.refundForm.get('diagnosticos').get(x.toString()).get('proveedor').markAsTouched();
					}
				},
					1000);

				if (this.refundForm.get('informacion').get('tipoReclamo').value == 'INTERNACIONAL') {
					// for (let x = 0; x < this.diagnosticList.length; x++) {
					// setTimeout(() => {
					// this.refundForm.get('diagnosticos').get(x.toString()).get('tipoReclamoMoneda').setValue('DOLARES');
					// this.refundForm.get('diagnosticos').get(x.toString()).get('categoria').setValue('INTERNACIONAL');
					this.refundForm.get('diagnosticos').get(x.toString()).get('categoria').disable();
					// this.categoriaSubscribe[x].unsubscribe();
					// }, 1000);
					// }
				}

			}
			if (this.refundForm.get('infoTransferencia')) {

				const valueBanco = this.refundForm.get('infoTransferencia').get('bancoEmisor').value;
				this.filteredOptionsBanks = this.refundForm.get('infoTransferencia').get('bancoEmisor').valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value),
						map(value => value ? this._filterBanks(value) : this.banks.slice())
					);
				this.refundForm.get('infoTransferencia').get('bancoEmisor').setValidators([Validators.required, this.bankValidator()]);
				this.refundForm.get('infoTransferencia').get('noCuenta').setValidators([Validators.required, this.accountNumberValidator()]);
				
				setTimeout(() => {
					this.refundForm.get('infoTransferencia').get('bancoEmisor').setValue(valueBanco + ' ');
					console.log('yaaaaaaaaaaaaaa bancoEmisor ');
				},
					1000);
				setTimeout(() => {
					this.refundForm.get('infoTransferencia').get('bancoEmisor').setValue(valueBanco);
					console.log('yaaaaaaaaaaaaaa bancoEmisor, parte 2');
				},
					2000);
			}
			for (let x = 0; x < this.diagnosticList.length; x++) {

				for (let y = 0; y < this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('invoices')['controls'].length; y++) {
					this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('invoices').get(y.toString()).get('invoices').setValidators(Validators.required);
					this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('invoices').get(y.toString()).get('invoices').updateValueAndValidity();
				}

				for (let y = 0; y < this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('indications')['controls'].length; y++) {
					this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('indications').get(y.toString()).get('indications').clearValidators();
					this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('indications').get(y.toString()).get('indications').updateValueAndValidity();
				}

				for (let y = 0; y < this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('medicReports')['controls'].length; y++) {
					this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('medicReports').get(y.toString()).get('medicReports').clearValidators();
					this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('medicReports').get(y.toString()).get('medicReports').updateValueAndValidity();
				}

				for (let y = 0; y < this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('paymentVouchers')['controls'].length; y++) {
					this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('paymentVouchers').get(y.toString()).get('paymentVouchers').clearValidators();
					this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('paymentVouchers').get(y.toString()).get('paymentVouchers').updateValueAndValidity();
				}

				for (let y = 0; y < this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('otros')['controls'].length; y++) {

					this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('otros').get(y.toString()).get('otros').clearValidators();
					this.refundForm.get('diagnosticos').get(x.toString()).get('files').get('otros').get(y.toString()).get('otros').updateValueAndValidity();
				}
			}
			
			// setTimeout(() => {
			this.appComponent.showOverlay = false;
			// },
			// 5000);
		});
		this.refund.id = null;


	}

	log(thing: any) {
		console.log('thing:', thing);
	}

	sanitizeAccountNumber(form: FormGroup) {
		if(form.get('infoTransferencia')) {
			let accountNumber: AbstractControl = form.get('infoTransferencia').get('noCuenta') || null;

			if(accountNumber && accountNumber.value == null) {
				accountNumber.setValue(0);
			}
		}
	}

	setStatus(form: FormGroup){

		if(!form.get('status')){
			form.addControl('status', this.fb.control(0, Validators.required));
		}

		const status = form.status === 'VALID' ? 1 : 0;
		form.get('status').setValue(status);
	}

	sendForm(form: FormGroup, formType: string, sendType: string, id?: number) {
		this.sanitizeAccountNumber(form);
		this.setStatus(form);
		this.formHandler.sendForm(form, formType, sendType, this.appComponent, id);
	}
}
