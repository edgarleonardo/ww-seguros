import { Component, OnInit, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
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
			{
				value: 'CHEQUE',
				viewValue: 'CHEQUE'
			}
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
	) { }

	ID = null;

	timeAutoComplete = 0;

	ngOnInit() {

		this.appComponent.showOverlay = true;
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
				nombre: [{ value: '', disabled: true }, [Validators.required]],
				direccion: ['',],
				telefono: ['',],
				correo: ['', [Validators.required, Validators.email]],
			}),
			diagnosticos: this.fb.array([this.createDiagnostic()]),
			haveAditionalComentary: [''],
			comentary: [''],
			forma: ['', Validators.required],
			totalAmount: ['', Validators.required],
			totalAmountPesos: ['', Validators.required],
			agreeWithDeclaration: ['', [Validators.requiredTrue]],
			isComplete: [false, Validators.required],
			areDiagnosticDatesValid: [true, Validators.required],
		});

		this.diagnosticList = this.refundForm.get('diagnosticos') as FormArray;

		console.log('diagnosticos', this.refundForm.get('diagnosticos').value);

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
				console.log(!this.refundForm.get('infoTransferencia').valid);

				if (!this.refundForm.get('infoTransferencia').valid && this.form.submitted) {
					return true;
				} else {
					return false;
				}
			} else {
				if (!form.valid && this.form.submitted) {
					return true;
				} else {
					return false;
				}
			}
		} else {
			if (form.valid) {
				return false;
			} else {
				return true;
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
				this.banks.push({
					value: data.data[x].descripcion,
					viewValue: data.data[x].descripcion,
				});
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
		} else if (event.value === 'TRANSFERENCIA') {
			this.refundForm.addControl(
				'infoTransferencia',
				this.fb.group({
					noCuenta: ['', Validators.required],
					tipoCuenta: ['', Validators.required],
					bancoEmisor: ['', Validators.required],
					tipoMoneda: ['', Validators.required]
				})
			);
		}
	}

	createInfo(): FormGroup {
		return this.fb.group({
			// cedula: ['', Validators.required],
			noCuenta: ['', Validators.required],
			tipoCuenta: ['', Validators.required],
			bancoEmisor: ['', Validators.required],
			tipoMoneda: ['', Validators.required],
			// correo: ['', Validators.required]
		});
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
			})
		});
	}

	addDiagnostic() {
		console.log('diagnosticos: ', this.refundForm.get('diagnosticos').value);
		this.diagnosticList.push(this.createDiagnostic());
		this.manageFilters(this.diagnosticList.length - 1);
		this.filterValueArray.push();
	}

	createFormArray(type: string): any {
		switch (type) {
			case 'invoices':
				return this.fb.group({
					invoices: ['', Validators.required],
				});

			case 'indications':
				return this.fb.group({
					indications: ['', Validators.required],
				});

			case 'medicReports':
				return this.fb.group({
					medicReports: ['', Validators.required],
				});

			case 'paymentVouchers':
				return this.fb.group({
					paymentVouchers: ['', Validators.required],
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

		for (let x = 0; x < this.diagnosticList.length; x++ ) {
			valuePrueba.push(this.refundForm.get('diagnosticos').get((x).toString()).get('categoria').value);
			valuePrueba2.push(this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor').value);
		}
		valuePrueba.splice(index, 1);
		valuePrueba2.splice(index, 1);
		console.log(valuePrueba);
		console.log(valuePrueba2);

		let y = 0;
		if (this.refundForm.get('diagnosticos').get((index + 1).toString())) {

			for (let x = index; x < this.diagnosticList.length; x++ ) {

				// if (this.refundForm.get('diagnosticos').get((x + 1).toString())) {

					this.filteredOptionsProveedor.splice(x, 1);
					this.filterValueArray.splice(x, 1);
					this.categoriaSubscribe[x].unsubscribe();
					// this.categoriaSubscribe.splice(x, 1);
					if ( y == 0) {
						this.diagnosticList.removeAt(index);
						y++;
					}
					this.manageFilters(x);
					this.refundForm.get('diagnosticos').get((x).toString()).get('categoria').setValue('');
					this.refundForm.get('diagnosticos').get((x).toString()).get('categoria').setValue(valuePrueba[x]);
					this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor').setValue('');
					// this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor').updateValueAndValidity();
					this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor').setValue(valuePrueba2[x]);

					setTimeout(() => {
						this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor'
						).setValue(valuePrueba2[x] + ' ');
						console.log('yaaaaaaaaaaaaaa proveedor ' + x + ' eliminar');
					},
					1000);

					setTimeout(() => {
						this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor'
						).setValue(valuePrueba2[x]);
						console.log('yaaaaaaaaaaaaaa proveedor ' + x + ' eliminar, parte 2');
					},
					1000);

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

		if (this.refundForm.get('informacion').get('filterType').value == 'NOMBRE') {
			idNumberObject = this.dataAutoCompleteIdNumberObject.find(nombre =>
				nombre.name == idNumber);
			idNumber = (idNumberObject.value).toString();
		}
		if (this.refundForm.get('informacion').get('filterType').value == 'ID') {
			idNumber = (idNumber).toString();
		}
		if (this.refundForm.get('informacion').get('filterType').value == 'POLIZA') {
			idNumberObject = this.dataAutoCompleteIdNumberObject.find(nombre =>
				nombre.policy == idNumber);
			idNumber = (idNumberObject.value).toString();
		}

		// idNumberObject = this.dataAutoCompleteIdNumberObject.find(nombre =>
		// 	nombre.name == idNumber);
		// console.log(idNumberObject);

		this.appComponent.showOverlay = true;
		this.userService.getInsurancePeople(idNumber)
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
					this.refundForm.get('informacion').get('noPoliza').setValue(response.data.asegurado.no_poliza);

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

	getData(id) {
		setTimeout(() => {
			this.appComponent.showOverlay = true;
		});
		this.refund.returnData(id).subscribe(data => {
			console.log(data);
			this.refundForm.get('informacion').get('idNumber').disable();
			this.refundForm.get('informacion').get('filterType').disable();

			this.dataMappingFromApi.iterateThroughtAllObject(data.data, this.refundForm);

			this.diagnosticList = this.refundForm.get('diagnosticos') as FormArray;
			this.filesInformation = data.data.diagnosticos;

			if (data.data.agreeWithDeclaration === 'true' || data.data.agreeWithDeclaration === 'TRUE') {
				this.refundForm.get('agreeWithDeclaration').setValue(true);
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

			this.totalAmount = data.data.totalAmount;
			this.totalAmountPesos = data.data.totalAmountPesos;

			for (let x = 0; x < data.data.diagnosticos.length; x++ ) {
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
				1000);

				setTimeout(() => {
					this.refundForm.get('diagnosticos').get((x).toString()).get('proveedor'
					).setValue(valueProveedorArray);
					console.log('yaaaaaaaaaaaaaa proveedor ' + x + ', parte 2');
				},
				2000);
			}
		});
		this.refund.id = null;
		this.appComponent.showOverlay = false;


	}

	log(thing: any) {
		console.log('thing:', thing);
	}

	sendForm(form: FormGroup, formType: string, sendType: string, id?: number) {
		console.log(id);
		this.formHandler.sendForm(form, formType, sendType, this.appComponent, id);

	}
}
