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
		private cd: ChangeDetectorRef
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

	timeAutoComplete = 0;

	filesInformation: Observable<any>;
	documentsArray: FormArray;

	filterOptions: FieldConfig = {
			label: 'Filtro',
			options: [
				{
					value: 'nombre',
					viewValue: 'Nombre'
				},
				{
					value: 'id',
					viewValue: 'ID'
				},
				{
					value: 'poliza',
					viewValue: 'No. de Póliza'
				}
			]
		};

	seguros: FieldConfig = {
		label: '¿Tiene otro seguro de salud?',
		options: [
			{
				value: 'si',
				viewValue: 'Si'
			},
			{
				value: 'no',
				viewValue: 'No'
			}
		]
	};

	autorizacionOptions: FieldConfig = {
		label: '',
		options: [
			{
				value: 'si',
				viewValue: 'Si'
			},
			{
				value: 'no',
				viewValue: 'No'
			}
		]
	};

	generos: FieldConfig = {
		label: 'Sexo',
		options: [
			{
				value: 'femenino',
				viewValue: 'Femenino'
			},
			{
				value: 'masculino',
				viewValue: 'Masculino'
			}
		]
	};

	condiciones: FieldConfig = {
		label: 'La condición se trata de: ',
		options: [
			{
				value: 'hospitalizacion',
				viewValue: 'Hospitalización'
			},
			{
				value: 'ambulatorio',
				viewValue: 'Ambulatorio'
			}
		]
	};

	authorization: FormGroup;

	ID = null;
	isMedicalEqualSB: any;
	nombreMedicoSB: any;
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

		if (event.valor === 'si') {
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
		} else if (event.valor === 'no') {
			switch (event.name) {
				case 'otroSeguro':
					form.removeControl('seguro');
					break;
				default:
					break;
			}
		}

		// if (event.valor === 'ambulatorio') {
		// 	this.authorization.get('informacionMedica').get('tiempoEstadia').setValue(1);
		// }
	}
	ngOnInit() {

		this.appComponent.showOverlay = true;
		this.returnAutoCompleteData();

		// setTimeout(() => {
		// 	this.appComponent.showOverlay = true;
		// });
		// setTimeout(() => {

		// 	this.route.params.subscribe(res => {
		// 		this.ID = res.id;
		// 	});

		// 	// this.ID = this.newAuthorization.id;
		// 	if (this.ID != null) {
		// 		console.log('El ID es ' + this.ID);
		// 		this.getData(this.ID);
		// 	} else if (this.ID == null) {
		// 		console.log('ID esta vacio');
		// 	}

		// 	console.log(this.filesInformation);

		// 	this.authorization = this.fb.group({
		// 		fecha: [new Date(), Validators.required],
		// 		informacionAsegurado: this.fb.group({
		// 			nombres: [{ value: '', disabled: true }, [Validators.required]],
		// 			apellidos: [{ value: '', disabled: true }, [Validators.required]],
		// 			noPoliza: [{ value: '', disabled: true }, [Validators.required]],
		// 			idNumber: ['', Validators.required],
		// 			sexo: [{ value: '', disabled: true }, [Validators.required]],
		// 			correo: ['', Validators.required],
		// 			direccion: ['', Validators.required],
		// 			telefonoResidencia: [''],
		// 			telefonoCelular: ['', Validators.required],
		// 			telefonoOficina: [''],
		// 			otroSeguro: ['', Validators.required],
		// 		}),
		// 		informacionMedica: this.fb.group({
		// 			diagnostico: ['', Validators.required],
		// 			condicion: ['', Validators.required],
		// 			procedimiento: ['', Validators.required],
		// 			primerosSintomas: this.fb.group({
		// 				fecha: ['', Validators.required],
		// 				nombreMedico: ['', Validators.required],
		// 				direccion: [''],
		// 				telefono: ['', Validators.required],
		// 			}),
		// 			admision: this.fb.group({
		// 				fecha: ['', Validators.required],
		// 				nombreMedico: ['', Validators.required],
		// 				direccion: [''],
		// 				telefono: ['', Validators.required],
		// 			}),
		// 			tiempoEstadia: ['', Validators.required],
		// 			nombreServicio: ['', Validators.required],
		// 			isMedicalEqual: [''],
		// 			// direccion: ['', Validators.required],
		// 			// telefono: ['', Validators.required],
		// 		}),
		// 		files: this.fb.group({
		// 			medicReport: [''],
		// 			studies: [''],
		// 			indication: [''],
		// 		}),
		// 		isComplete: [false, Validators.required]

		// 	});

		// 	this.isMedicalEqualSB = this.authorization.get('informacionMedica').get('isMedicalEqual').valueChanges.subscribe(response => {
		// 		switch (response) {
		// 			case true:
		// 				this.authorization.get('informacionMedica').get('admision').get('nombreMedico').setValue(this.authorization.get('informacionMedica').get('primerosSintomas').get('nombreMedico').value);
		// 				this.authorization.get('informacionMedica').get('admision').get('telefono').setValue(this.authorization.get('informacionMedica').get('primerosSintomas').get('telefono').value);
		// 				this.authorization.get('informacionMedica').get('admision').get('direccion').setValue(this.authorization.get('informacionMedica').get('primerosSintomas').get('direccion').value);

		// 				this.nombreMedicoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('nombreMedico').valueChanges.subscribe(value => {
		// 					this.authorization.get('informacionMedica').get('admision').get('nombreMedico').setValue(value);
		// 				});

		// 				this.telefonoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('telefono').valueChanges.subscribe(value => {
		// 					this.authorization.get('informacionMedica').get('admision').get('telefono').setValue(value);
		// 				});

		// 				this.direccionSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('direccion').valueChanges.subscribe(value => {
		// 					this.authorization.get('informacionMedica').get('admision').get('direccion').setValue(value);
		// 				});

		// 				this.authorization.get('informacionMedica').get('admision').get('nombreMedico').disable();
		// 				this.authorization.get('informacionMedica').get('admision').get('telefono').disable();
		// 				this.authorization.get('informacionMedica').get('admision').get('direccion').disable();
		// 				break;

		// 			case false:
		// 				this.nombreMedicoSB.unsubscribe();
		// 				this.telefonoSB.unsubscribe();
		// 				this.direccionSB.unsubscribe();

		// 				this.authorization.get('informacionMedica').get('admision').get('nombreMedico').enable();
		// 				this.authorization.get('informacionMedica').get('admision').get('telefono').enable();
		// 				this.authorization.get('informacionMedica').get('admision').get('direccion').enable();

		// 				break;

		// 			default:
		// 				break;
		// 		}
		// 	});

		// 	// tslint:disable-next-line: align
		// 	this.filteredOptions = this.authorization.get('informacionAsegurado').get('idNumber').valueChanges
		// 		.pipe(
		// 			startWith(''),
		// 			map(value => typeof value === 'string' ? value : value),
		// 			map(value => value ? this._filter(value) : this.dataAutoCompleteIdNumber.slice())
		// 		);

		// 	this.appComponent.showOverlay = false;

		// 	this.timeAutoComplete = 1;
		// }, 15000);

		this.route.params.subscribe(res => {
			this.ID = res.id;
		});

		// this.ID = this.newAuthorization.id;
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
				nombres: [{ value: '', disabled: true }, [Validators.required]],
				apellidos: [{ value: '', disabled: true }, [Validators.required]],
				noPoliza: [{ value: '', disabled: true }, [Validators.required]],
				filterType: ['', Validators.required],
				idNumber: ['', Validators.required],
				sexo: [{ value: '', disabled: true }, [Validators.required]],
				correo: [''],
				direccion: [''],
				telefonoResidencia: [''],
				telefonoCelular: [''],
				telefonoOficina: [''],
				otroSeguro: ['', Validators.required],
			}),
			informacionMedica: this.fb.group({
				diagnostico: ['', Validators.required],
				condicion: ['', Validators.required],
				procedimiento: ['', Validators.required],
				monto: ['', [Validators.required, Validators.min(1)]],
				primerosSintomas: this.fb.group({
					fecha: ['', Validators.required],
					nombreMedico: ['', Validators.required],
					direccion: [''],
					telefono: ['', Validators.required],
				}),
				admision: this.fb.group({
					fecha: ['',  Validators.required],
					nombreMedico: [''],
					direccion: [''],
					telefono: [''],
				}),
				tiempoEstadia: ['', Validators.required],
				nombreServicio: ['', Validators.required],
				isMedicalEqual: [''],
				// direccion: ['', Validators.required],
				// telefono: ['', Validators.required],
				autorizacion: ['', Validators.required]
			}),
			files: this.fb.array([this.createFormArray()]),
			isComplete: [false, Validators.required]

		});

		this.documentsArray = this.authorization.get('files') as FormArray;

		this.isMedicalEqualSB = this.authorization.get('informacionMedica').get('isMedicalEqual').valueChanges.subscribe(response => {
			switch (response) {
				case true:
					this.authorization.get('informacionMedica').get('admision').get('nombreMedico').setValue(this.authorization.get('informacionMedica').get('primerosSintomas').get('nombreMedico').value);
					this.authorization.get('informacionMedica').get('admision').get('telefono').setValue(this.authorization.get('informacionMedica').get('primerosSintomas').get('telefono').value);
					this.authorization.get('informacionMedica').get('admision').get('direccion').setValue(this.authorization.get('informacionMedica').get('primerosSintomas').get('direccion').value);

					this.nombreMedicoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('nombreMedico').valueChanges.subscribe(value => {
						this.authorization.get('informacionMedica').get('admision').get('nombreMedico').setValue(value);
					});

					this.telefonoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('telefono').valueChanges.subscribe(value => {
						this.authorization.get('informacionMedica').get('admision').get('telefono').setValue(value);
					});

					this.direccionSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('direccion').valueChanges.subscribe(value => {
						this.authorization.get('informacionMedica').get('admision').get('direccion').setValue(value);
					});

					this.authorization.get('informacionMedica').get('admision').get('nombreMedico').disable();
					this.authorization.get('informacionMedica').get('admision').get('telefono').disable();
					this.authorization.get('informacionMedica').get('admision').get('direccion').disable();
					break;

				case false:
					this.nombreMedicoSB.unsubscribe();
					this.telefonoSB.unsubscribe();
					this.direccionSB.unsubscribe();

					this.authorization.get('informacionMedica').get('admision').get('nombreMedico').enable();
					this.authorization.get('informacionMedica').get('admision').get('telefono').enable();
					this.authorization.get('informacionMedica').get('admision').get('direccion').enable();

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
		this.authorization.get('informacionAsegurado').get('filterType').valueChanges.subscribe( valueFilter => {

				this.authorization.get('informacionAsegurado').get('idNumber').setValue('');
				this.authorization.get('informacionAsegurado').get('idNumber').markAsUntouched();

				if (valueFilter == 'nombre') {
					this.filteredOptions = this.authorization.get('informacionAsegurado').get('idNumber').valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value),
						map(value => value ? this._filter(value) : this.dataAutoCompleteName.slice())
					);
				}
				if (valueFilter == 'id') {
					this.filteredOptions = this.authorization.get('informacionAsegurado').get('idNumber').valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value),
						map(value => value ? this._filter(value) : this.dataAutoCompleteIdNumber.slice())
					);
				}
				if (valueFilter == 'poliza') {
					this.filteredOptions = this.authorization.get('informacionAsegurado').get('idNumber').valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value),
						map(value => value ? this._filter(value) : this.dataAutoCompletePolicy.slice())
					);
				}
			});

		this.authorization.get('informacionMedica').get('condicion').valueChanges.subscribe(value => {
				if (value == 'hospitalizacion') {
					if (this.authorization.get('informacionMedica').get('tiempoEstadia').disabled) {
						this.authorization.get('informacionMedica').get('tiempoEstadia').enable();
						this.authorization.get('informacionMedica').get('tiempoEstadia').setValue('');
						this.authorization.get('informacionMedica').get('tiempoEstadia').markAsUntouched();
					}
				}
				// tslint:disable-next-line: one-line
				else if (value == 'ambulatorio') {
					this.authorization.get('informacionMedica').get('tiempoEstadia').disable();
					this.authorization.get('informacionMedica').get('tiempoEstadia').setValue(1);
				}
			});
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

	showWarningDot(form: any): boolean {
		if (!this.ID) {

			if (!form.valid && this.form.submitted) {
				return true;
			} else {
				return false;
			}

		} else {
			if (form.valid) {
				return false;
			} else {
				return true;
			}
		}
	}

	private _filter(value: string): any[] {

		if (this.authorization.get('informacionAsegurado').get('filterType').value == 'nombre') {
			const filterValue = value.toLowerCase();

			return this.dataAutoCompleteName.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
		}
		if (this.authorization.get('informacionAsegurado').get('filterType').value == 'id') {
			const filterValueNumber = value.toString();

			return this.dataAutoCompleteIdNumber.filter(option => option.toString().indexOf(filterValueNumber) === 0);
		}
		if (this.authorization.get('informacionAsegurado').get('filterType').value == 'poliza') {
			const filterValue = value.toLowerCase();

			return this.dataAutoCompletePolicy.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
		}

	}

	createFormArray() {
		return this.fb.group({
			medicReport: [''],
			budget: [''],
			studies: [''],
			indication: [''],
		});
	}

	returnAutoCompleteData() {
		this.newAuthorization.getIdNumbers().subscribe(data => {
			console.log(data);
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

				// tslint:disable-next-line: prefer-for-of
				for (let y = 0; y < data.data[x].polizas.length; y++) {
					// console.log(data.data[x].polizas[y].ramo.toLocaleLowerCase());
					// console.log(!(data.data[x].polizas[y].ramo.toLocaleLowerCase().includes('vida')));
					// console.log('hola me llamdo'.includes('hola'));

					if (!(data.data[x].polizas[y].ramo.toLocaleLowerCase().includes('vida'))) {
						this.dataAutoCompleteIdNumberObject.push({
							name: data.data[x].asegurado.nombres_asegurado,
							// id: data.data[x].asegurado.id_asegurado,
							policy: data.data[x].asegurado.no_poliza,
							value: data.data[x].asegurado.id_asegurado
						});
						this.dataAutoCompleteName.push(data.data[x].asegurado.nombres_asegurado);

						this.dataAutoCompleteIdNumber.push(data.data[x].asegurado.id_asegurado);

						this.dataAutoCompletePolicy.push(data.data[x].asegurado.no_poliza);
					}
				}

			}
			this.appComponent.showOverlay = false;
			this.timeAutoComplete = 1;
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

						this.nombreMedicoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('nombreMedico').valueChanges.subscribe(value => {
							this.authorization.get('informacionMedica').get('admision').get('nombreMedico').setValue(value);
						});
						this.telefonoSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('telefono').valueChanges.subscribe(value => {
							this.authorization.get('informacionMedica').get('admision').get('telefono').setValue(value);
						});
						this.direccionSB = this.authorization.get('informacionMedica').get('primerosSintomas').get('direccion').valueChanges.subscribe(value => {
							this.authorization.get('informacionMedica').get('admision').get('direccion').setValue(value);
						});
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
		if(this.filesInformation) {
			if (this.filesInformation[i]) {
				if (this.filesInformation[i][type + 'Url']) { return this.filesInformation[i][type + 'Url']; }
			}
		}
	}

	onFileChange(event, formName, i) {
		const reader = new FileReader();
		console.log(this.authorization.get('files'));
		console.log('event.targe: ', event.target.files);
		console.log('event: ', event);

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
		console.log(JSON.stringify(this.authorization.value));
	}

	removeToList(index) {
		this.documentsArray.removeAt(index);
	}

	clearArchives(formName, index) {
		this.authorization.get('files').get(index.toString()).get(formName).setValue('');
		// this.authorization.get('diagnosticos').get(index.toString()).get('files').get(formName).setValue('');
	}

	searchIdNumber(idNumber: string) {

		let idNumberObject;

		if (this.authorization.get('informacionAsegurado').get('filterType').value == 'nombre') {
				idNumberObject = this.dataAutoCompleteIdNumberObject.find(nombre =>
			nombre.name == idNumber);
			 idNumber = (idNumberObject.value).toString();
			}
		if (this.authorization.get('informacionAsegurado').get('filterType').value == 'id') {
			idNumber = (idNumber).toString();
		}
		if (this.authorization.get('informacionAsegurado').get('filterType').value == 'poliza') {
				idNumberObject = this.dataAutoCompleteIdNumberObject.find(nombre =>
			nombre.policy == idNumber);
			 idNumber = (idNumberObject.value).toString();
			}

		// const idNumberObject = this.dataAutoCompleteIdNumberObject.find(nombre =>
		// 	nombre.name == idNumber);
		// // console.log(idNumberObject);
		// idNumber = (idNumberObject.value).toString();

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

					this.authorization.get('informacionAsegurado').get('nombres').setValue(response.data.asegurado.nombres_asegurado);
					this.authorization.get('informacionAsegurado').get('apellidos').setValue(response.data.asegurado.apellidos_asegurado);
					this.authorization.get('informacionAsegurado').get('noPoliza').setValue(response.data.asegurado.no_poliza);

					switch (response.data.asegurado.sexo) {
						case 'M':
							this.authorization.get('informacionAsegurado').get('sexo').setValue('masculino');
							break;

						case 'F':
							this.authorization.get('informacionAsegurado').get('sexo').setValue('femenino');
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
	}

	getData(id) {
		this.appComponent.showOverlay = true;
		this.newAuthorization.returnData(id).subscribe(data => {
			console.log(data);
			this.showContent = true;
			this.authorization.get('informacionAsegurado').get('idNumber').disable();

			switch (data.data.informacionAsegurado.sexo) {
				case 'M':
					this.authorization.get('informacionAsegurado').get('sexo').setValue('masculino');
					break;

				case 'F':
					this.authorization.get('informacionAsegurado').get('sexo').setValue('femenino');
					break;
				default:
					break;
			}

			this.authorization['controls'].fecha.setValue(data.data.fecha);
			this.authorization['controls'].informacionAsegurado['controls'].nombres.setValue(data.data.informacionAsegurado.nombres);
			this.authorization['controls'].informacionAsegurado['controls'].apellidos.setValue(data.data.informacionAsegurado.apellidos);
			this.authorization['controls'].informacionAsegurado['controls'].noPoliza.setValue(data.data.informacionAsegurado.noPoliza);
			this.authorization['controls'].informacionAsegurado['controls'].filterType.setValue(data.data.informacionAsegurado.filterType);
			this.authorization['controls'].informacionAsegurado['controls'].idNumber.setValue(data.data.informacionAsegurado.idNumber);
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

			// this.authorization['controls'].informacionMedica['controls'].monto.setValue(data.data.informacionMedica.monto);

			this.authorization['controls'].informacionMedica['controls'].primerosSintomas['controls'].fecha.setValue(data.data.informacionMedica.primerosSintomas.fecha);
			this.authorization['controls'].informacionMedica['controls'].primerosSintomas['controls'].nombreMedico.setValue(data.data.informacionMedica.primerosSintomas.nombreMedico);
			this.authorization['controls'].informacionMedica['controls'].primerosSintomas['controls'].direccion.setValue(data.data.informacionMedica.primerosSintomas.direccion);
			this.authorization['controls'].informacionMedica['controls'].primerosSintomas['controls'].telefono.setValue(data.data.informacionMedica.primerosSintomas.telefono);
			this.authorization['controls'].informacionMedica['controls'].admision['controls'].fecha.setValue(data.data.informacionMedica.admision.fecha);
			this.authorization['controls'].informacionMedica['controls'].admision['controls'].nombreMedico.setValue(data.data.informacionMedica.admision.nombreMedico);
			this.authorization['controls'].informacionMedica['controls'].admision['controls'].direccion.setValue(data.data.informacionMedica.admision.direccion);
			this.authorization['controls'].informacionMedica['controls'].admision['controls'].telefono.setValue(data.data.informacionMedica.admision.telefono);
			this.authorization['controls'].informacionMedica['controls'].tiempoEstadia.setValue(data.data.informacionMedica.tiempoEstadia);
			this.authorization['controls'].informacionMedica['controls'].nombreServicio.setValue(data.data.informacionMedica.nombreServicio);
			this.authorization['controls'].informacionMedica['controls'].isMedicalEqual.setValue(data.data.informacionMedica.isMedicalEqual);

			// this.authorization['controls'].informacionMedica['controls'].autorizacion.setValue(data.data.informacionMedica.autorizacion);

			// this.authorization['controls'].files['controls'].medicReport.setValue(data.data.files.medicReport);
			// this.documentsArray = this.authorization.get('files') as FormArray;

			// if (data.data.files) {
			// 	this.filesInformation = data.data.files;
			// 	console.log(this.filesInformation);

			// 	// tslint:disable-next-line: prefer-for-of
			// 	for (let x = 0; x < data.data.files.length; x++){
			// 		if (data.data.files[x].medicReport) {
			// 			this.authorization.get('files').get(x.toString()).patchValue({
			// 				medicReport: data.data.files[x].medicReport
			// 			});
			// 		}
			// 		if (data.data.files[x].budget) {
			// 			this.authorization.get('files').get(x.toString()).patchValue({
			// 				budget: data.data.files[x].budget
			// 			});
			// 		}
			// 		if (data.data.files[x].studies) {
			// 			this.authorization.get('files').get(x.toString()).patchValue({
			// 				studies: data.data.files[x].studies
			// 			});
			// 		}
			// 		if (data.data.files[x].indication) {
			// 			this.authorization.get('files').get(x.toString()).patchValue({
			// 				indication: data.data.files[x].indication
			// 			});
			// 		}
			// 	}
			// }

			// this.authorization['controls'].files['controls'].studies.setValue(data.data.files.studies);
			// this.authorization['controls'].files['controls'].indication.setValue(data.data.files.indication);

			if (data.data.informacionAsegurado.otroSeguro === 'si') {
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
			} else if (data.data.informacionAsegurado.otroSeguro === 'no') {
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

			this.authorization.markAllAsTouched();
			this.authorization.updateValueAndValidity();
		});
		this.newAuthorization.id = null;
		console.log('this.newAuthorization.id es igual a ' + this.newAuthorization.id);
		this.appComponent.showOverlay = false;

	}

	sendForm(form: FormGroup, formType: string, sendType: string, id?: number) {
		console.log(id);

		this.formHandler.sendForm(form, formType, sendType, this.appComponent, id);

	}
}
