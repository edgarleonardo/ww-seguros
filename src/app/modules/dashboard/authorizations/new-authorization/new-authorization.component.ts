import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, DoCheck } from '@angular/core';
import { FieldConfig } from '../../../../shared/components/form-components/models/field-config';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { FormHandlerService } from '../../../../core/services/forms/form-handler.service';
import { $country } from 'src/app/core/form/objects';
import { NewAuthorizationService } from '../new-authorization/services/new-authorization.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { DialogOptionService } from 'src/app/core/services/dialog/dialog-option.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { BaseDialogComponent } from 'src/app/shared/components/base-dialog/base-dialog.component';
import { map, first, switchMap, startWith } from 'rxjs/operators';
import { UserService } from '../../../../core/services/user/user.service';
import { AppComponent } from '../../../../app.component';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from 'src/app/modules/dashboard/services/requests/requests.service';
import {CountryRolesService} from '../../../../shared/services/country-roles.service';
// tslint:disable: no-string-literal
// tslint:disable: max-line-length

@Component({
	selector: 'app-new-authorization',
	templateUrl: './new-authorization.component.html',
	styleUrls: ['./new-authorization.component.scss']
})
export class NewAuthorizationComponent implements OnInit, OnDestroy, DoCheck {

	constructor(
		private fb: FormBuilder,
		public formHandler: FormHandlerService,
		private newAuthorization: NewAuthorizationService,
		public dialogModal: DialogService,
		private dialogOption: DialogOptionService,
		public dialog: MatDialog,
		private userService: UserService,
		private appComponent: AppComponent,
		private route: ActivatedRoute,
		private router: Router,
		private cd: ChangeDetectorRef,
		public requestService: RequestsService,
    private countryRolesService: CountryRolesService
	) {
	}

	accordionTitles = [
		'Información del Asegurado',
		'Información médica',
		'Archivos adjuntos'
	];

	varIsMedical = 0;

	dataAutoCompleteIdNumber = [];
	dataAutoCompleteIdNumberObject = [];
	dataAutoCompleteName = [];
	dataAutoCompletePolicy = [];

	filteredOptions: Observable<any[]>;
	filteredOptionsMedicoTratante: Observable<any[]>;
	filteredOptionsMedicoReferente: Observable<any[]>;
	filteredOptionsCentroServicio: Observable<any[]>;

	timeAutoComplete = 0;

	filesInformation: Observable<any>;
	documentsArray: FormArray;

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

	seguros: FieldConfig = {
		label: '¿Tiene otro seguro de salud?',
		options: [
			{
				value: 'SI',
				viewValue: 'Si'
			},
			{
				value: 'NO',
				viewValue: 'No'
			}
		]
	};

	autorizacionOptions: FieldConfig = {
		label: '',
		options: [
			{
				value: 'SI',
				viewValue: 'Si'
			},
			{
				value: 'NO',
				viewValue: 'No'
			}
		]
	};

	generos: FieldConfig = {
		label: 'Sexo',
		options: [
			{
				value: 'FEMENINO',
				viewValue: 'FEMENINO'
			},
			{
				value: 'MASCULINO',
				viewValue: 'MASCULINO'
			}
		]
	};

	condiciones: FieldConfig = {
		label: 'La condición se trata de: ',
		options: [
			{
				value: 'HOSPITALIZACIÓN',
				viewValue: 'HOSPITALIZACIÓN'
			},
			{
				value: 'AMBULATORIO',
				viewValue: 'AMBULATORIO'
			}
		]
	};
	tipoReclamo: FieldConfig = {
		label: 'Tipo',
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


	tipoReclamoInternacional: FieldConfig = {
		label: 'Moneda',
		options: [
			{
				value: 'DOLARES',
				viewValue: 'Dólares'
			}
		]
	};

	serviceOptions = [];

	serviceCenters: FieldConfig = {
		label: 'Nombre',
		options: this.serviceOptions
	};

	doctorNames = [];
	doctorNamesTratante = [];
	doctorNamesReference = [];

	doctorFieldNames = {
		label: 'Nombre',
		options: this.doctorNames
	};

	// doctorMedicCenter = [];

	// doctorFieldMedicCenter: FieldConfig = {
	// 	label: 'Dirección',
	// 	options: this.doctorMedicCenter
	// };

	// doctorNumbers = [];

	// doctorFieldNumbers: FieldConfig = {
	// 	label: 'Teléfono',
	// 	options: this.doctorNumbers
	// };

	idNumber2FieldVisible = false;
	searchIdNumberAccess = false;

	idNumber2Options = [];

	// idNumber2Label = 'Asegurados poliza ';

	idNumber2Field = {
		label: 'Asegurados misma póliza',
		options: this.idNumber2Options
	};

	authorization: FormGroup;

	ID = null;
	isMedicalEqualSB: any;
	nombreMedicoSB: any;
	otroNombreMedicoSB: any;
	telefonoSB: any;
	direccionSB: any;
	formSubmitted = false;
	todayDate = new Date();
	showContent = false;
	step: number;

	@ViewChild('form', { static: false }) form;

	selectChange(event: any) {
		const form = this.authorization.get('informacionAsegurado') as FormGroup;
		console.log(event);

		if (event.valor === 'SI') {
			switch (event.name) {
				case 'otroSeguro':
					form.addControl('seguro', this.fb.group({
						nombre: ['', Validators.required],
						noPoliza: ['', Validators.required],
						fecha: ['', Validators.required],
						suma: ['', Validators.min(0)],
					}));
					break;
				default:
					break;
			}
		} else if (event.valor === 'NO') {
			switch (event.name) {
				case 'otroSeguro':
					form.removeControl('seguro');
					break;
				default:
					break;
			}
		}
	}
	ngOnInit() {
		console.log('El largo de this.idNumber2Options es ' + this.idNumber2Options.length);
		setTimeout(() => {
			this.appComponent.showOverlay = true;
		  });
		this.returnDoctors();
		this.returnServiceCenters();
		this.returnAutoCompleteData();

		this.route.params.subscribe(res => {
			this.ID = res.id;
		});

		if (this.ID != null) {
			console.log('El ID es ' + this.ID);
			this.getData(this.ID);
		} else if (this.ID == null) {
			console.log('ID esta vacio');
		}

		console.log(this.filesInformation);

		this.authorization = this.fb.group({
			fecha: [new Date(), Validators.required],
			informacionAsegurado: this.fb.group({
				tipoReclamo: ['', Validators.required],
				//tipoReclamoMoneda: ['', Validators.required],
				nombres: [{ value: '', disabled: true }, [Validators.required]],
				apellidos: [{ value: '', disabled: true }, [Validators.required]],
				noPoliza: [{ value: '', disabled: true }, [Validators.required]],
				filterType: ['', Validators.required],
				idNumber: ['', Validators.required],
				idNumber2: [''],
				sexo: [{ value: '', disabled: true }, [Validators.required]],
				correo: ['', [Validators.email, Validators.required]],
				direccion: [''],
				telefonoResidencia: [''],
				telefonoCelular: ['', Validators.required],
				telefonoOficina: [''],
				otroSeguro: ['', Validators.required],
			}),
			informacionMedica: this.fb.group({
				diagnostico: ['', Validators.required],
				condicion: ['', Validators.required],
				procedimiento: ['', Validators.required],
				// monto: ['', [Validators.required, Validators.min(1)]],
				primerosSintomas: this.fb.group({
					fecha: ['', Validators.required],
					nombreMedico: ['', Validators.required],
					direccion: [''],
					telefono: ['', Validators.required],
				}),
				admision: this.fb.group({
					fecha: ['', Validators.required],
					nombreMedico: [''],
					direccion: [''],
					telefono: [''],
				}),
				tiempoEstadia: ['', [Validators.required]],
				nombreServicio: ['', Validators.required],
				isMedicalEqual: [''],
				// direccion: ['', Validators.required],
				// telefono: ['', Validators.required],
				autorizacion: ['', Validators.required]
			}),
			files: this.fb.array([this.createFormArray()]),
			isComplete: [false, Validators.required],
			idNumber: [{ value: '', disabled: true }, Validators.required],

		});

		this.authorization.get('informacionMedica').get('tiempoEstadia').setValidators(Validators.max(this.maxBasedOnCondition()));

		this.documentsArray = this.authorization.get('files') as FormArray;

		this.isMedicalEqualSB = this.authorization.get('informacionMedica').get('isMedicalEqual').valueChanges.subscribe(response => {
			switch (response) {
				case true:
					this.authorization.get('informacionMedica').get('admision').get('nombreMedico').setValue((this.authorization.get('informacionMedica').get('primerosSintomas').get('nombreMedico').value).toUpperCase());
					this.authorization.get('informacionMedica').get('admision').get('telefono').setValue((this.authorization.get('informacionMedica').get('primerosSintomas').get('telefono').value).toUpperCase());
					this.authorization.get('informacionMedica').get('admision').get('direccion').setValue((this.authorization.get('informacionMedica').get('primerosSintomas').get('direccion').value).toUpperCase());

					if (this.authorization.get('informacionMedica').get('admision').get('specifyOthers') &&
						!this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers')) {

						(this.authorization.get('informacionMedica').get('admision') as FormGroup).removeControl('specifyOthers');
					}
					else if (this.authorization.get('informacionMedica').get('admision').get('specifyOthers') &&
						this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers')) {

						this.authorization.get('informacionMedica').get('admision').get('specifyOthers').setValue((this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers').value).toUpperCase());
					}
					else if (!this.authorization.get('informacionMedica').get('admision').get('specifyOthers') &&
						this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers')) {

						(this.authorization.get('informacionMedica').get('admision') as
							FormGroup).addControl('specifyOthers', this.fb.control(''));

						this.authorization.get('informacionMedica').get('admision').get('specifyOthers').setValue((this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers').value).toUpperCase());
					}

					this.nombreMedicoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('nombreMedico').valueChanges.subscribe(value => {
						this.authorization.get('informacionMedica').get('admision').get('nombreMedico').setValue(value.toUpperCase());
					});

					this.telefonoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('telefono').valueChanges.subscribe(value => {
						this.authorization.get('informacionMedica').get('admision').get('telefono').setValue(value.toUpperCase());
					});

					this.direccionSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('direccion').valueChanges.subscribe(value => {
						this.authorization.get('informacionMedica').get('admision').get('direccion').setValue(value.toUpperCase());
					});

					if (this.authorization.get('informacionMedica').get('admision').get('specifyOthers') &&
						!this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers')) {

						(this.authorization.get('informacionMedica').get('admision') as FormGroup).removeControl('specifyOthers');
					}
					else if (this.authorization.get('informacionMedica').get('admision').get('specifyOthers') &&
						this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers')) {

						this.otroNombreMedicoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers').valueChanges.subscribe(value => {
							this.authorization.get('informacionMedica').get('admision').get('specifyOthers').setValue(value.toUpperCase());
						});

						this.authorization.get('informacionMedica').get('admision').get('specifyOthers').disable();
					}
					else if (!this.authorization.get('informacionMedica').get('admision').get('specifyOthers') &&
						this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers')) {

						(this.authorization.get('informacionMedica').get('admision') as
							FormGroup).addControl('specifyOthers', this.fb.control(''));

						this.otroNombreMedicoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers').valueChanges.subscribe(value => {
							this.authorization.get('informacionMedica').get('admision').get('specifyOthers').setValue(value.toUpperCase());
						});

						this.authorization.get('informacionMedica').get('admision').get('specifyOthers').disable();
					}

					this.authorization.get('informacionMedica').get('admision').get('nombreMedico').disable();
					this.authorization.get('informacionMedica').get('admision').get('telefono').disable();
					this.authorization.get('informacionMedica').get('admision').get('direccion').disable();
					break;

				case false:
					this.nombreMedicoSB.unsubscribe();
					this.telefonoSB.unsubscribe();
					this.direccionSB.unsubscribe();
					if (this.otroNombreMedicoSB !== undefined) {
						this.otroNombreMedicoSB.unsubscribe();
					}

					this.authorization.get('informacionMedica').get('admision').get('nombreMedico').enable();
					if (this.authorization.get('informacionMedica').get('admision').get('specifyOthers')) {
						this.authorization.get('informacionMedica').get('admision').get('specifyOthers').enable();
					}

					// if (this.authorization.get('informacionMedica').get('admision').get('nombreMedico').value.toLowerCase() ==
					// 	'otro') {
					this.authorization.get('informacionMedica').get('admision').get('telefono').enable();
					this.authorization.get('informacionMedica').get('admision').get('direccion').enable();
					// }
					// this.authorization.get('informacionMedica').get('admision').get('telefono').enable();
					// this.authorization.get('informacionMedica').get('admision').get('direccion').enable();

					break;

				default:
					break;
			}
		});

		// tslint:disable-next-line: align
		// this.filteredOptions = this.authorization.get('informacionAsegurado').get('idNumber').valueChanges
		// 	.pipe(
		// 		startWith(''),
		// 		map(value => typeof value === 'string' ? value : value),
		// 		map(value => value ? this._filter(value) : this.dataAutoCompleteIdNumber.slice())
		// 	);
		this.authorization.get('informacionAsegurado').get('filterType').valueChanges.subscribe(valueFilter => {

			this.authorization.get('informacionAsegurado').get('idNumber').setValue('');
			this.authorization.get('informacionAsegurado').get('idNumber').markAsUntouched();

			this.idNumber2FieldVisible = false;
			this.searchIdNumberAccess = false;
			this.idNumber2Options.splice(0, this.idNumber2Options.length);
			this.authorization.get('informacionAsegurado').get('idNumber2').setValue('');
			this.authorization.get('informacionAsegurado').get('idNumber2').markAsUntouched();

			if (valueFilter == 'NOMBRE') {
				this.filteredOptions = this.authorization.get('informacionAsegurado').get('idNumber').valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value),
						map(value => value ? this._filter(value) : this.dataAutoCompleteName.slice())
					);
			}
			if (valueFilter == 'ID') {
				this.filteredOptions = this.authorization.get('informacionAsegurado').get('idNumber').valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value),
						map(value => value ? this._filter(value) : this.dataAutoCompleteIdNumber.slice())
					);
			}
			if (valueFilter == 'POLIZA') {
				this.filteredOptions = this.authorization.get('informacionAsegurado').get('idNumber').valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value),
						map(value => value ? this._filter(value) : this.dataAutoCompletePolicy.slice())
					);
			}
		});

		this.authorization.get('informacionAsegurado').get('idNumber').valueChanges.subscribe(valueIdNumber => {

			if (this.idNumber2Options.length > 0) {
				if (this.idNumber2Options[0].policy) {
					if (this.idNumber2Options[0].policy != valueIdNumber) {

						this.idNumber2FieldVisible = false;
						this.searchIdNumberAccess = false;
						this.idNumber2Options.splice(0, this.idNumber2Options.length);
						this.authorization.get('informacionAsegurado').get('idNumber2').setValue('');
						this.authorization.get('informacionAsegurado').get('idNumber2').markAsUntouched();
					}
				}
			}
		});

		//if (!this.ID) {
		console.log('AOSKDOPAKSDOPSA');
		this.authorization.get('informacionMedica').get('condicion').valueChanges.subscribe(value => {
			if (value === 'HOSPITALIZACIÓN') {
				if (this.authorization.get('informacionMedica').get('tiempoEstadia').disabled) {
					this.authorization.get('informacionMedica').get('tiempoEstadia').enable();
					this.authorization.get('informacionMedica').get('tiempoEstadia').setValue('');
					this.authorization.get('informacionMedica').get('tiempoEstadia').markAsUntouched();
				}
			}
			// tslint:disable-next-line: one-line
			else if (value === 'AMBULATORIO') {
				// this.authorization.get('informacionMedica').get('tiempoEstadia').disable();
				this.authorization.get('informacionMedica').get('tiempoEstadia').setValue(1);
				if (this.authorization.get('informacionMedica').get('tiempoEstadia').value > 1) {
					this.authorization.get('informacionMedica').get('tiempoEstadia').setValue(1);
				}
			}
		});
		//}

		this.authorization.get('informacionAsegurado').get('tipoReclamo').valueChanges.subscribe(value => {

			if (value == 'LOCAL') {
				for (let x = 0; x < this.documentsArray.length; x++) {
					this.authorization.get('files').get(x.toString()).get('indications').setValidators(Validators.required);
					this.authorization.get('files').get(x.toString()).get('indications').updateValueAndValidity();
					// this.authorization.get('files').get(x.toString()).get('indications').markAsUntouched();

					// if (!this.authorization.get('files').get(x.toString()).get('indications').valid) {
					// 	console.log('No es valido indications de la posicion ' + x);
					// }
				}
				// this.authorization.get('informacionAsegurado').get('direccion').setValidators(Validators.required);
				// this.authorization.get('informacionAsegurado').get('direccion').updateValueAndValidity();
				// this.authorization.get('informacionAsegurado').get('direccion').markAsUntouched();

			}
			else if (value == 'INTERNACIONAL') {
				for (let x = 0; x < this.documentsArray.length; x++) {
					this.authorization.get('files').get(x.toString()).get('indications').clearValidators();
					this.authorization.get('files').get(x.toString()).get('indications').updateValueAndValidity();
					// this.authorization.get('files').get(x.toString()).get('indications').markAsUntouched();
				}
				// this.authorization.get('informacionAsegurado').get('direccion').clearValidators();
				// this.authorization.get('informacionAsegurado').get('direccion').updateValueAndValidity();
				// this.authorization.get('informacionAsegurado').get('direccion').markAsUntouched();
			}
			// console.log('Hola, reclamo');
		});
		// console.log(JSON.stringify(this.authorization.value));

		this.authorization.get('informacionMedica').get('nombreServicio').valueChanges.subscribe(value => {
			if (value.toLowerCase() === 'otro') {
				(this.authorization.get('informacionMedica') as
					FormGroup).addControl('specifyOthers', this.fb.control('', Validators.required));
			}
			// tslint:disable-next-line: one-line
			else if (value.toLowerCase() !== 'otro') {
				if (this.authorization.get('informacionMedica').get('specifyOthers')) {
					(this.authorization.get('informacionMedica') as
						FormGroup).removeControl('specifyOthers');
				}
			}
		});

		this.authorization.get('informacionMedica').get('primerosSintomas').get('nombreMedico').valueChanges.subscribe(value => {
			if (value.toLowerCase() === 'otro') {

				this.authorization.get('informacionMedica').get('primerosSintomas').get('telefono').setValue('');
				this.authorization.get('informacionMedica').get('primerosSintomas').get('telefono').markAsUntouched();
				this.authorization.get('informacionMedica').get('primerosSintomas').get('direccion').setValue('');
				this.authorization.get('informacionMedica').get('primerosSintomas').get('telefono').enable();
				this.authorization.get('informacionMedica').get('primerosSintomas').get('direccion').enable();

				(this.authorization.get('informacionMedica').get('primerosSintomas') as
					FormGroup).addControl('specifyOthers', this.fb.control('', Validators.required));

				if (this.authorization.get('informacionMedica').get('isMedicalEqual').value == true
					|| this.authorization.get('informacionMedica').get('isMedicalEqual').value == 'true') {
					(this.authorization.get('informacionMedica').get('admision') as
						FormGroup).addControl('specifyOthers', this.fb.control(''));

					this.otroNombreMedicoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers').valueChanges.subscribe(value => {
						this.authorization.get('informacionMedica').get('admision').get('specifyOthers').setValue(value.toUpperCase());
					});

					this.authorization.get('informacionMedica').get('admision').get('specifyOthers').disable();
				}
			}
			// tslint:disable-next-line: one-line
			else if (value.toLowerCase() !== 'otro') {

				// this.authorization.get('informacionMedica').get('primerosSintomas').get('telefono').disable();
				// this.authorization.get('informacionMedica').get('primerosSintomas').get('direccion').disable();

				if (this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers')) {
					(this.authorization.get('informacionMedica').get('primerosSintomas') as
						FormGroup).removeControl('specifyOthers');
				}
			}
		});

		this.authorization.get('informacionMedica').get('admision').get('nombreMedico').valueChanges.subscribe(value => {
			if (value.toLowerCase() === 'otro') {
				if (this.authorization.get('informacionMedica').get('isMedicalEqual').value == '' ||
					this.authorization.get('informacionMedica').get('isMedicalEqual').value == false) {
					this.authorization.get('informacionMedica').get('admision').get('telefono').setValue('');
					this.authorization.get('informacionMedica').get('admision').get('direccion').setValue('');
					if (this.authorization.get('informacionMedica').get('admision').get('specifyOthers')) {
						this.authorization.get('informacionMedica').get('admision').get('specifyOthers').setValue('');
						this.authorization.get('informacionMedica').get('admision').get('specifyOthers').markAsUntouched();
					}
					this.authorization.get('informacionMedica').get('admision').get('telefono').enable();
					this.authorization.get('informacionMedica').get('admision').get('direccion').enable();
				}

				(this.authorization.get('informacionMedica').get('admision') as
					FormGroup).addControl('specifyOthers', this.fb.control(''));
			}
			// tslint:disable-next-line: one-line
			else if (value.toLowerCase() !== 'otro') {
				// this.authorization.get('informacionMedica').get('admision').get('telefono').disable();
				// this.authorization.get('informacionMedica').get('admision').get('direccion').disable();

				if (this.authorization.get('informacionMedica').get('admision').get('specifyOthers')) {
					(this.authorization.get('informacionMedica').get('admision') as
						FormGroup).removeControl('specifyOthers');
				}
			}
		});
		this.filteredOptionsMedicoTratante = this.authorization.get('informacionMedica').get('primerosSintomas')
			.get('nombreMedico').valueChanges
			.pipe(
				startWith(''),
				map(value => typeof value === 'string' ? value : value),
				map(value => value ? this._filterMedicoTratante(value) : this.doctorNamesTratante.slice())
			);

		this.filteredOptionsMedicoReferente = this.authorization.get('informacionMedica').get('admision')
			.get('nombreMedico').valueChanges
			.pipe(
				startWith(''),
				map(value => typeof value === 'string' ? value : value),
				map(value => value ? this._filterMedicoReference(value) : this.doctorNamesReference.slice())
			);

		this.filteredOptionsCentroServicio = this.authorization.get('informacionMedica')
			.get('nombreServicio').valueChanges
			.pipe(
				startWith(''),
				map(value => typeof value === 'string' ? value : value),
				map(value => value ? this._filterCentroServicios(value) : this.serviceOptions.slice())
			);
	}

	displayFn(user: any) {
		return user ? user : '';
	}

	maxBasedOnCondition() {
		if (this.authorization.get('informacionMedica').get('condicion').value === 'AMBULATORIO') {
			return 1;
		}
	}

	setStep(index: number) {
		this.step = index;
	}

	nextStep() {
		this.step++;

	}

	showWarningDot(form: any): boolean {
		if (!this.ID) {

			if (form.invalid && this.form.submitted) {
				return true;
			} else {
				return false;
			}

		} else {
			if (!form.invalid) {
				return false;
			} else {
				return true;
			}
		}
	}

	private _filter(value: string): any[] {

		if (this.authorization.get('informacionAsegurado').get('filterType').value == 'NOMBRE') {
			const filterValue = value.toLowerCase();

			return this.dataAutoCompleteName.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
		}
		if (this.authorization.get('informacionAsegurado').get('filterType').value == 'ID') {
			const filterValueNumber = value.toString();

			return this.dataAutoCompleteIdNumber.filter(option => option.toString().indexOf(filterValueNumber) === 0);
		}
		if (this.authorization.get('informacionAsegurado').get('filterType').value == 'POLIZA') {
			const filterValue = value.toLowerCase();

			return this.dataAutoCompletePolicy.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
		}

	}

	private _filterMedicoTratante(value: string): any[] {

		const filterValue = value.toLowerCase();

		return this.doctorNamesTratante.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
	}

	private _filterMedicoReference(value: string): any[] {

		const filterValue = value.toLowerCase();

		return this.doctorNamesReference.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
	}
	private _filterCentroServicios(value: string): any[] {

		const filterValue = value.toLowerCase();

		return this.serviceOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
	}

	createFormArray() {
		return this.fb.group({
			medicReport: ['', Validators.required],
			budget: [''],
			studies: ['', Validators.required],
			indications: ['']
		});
	}

	returnAutoCompleteData() {
		this.newAuthorization.getIdNumbers().subscribe(data => {
			console.warn('DATA:', data);
			// tslint:disable-next-line: prefer-for-of
			for (let x = 0; x < data.data.length; x++) {
				// this.dataAutoCompleteIdNumber.push(data.data[x].asegurado.nombres_asegurado +
				// 	' ' + data.data[x].asegurado.apellidos_asegurado + ' - '
				// 	+ data.data[x].asegurado.id_asegurado);

				// this.dataAutoCompleteIdNumberObject.push({
				// 		name: data.data[x].asegurado.nombres_asegurado,
				// 		// id: data.data[x].asegurado.id_asegurado,
				// 		policy: data.data[x].asegurado.no_poliza,
				// 		value: data.data[x].asegurado.id_asegurado
				// 	});
				// this.dataAutoCompleteName.push(data.data[x].asegurado.nombres_asegurado);

				// this.dataAutoCompleteIdNumber.push(data.data[x].asegurado.id_asegurado);

				// this.dataAutoCompletePolicy.push(data.data[x].asegurado.no_poliza);

				// 		console.log(this.dataAutoCompleteName);
				// 		console.log(this.dataAutoCompleteIdNumber);
				// 		console.log(this.dataAutoCompletePolicy);

				// tslint:disable-next-line: prefer-for-of
				for (let y = 0; y < data.data[x].polizas.length; y++) {
					// console.log(data.data[x].polizas[y].ramo.toLocaleLowerCase());
					// console.log(data.data[x].polizas.length);
					// console.log(data.data[x].polizas[y]);
					// console.log((data.data[x].polizas[y].ramo.toLocaleLowerCase().includes('vida')));
					// console.log('hola me llamdo'.includes('hola'));

					if (!(data.data[x].polizas[y].ramo.toLocaleLowerCase().includes('vida'))) {
						// console.log('si incluye vida');
						this.dataAutoCompleteIdNumberObject.push({
							name: data.data[x].asegurado.nombres_asegurado + " " + data.data[x].asegurado.apellidos_asegurado,
							// id: data.data[x].asegurado.id_asegurado,
							policy: data.data[x].asegurado.no_poliza,
							value: data.data[x].asegurado.id_asegurado
						});
						this.dataAutoCompleteName.push(data.data[x].asegurado.nombres_asegurado + " " + data.data[x].asegurado.apellidos_asegurado);

						this.dataAutoCompleteIdNumber.push(data.data[x].asegurado.id_asegurado);

						this.dataAutoCompletePolicy.push(data.data[x].asegurado.no_poliza);

						//NO BORRAR, estas lineas de código son para eliminar las posiciones repetidas.
						this.dataAutoCompletePolicy = this.dataAutoCompletePolicy.reduce((unique, o) => {
							if(!unique.some(obj => obj === o)) {
							  unique.push(o);
							}
							return unique;
						  },[]);
						// console.log(this.dataAutoCompleteName);
						// console.log(this.dataAutoCompleteIdNumber);
						// console.log(this.dataAutoCompletePolicy);

					}

					// if ((data.data[x].polizas[y].ramo.toLocaleLowerCase().includes('vida')) == false) {
					// 	console.log('NO incluye vida');
					// 	}
				}

			}
			this.appComponent.showOverlay = false;
			this.timeAutoComplete = 1;
		});
	}

	returnServiceCenters() {
		this.newAuthorization.getServiceCenters().subscribe(data => {
			console.log(data);
			// tslint:disable-next-line: prefer-for-of
			for (let x = 0; x < data.data.length; x++) {
				// this.serviceOptions.push({
				// 	value: data.data[x].nombre,
				// 	viewValue: data.data[x].nombre
				// });
				this.serviceOptions.push(data.data[x].nombre);
			}
			this.serviceOptions.push('OTRO');
		});
	}

	returnDoctors() {
		this.newAuthorization.getDoctors().subscribe(data => {
			console.log(data);
			// tslint:disable-next-line: prefer-for-of
			for (let x = 0; x < data.data.length; x++) {
				this.doctorNames.push({
					value: data.data[x].nombre + ' - ' + data.data[x].especialidad,
					viewValue: data.data[x].nombre + ' - ' + data.data[x].especialidad,
					address: data.data[x].centro_medico,
					number: data.data[x].telefono
				});

				this.doctorNamesTratante.push(data.data[x].nombre + ' - ' + data.data[x].especialidad);
				this.doctorNamesReference.push(data.data[x].nombre + ' - ' + data.data[x].especialidad);
			}
			this.doctorNamesTratante.push('OTRO');
			this.doctorNamesReference.push('OTRO');
		});
	}

	ngDoCheck() {

		if (this.ID != null) {

			if (this.authorization.get('informacionMedica').get('admision').get('nombreMedico').enable
			) {
				if (this.authorization.get('informacionMedica').get('isMedicalEqual').value == true
					|| this.authorization.get('informacionMedica').get('isMedicalEqual').value == 'true') {

					if (this.varIsMedical == 0) {

						this.authorization.get('informacionMedica').get('admision').get('nombreMedico').disable();
						this.authorization.get('informacionMedica').get('admision').get('telefono').disable();
						this.authorization.get('informacionMedica').get('admision').get('direccion').disable();
						if (this.authorization.get('informacionMedica').get('admision').get('specifyOthers')) {
							this.authorization.get('informacionMedica').get('admision').get('specifyOthers').disable();
						}

						this.nombreMedicoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('nombreMedico').valueChanges.subscribe(value => {
							this.authorization.get('informacionMedica').get('admision').get('nombreMedico').setValue(value.toUpperCase());
						});
						this.telefonoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('telefono').valueChanges.subscribe(value => {
							this.authorization.get('informacionMedica').get('admision').get('telefono').setValue(value.toUpperCase());
						});
						this.direccionSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('direccion').valueChanges.subscribe(value => {
							this.authorization.get('informacionMedica').get('admision').get('direccion').setValue(value.toUpperCase());
						});

						if (this.authorization.get('informacionMedica').get('admision').get('specifyOthers') &&
							!this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers')) {

							(this.authorization.get('informacionMedica').get('admision') as FormGroup).removeControl('specifyOthers');
						}
						else if (this.authorization.get('informacionMedica').get('admision').get('specifyOthers') &&
							this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers')) {

							this.otroNombreMedicoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers').valueChanges.subscribe(value => {
								this.authorization.get('informacionMedica').get('admision').get('specifyOthers').setValue(value.toUpperCase());
							});

							this.authorization.get('informacionMedica').get('admision').get('specifyOthers').disable();
						}
						else if (!this.authorization.get('informacionMedica').get('admision').get('specifyOthers') &&
							this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers')) {

							(this.authorization.get('informacionMedica').get('admision') as
								FormGroup).addControl('specifyOthers', this.fb.control(''));

							this.otroNombreMedicoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers').valueChanges.subscribe(value => {
								this.authorization.get('informacionMedica').get('admision').get('specifyOthers').setValue(value.toUpperCase());
							});

							this.authorization.get('informacionMedica').get('admision').get('specifyOthers').disable();
						}

						this.varIsMedical++;
					}
				}
				// 	else {
				// 		this.nombreMedicoSB.unsubscribe();
				// 		this.telefonoSB.unsubscribe();
				// 		this.direccionSB.unsubscribe();
				// }
			}
		}
	}

	fileNameWatcher(type?: string, i?) {
		if (this.filesInformation) {
			if (this.filesInformation[i]) {
				if (this.filesInformation[i][type + 'Url'] && this.authorization.get('files').get(i.toString()).get(type).value !== '') {
					return this.filesInformation[i][type + 'Url'];
				}
			}
		}
	}

	onFileChange(event, formName, i) {
		const reader = new FileReader();
		// console.log(this.authorization.get('files'));
		// console.log('event.targe: ', event.target.files);
		console.log('event: ', event, 'formName: ', formName, 'i: ', i);

		if (event.target.files && event.target.files.length) {
			const [file] = event.target.files;
			reader.readAsDataURL(file);

			reader.onload = () => {
				this.authorization.get('files').get(i.toString()).patchValue({
					[formName]: reader.result
				});
				this.cd.markForCheck();
			};
		}
	}

	addToList() {
		this.documentsArray.push(this.createFormArray());
		if (this.authorization.get('informacionAsegurado').get('tipoReclamo').value == 'LOCAL') {
			for (let x = 0; x < this.documentsArray.length; x++) {
				this.authorization.get('files').get(x.toString()).get('indications').setValidators(Validators.required);
				this.authorization.get('files').get(x.toString()).get('indications').updateValueAndValidity();
				// this.authorization.get('files').get(x.toString()).get('indications').markAsUntouched();
			}
		}
		else if (this.authorization.get('informacionAsegurado').get('tipoReclamo').value == 'INTERNACIONAL') {
			for (let x = 0; x < this.documentsArray.length; x++) {
				this.authorization.get('files').get(x.toString()).get('indications').clearValidators();
				this.authorization.get('files').get(x.toString()).get('indications').updateValueAndValidity();
				// this.authorization.get('files').get(x.toString()).get('indications').markAsUntouched();
			}
		}
		console.log(JSON.stringify(this.authorization.value));
	}

	removeToList(index) {
		this.documentsArray.removeAt(index);
	}

	clearArchives(formName, index) {
		// this.authorization.get('files').get(index.toString()).get(formName).reset();
		// this.authorization.get('files').get(index.toString()).get(formName).setValue('');
		// this.authorization.get('diagnosticos').get(index.toString()).get('files').get(formName).setValue('');
		formName.setValue('');
	}

	selectionDoctor(event, group, name?) {

		const addForm = group as FormGroup;

		if (event.option.value.toLowerCase() != 'otro') {
			let Doctor;

			// if (addForm.get('specifyOthers')) {
			// 	addForm.removeControl('specifyOthers');
			// }
			if (name != 'nombreServicio') {
				Doctor = this.doctorNames.find(nombre => nombre.value == event.option.value);
				// group.get('direccion').disable();
				// group.get('telefono').disable();
				group.get('direccion').setValue(Doctor.address);
				group.get('telefono').setValue(Doctor.number);
			}
		}
		else if (event.option.value.toLowerCase() == 'otro') {
			if (!addForm.get('specifyOthers')) {
				if (group == "authorization.get('informacionMedica').get('admision')") {
					addForm.addControl('specifyOthers', this.fb.control(''));
				}
				else {
					addForm.addControl('specifyOthers', this.fb.control('', Validators.required));
				}
			}
			if (name != 'nombreServicio') {
				group.get('direccion').setValue('');
				group.get('telefono').setValue('');
				group.get('telefono').markAsUntouched();
				group.get('direccion').enable();
				group.get('telefono').enable();
			}
		}

		console.log(event);
	}

	searchIdNumber(idNumber: string) {

		let idNumberObject;

		if (idNumber != '' && idNumber != null && idNumber != undefined) {

			if (this.authorization.get('informacionAsegurado').get('filterType').value == 'NOMBRE') {
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
			if (this.authorization.get('informacionAsegurado').get('filterType').value == 'ID') {
				this.searchIdNumberAccess = true;
				idNumber = (idNumber).toString();
			}
			if (this.authorization.get('informacionAsegurado').get('filterType').value == 'POLIZA' && this.idNumber2Options.length == 0) {
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
						this.authorization.get('informacionAsegurado').get('idNumber2').setValue('');
						this.authorization.get('informacionAsegurado').get('idNumber2').markAsUntouched();

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

			if (this.authorization.get('informacionAsegurado').get('idNumber2').value != '' && this.idNumber2FieldVisible == true) {
				this.searchIdNumberAccess = true;
				const idNumber2Value = this.authorization.get('informacionAsegurado').get('idNumber2').value;

				idNumberObject = this.dataAutoCompleteIdNumberObject.find(nombre =>
					nombre.name == idNumber2Value);
				idNumber = (idNumberObject.value).toString();
			}

			// const idNumberObject = this.dataAutoCompleteIdNumberObject.find(nombre =>
			// 	nombre.name == idNumber);
			// // console.log(idNumberObject);
			// idNumber = (idNumberObject.value).toString();
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

							this.authorization.get('informacionAsegurado').get('nombres').setValue(response.data.asegurado.nombres_asegurado);
							this.authorization.get('informacionAsegurado').get('apellidos').setValue(response.data.asegurado.apellidos_asegurado);
							// this.authorization.get('informacionAsegurado').get('noPoliza').setValue(response.data.asegurado.no_poliza);
							this.authorization.get('idNumber').setValue(response.data.asegurado.id_asegurado);

							if (this.dataAutoCompleteIdNumberObject.find(nombre => nombre.name == (this.authorization.get('informacionAsegurado').get('nombres').value + ' ' + this.authorization.get('informacionAsegurado').get('apellidos').value))) {
								console.log('el nombre de response.data es igual a nombre.name');
								console.log(this.dataAutoCompleteIdNumberObject.find(nombre => nombre.name == (this.authorization.get('informacionAsegurado').get('nombres').value + ' ' + this.authorization.get('informacionAsegurado').get('apellidos').value)).policy);
								this.authorization.get('informacionAsegurado').get('noPoliza').setValue(this.dataAutoCompleteIdNumberObject.find(nombre => nombre.name == (this.authorization.get('informacionAsegurado').get('nombres').value + ' ' + this.authorization.get('informacionAsegurado').get('apellidos').value)).policy);
							}

							switch (response.data.asegurado.sexo) {
								case 'M':
									this.authorization.get('informacionAsegurado').get('sexo').setValue('MASCULINO');
									break;

								case 'F':
									this.authorization.get('informacionAsegurado').get('sexo').setValue('FEMENINO');
									break;
								default:
									break;
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

							this.authorization.get('informacionAsegurado').get('nombres').setValue('');
							this.authorization.get('informacionAsegurado').get('apellidos').setValue('');
							this.authorization.get('informacionAsegurado').get('noPoliza').setValue('');
							this.authorization.get('informacionAsegurado').get('sexo').setValue('');

						}
					});
			}
		}
	}

	canDeactivate(): Observable<boolean> | boolean {
		if (this.form.submitted) {
			return true;
		}

		if (this.authorization.dirty && !this.form.submitted) {
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

	ngOnDestroy(): void {
		this.isMedicalEqualSB.unsubscribe();

		if (this.nombreMedicoSB !== undefined) {
			this.nombreMedicoSB.unsubscribe();
		}
		if (this.telefonoSB !== undefined) {
			this.telefonoSB.unsubscribe();
		}

		if (this.direccionSB !== undefined) {
			this.direccionSB.unsubscribe();
		}

		if (this.otroNombreMedicoSB !== undefined) {
			this.otroNombreMedicoSB.unsubscribe();
		}
	}

	getData(id) {
		this.appComponent.showOverlay = true;
		this.newAuthorization.returnData(id).subscribe(data => {
			console.log(data);
			this.showContent = true;
			this.authorization.get('informacionAsegurado').get('idNumber').disable();
			this.authorization.get('informacionAsegurado').get('filterType').disable();
			this.authorization.get('informacionAsegurado').get('idNumber2').disable();

			switch (data.data.informacionAsegurado.sexo) {
				case 'M':
					this.authorization.get('informacionAsegurado').get('sexo').setValue('MASCULINO');
					break;

				case 'F':
					this.authorization.get('informacionAsegurado').get('sexo').setValue('FEMENINO');
					break;
				default:
					break;
			}

			if (this.authorization.get('countryRoleCode')) { this.authorization.get('countryRoleCode').setValidators(null); }


			this.authorization['controls'].fecha.setValue(data.data.fecha);
			this.authorization['controls'].idNumber.setValue(data.data.idNumber);
			this.authorization['controls'].informacionAsegurado['controls'].tipoReclamo.setValue(data.data.informacionAsegurado.tipoReclamo);
			//this.authorization['controls'].informacionAsegurado['controls'].tipoReclamoMoneda.setValue(data.data.tipoReclamoMoneda);
			this.authorization['controls'].informacionAsegurado['controls'].nombres.setValue(data.data.informacionAsegurado.nombres);
			this.authorization['controls'].informacionAsegurado['controls'].apellidos.setValue(data.data.informacionAsegurado.apellidos);
			this.authorization['controls'].informacionAsegurado['controls'].noPoliza.setValue(data.data.informacionAsegurado.noPoliza);
			this.authorization['controls'].informacionAsegurado['controls'].filterType.setValue(data.data.informacionAsegurado.filterType);
			this.authorization['controls'].informacionAsegurado['controls'].idNumber.setValue(data.data.informacionAsegurado.idNumber);

			this.authorization.get('informacionAsegurado').get('idNumber2').clearValidators();
			this.authorization.get('informacionAsegurado').get('idNumber2').updateValueAndValidity();

			if (data.data.informacionAsegurado.idNumber2 != '') {
				console.log('Entro');
				this.idNumber2Options.push({
					value: data.data.informacionAsegurado.idNumber2,
					viewValue: data.data.informacionAsegurado.idNumber2,
					policy: data.data.informacionAsegurado.noPoliza
				});
				this.authorization.get('informacionAsegurado').get('idNumber2').setValue(data.data.informacionAsegurado.idNumber2);
				this.idNumber2FieldVisible = true;
			}

			this.authorization['controls'].informacionAsegurado['controls'].sexo.setValue(data.data.informacionAsegurado.sexo);
			this.authorization['controls'].informacionAsegurado['controls'].correo.setValue(data.data.informacionAsegurado.correo);
			this.authorization['controls'].informacionAsegurado['controls'].direccion.setValue(data.data.informacionAsegurado.direccion);
			this.authorization['controls'].informacionAsegurado['controls'].telefonoResidencia.setValue(data.data.informacionAsegurado.telefonoResidencia);
			this.authorization['controls'].informacionAsegurado['controls'].telefonoCelular.setValue(data.data.informacionAsegurado.telefonoCelular);
			this.authorization['controls'].informacionAsegurado['controls'].telefonoOficina.setValue(data.data.informacionAsegurado.telefonoOficina);
			this.authorization['controls'].informacionAsegurado['controls'].otroSeguro.setValue(data.data.informacionAsegurado.otroSeguro);
			this.authorization['controls'].informacionMedica['controls'].diagnostico.setValue(data.data.informacionMedica.diagnostico);
			this.authorization['controls'].informacionMedica['controls'].condicion.setValue(data.data.informacionMedica.condicion);
			this.authorization['controls'].informacionMedica['controls'].procedimiento.setValue(data.data.informacionMedica.procedimiento);
			// this.authorization['controls'].informacionMedica['controls'].monto.setValue(data.data.informacionMedica.monto)
			this.authorization['controls'].informacionMedica['controls'].primerosSintomas['controls'].fecha.setValue(data.data.informacionMedica.primerosSintomas.fecha);
			this.authorization['controls'].informacionMedica['controls'].primerosSintomas['controls'].nombreMedico.setValue(data.data.informacionMedica.primerosSintomas.nombreMedico);
			this.authorization['controls'].informacionMedica['controls'].primerosSintomas['controls'].direccion.setValue(data.data.informacionMedica.primerosSintomas.direccion);
			this.authorization['controls'].informacionMedica['controls'].primerosSintomas['controls'].telefono.setValue(data.data.informacionMedica.primerosSintomas.telefono);
			if (data.data.informacionMedica.primerosSintomas.nombreMedico.toLowerCase() == 'otro') {
				(this.authorization.get('informacionMedica').get('primerosSintomas') as
					FormGroup).addControl('specifyOthers', this.fb.control('', Validators.required));
				console.log(data.data.informacionMedica.primerosSintomas);
				this.authorization['controls'].informacionMedica['controls'].primerosSintomas['controls'].specifyOthers.setValue(data.data.informacionMedica.primerosSintomas.specifyOthers);
				// this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers').markAsTouched();
				// this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers').updateValueAndValidity();
			}
			this.authorization['controls'].informacionMedica['controls'].admision['controls'].fecha.setValue(data.data.informacionMedica.admision.fecha);
			this.authorization['controls'].informacionMedica['controls'].admision['controls'].nombreMedico.setValue(data.data.informacionMedica.admision.nombreMedico);
			this.authorization['controls'].informacionMedica['controls'].admision['controls'].direccion.setValue(data.data.informacionMedica.admision.direccion);
			this.authorization['controls'].informacionMedica['controls'].admision['controls'].telefono.setValue(data.data.informacionMedica.admision.telefono);
			console.log('Aqui como la ley 2');
			console.log(data.data.informacionMedica.admision.nombreMedico.toLowerCase());
			if (data.data.informacionMedica.admision.nombreMedico.toLowerCase() == 'otro') {
				console.log('Aqui como la ley');
				(this.authorization.get('informacionMedica').get('admision') as
					FormGroup).addControl('specifyOthers', this.fb.control(''));
				this.authorization['controls'].informacionMedica['controls'].admision['controls'].specifyOthers.setValue(data.data.informacionMedica.admision.specifyOthers);
				// this.authorization.get('informacionMedica').get('admision').get('specifyOthers').markAsTouched();
				// this.authorization.get('informacionMedica').get('admision').get('specifyOthers').updateValueAndValidity();
			}
			this.authorization['controls'].informacionMedica['controls'].tiempoEstadia.setValue(data.data.informacionMedica.tiempoEstadia);
			this.authorization['controls'].informacionMedica['controls'].nombreServicio.setValue(data.data.informacionMedica.nombreServicio);
			if (data.data.informacionMedica.nombreServicio.toLowerCase() == 'otro') {
				(this.authorization.get('informacionMedica') as
					FormGroup).addControl('specifyOthers', this.fb.control('', Validators.required));
				this.authorization['controls'].informacionMedica['controls'].specifyOthers.setValue(data.data.informacionMedica.specifyOthers);
				// this.authorization.get('informacionMedica').get('specifyOthers').markAsTouched();
				// this.authorization.get('informacionMedica').get('specifyOthers').updateValueAndValidity();
			}
			this.authorization['controls'].informacionMedica['controls'].isMedicalEqual.setValue(data.data.informacionMedica.isMedicalEqual);
			this.authorization['controls'].informacionMedica['controls'].autorizacion.setValue(data.data.informacionMedica.autorizacion);

			if (this.authorization.get('informacionMedica').get('isMedicalEqual').value == 'false') {
				this.authorization.get('informacionMedica').get('isMedicalEqual').setValue('');
			}

			// this.authorization['controls'].files['controls'].medicReport.setValue(data.data.files.medicReport);
			this.documentsArray = this.authorization.get('files') as FormArray;

			if (data.data.files) {
				this.filesInformation = data.data.files;
				console.log(this.filesInformation);

				// tslint:disable-next-line: prefer-for-of
				for (let x = 0; x < data.data.files.length; x++) {

					if (x >= 1) {
						this.addToList();
					}

					const formID7 = this.authorization.get('files').get(x.toString()) as FormGroup;
					formID7.addControl('id', this.fb.control(data.data.files[x].id,
						Validators.required));

					if (data.data.files[x].medicReport) {
						this.authorization.get('files').get(x.toString()).patchValue({
							medicReport: data.data.files[x].medicReport
						});
					}
					if (data.data.files[x].budget) {
						this.authorization.get('files').get(x.toString()).patchValue({
							budget: data.data.files[x].budget
						});
					}
					if (data.data.files[x].studies) {
						this.authorization.get('files').get(x.toString()).patchValue({
							studies: data.data.files[x].studies
						});
					}
					if (data.data.files[x].indications) {
						this.authorization.get('files').get(x.toString()).patchValue({
							indications: data.data.files[x].indications
						});
					}
				}
			}

			// this.authorization['controls'].files['controls'].studies.setValue(data.data.files.studies);
			// this.authorization['controls'].files['controls'].indication.setValue(data.data.files.indication);

			if (data.data.informacionAsegurado.otroSeguro === 'SI') {
				const form = this.authorization.get('informacionAsegurado') as FormGroup;
				form.addControl('seguro', this.fb.group({
					nombre: ['', Validators.required],
					noPoliza: ['', Validators.required],
					fecha: ['', Validators.required],
					suma: ['', [Validators.min(1)]],
				}));
				this.authorization['controls'].informacionAsegurado['controls'].seguro['controls'].nombre.setValue(data.data.informacionAsegurado.seguro.nombre);
				this.authorization['controls'].informacionAsegurado['controls'].seguro['controls'].noPoliza.setValue(data.data.informacionAsegurado.seguro.noPoliza);
				this.authorization['controls'].informacionAsegurado['controls'].seguro['controls'].fecha.setValue(data.data.informacionAsegurado.seguro.fecha);
				this.authorization['controls'].informacionAsegurado['controls'].seguro['controls'].suma.setValue(data.data.informacionAsegurado.seguro.suma);

				// console.log(JSON.stringify(this.authorization.value));
			} else if (data.data.informacionAsegurado.otroSeguro === 'NO') {
				console.log('No hay que crear el control');
			}

			const formID1 = this.authorization as FormGroup;
			formID1.addControl('id', this.fb.control(data.data.id, Validators.required));
			// formID1.addControl('informacionAseguradoId', this.fb.control(data.data.informacionAseguradoId, Validators.required));
			// formID1.addControl('informacionMedicaId', this.fb.control(data.data.informacionMedicaId, Validators.required));

			const formID2 = this.authorization.get('informacionAsegurado') as FormGroup;
			formID2.addControl('id', this.fb.control(data.data.informacionAsegurado.id, Validators.required));

			const formID3 = this.authorization.get('informacionMedica') as FormGroup;
			// formID3.addControl('admisionId', this.fb.control(data.data.informacionMedica.admisionId, Validators.required));
			formID3.addControl('id', this.fb.control(data.data.informacionMedica.id, Validators.required));
			// formID3.addControl('primerosSintomasId', this.fb.control(data.data.informacionMedica.primerosSintomasId, Validators.required));

			const formID4 = this.authorization.get('informacionMedica').get('admision') as FormGroup;
			formID4.addControl('id', this.fb.control(data.data.informacionMedica.admision.id, Validators.required));

			if (this.authorization.get('informacionAsegurado').get('seguro')) {
				const formID5 = this.authorization.get('informacionAsegurado').get('seguro') as FormGroup;
				formID5.addControl('id', this.fb.control(data.data.informacionAsegurado.seguro.id, Validators.required));
			}

			const formID6 = this.authorization.get('informacionMedica').get('primerosSintomas') as FormGroup;
			formID6.addControl('id', this.fb.control(data.data.informacionMedica.primerosSintomas.id, Validators.required));

			console.log(JSON.stringify(this.authorization.value));

			this.authorization.get('informacionMedica').get('condicion').valueChanges.subscribe(value => {
				if (value === 'HOSPITALIZACIÓN') {
					if (this.authorization.get('informacionMedica').get('tiempoEstadia').disabled) {
						this.authorization.get('informacionMedica').get('tiempoEstadia').enable();
						this.authorization.get('informacionMedica').get('tiempoEstadia').setValue('');
						this.authorization.get('informacionMedica').get('tiempoEstadia').markAsUntouched();
					}
				}
				// tslint:disable-next-line: one-line
				else if (value === 'AMBULATORIO') {
					// this.authorization.get('informacionMedica').get('tiempoEstadia').disable();
					if (this.authorization.get('informacionMedica').get('tiempoEstadia').value > 1) {
						this.authorization.get('informacionMedica').get('tiempoEstadia').setValue(1);
					}
				}
			});

			if (this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers')) {
				this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers').markAsTouched();
				this.authorization.get('informacionMedica').get('primerosSintomas').get('specifyOthers').updateValueAndValidity();
			}

			if (this.authorization.get('informacionMedica').get('admision').get('specifyOthers')) {
				this.authorization.get('informacionMedica').get('admision').get('specifyOthers').markAsTouched();
				this.authorization.get('informacionMedica').get('admision').get('specifyOthers').updateValueAndValidity();
			}

			if (this.authorization.get('informacionMedica').get('specifyOthers')) {
				this.authorization.get('informacionMedica').get('specifyOthers').markAsTouched();
				this.authorization.get('informacionMedica').get('specifyOthers').updateValueAndValidity();
			}

			this.authorization.markAllAsTouched();
			this.authorization.updateValueAndValidity();
		});
		setTimeout(() => {
			this.appComponent.showOverlay = false;
		},
			10000);
		this.newAuthorization.id = null;
		console.log('this.newAuthorization.id es igual a ' + this.newAuthorization.id);


	}

	sendForm(form: FormGroup, formType: string, sendType: string, id?: number) {
		console.log(id);

		this.formHandler.sendForm(form, formType, sendType, this.appComponent, id);

	}
}
