import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder, RequiredValidator, Validators, FormArray } from '@angular/forms';
import { FieldConfig } from 'src/app/shared/components/form-components/models/field-config';

@Component({
	selector: 'app-changeformcomponent',
	templateUrl: './change.component.html',
	styles: []
})
export class ChangeFormComponent implements OnInit, DoCheck {
	@Input() form: FormGroup;
	@Input() showWarningDot: boolean;
	@Input() affected: string;

	step: number;

	accordionTitle = ['Datos'];

	questions: any[];

	anotherDiseasesOptions: FieldConfig = {
		name: 'disease',
		label: 'Nombre enfermedad',
		options: [
			{ viewValue: 'Diabetes', value: 'DIABETES' },
			{ viewValue: 'Enfisema derrames cerebrales', value: 'ENFISEMA DERRAMES CEREBRALES' },
			{ viewValue: 'Cáncer', value: 'CANCER' },
			{ viewValue: 'Enfermedad renal o vascular', value: 'ENFERMEDAD RENAL O VASCULAR' },

		]
	};

	hypertensionOptions: FieldConfig = {
		name: 'estudio',
		label: 'Estudio',
		options: [
			{ viewValue: 'Electrocardiograma', value: 'ELECTROCARDIOGRAMA' },
			{ viewValue: 'Ecocardiograma', value: 'ECOCARDIOGRAMA' },
			{ viewValue: 'Prueba de esfuerzo', value: 'PRUEBA DE ESFUERZO' },
			{ viewValue: 'Otros', value: 'OTROS' },
		]
	};

	yesOrNo: FieldConfig = {
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

	studiesList: FormArray;
	anotherDiseasesList: FormArray;
	familiarWithCardioList: FormArray;
	medicalTreatmentList: FormArray;
	hypertensionStudiesList: FormArray;
	changedTreatmentList: FormArray;
	liquidAnomalyList: FormArray;

	xValidatorsCardiovascular = 0;

	diseaseInfoGroup() {
		return this.fb.group({
			fechaEvento: ['', Validators.required],
			tratamiento: ['', Validators.required],
			fechaUltima: ['', Validators.required],
			frequencia: ['', Validators.required]
		});
	}

	selectChange(event) {
		console.log(event);
		if (event.valor === 'SI') {
			switch (event.name) {
				case 'haveChestPain':
					this.form.addControl('chestPain', this.diseaseInfoGroup());
					break;

				case 'havePalpitations':
					this.form.addControl('palpitations', this.diseaseInfoGroup());
					break;

				case 'haveCardiacArrhythmias':
					this.form.addControl('cardiacArrhythmias', this.diseaseInfoGroup());
					break;

				case 'haveDifficultyBreathing':
					this.form.addControl('difficultyBreathing', this.diseaseInfoGroup());
					break;

				case 'haveHeartMurmurs':
					this.form.addControl('heartMurmurs', this.diseaseInfoGroup());
					break;

				case 'haveHeartAttacks':
					this.form.addControl('heartAttacks', this.diseaseInfoGroup());
					break;

				case 'haveCoronaryBypassSurgery':
					this.form.addControl('coronaryBypassSurgery', this.diseaseInfoGroup());
					break;

				case 'haveCardiacCatheterization':
					this.form.addControl('cardiacCatheterization', this.diseaseInfoGroup());
					break;

				case 'haveStentPosture':
					this.form.addControl('stentPosture', this.diseaseInfoGroup());
					break;

				case 'haveAnotherDisease':
					if (this.form.get('anotherDiseases')) {
						this.form.removeControl('anotherDiseases');
					}
					this.form.addControl('anotherDiseases', this.fb.array([this.createFormArray('anotherDiseases')]));
					this.anotherDiseasesList = this.form.get('anotherDiseases') as FormArray;
					break;

				case 'haveFamilyWithCardio':
					if (this.form.get('familyWithCardio')) {
						this.form.removeControl('familyWithCardio');
					}
					this.form.addControl('familyWithCardio', this.fb.array([this.createFormArray('familyWithCardio')]));
					this.familiarWithCardioList = this.form.get('familyWithCardio') as FormArray;
					break;

				case 'haveSmokingHabits':
					this.form.addControl('smokingHabits', this.fb.group({
						cantidad: ['', [Validators.required, Validators.min(1)]]
					}));
					break;

				case 'haveHypertensionStudies':
					if (this.form.get('hypertensionStudies')) {
						this.form.removeControl('hypertensionStudies');
					}
					this.form.addControl('hypertensionStudies', this.fb.array([this.createFormArray('hypertensionStudies')]));
					this.hypertensionStudiesList = this.form.get('hypertensionStudies') as FormArray;
					break;

				case 'haveChangedTreatment':
					this.form.addControl('changedTreatment', this.fb.group({
						razon: ['', Validators.required]
					}));
					this.changedTreatmentList = this.form.get('changedTreatment') as FormArray;
					break;

				case 'haveLiquidAnomaly':
					if (this.form.get('liquidAnomaly')) {
						this.form.removeControl('liquidAnomaly');
					}
					this.form.addControl('liquidAnomaly', this.fb.array([this.createFormArray('liquidAnomaly')]));
					this.liquidAnomalyList = this.form.get('liquidAnomaly') as FormArray;
					break;
				default:
					break;
			}
		} else if (event.valor === 'NO') {
			switch (event.name) {
				case 'haveChestPain':
					this.form.removeControl('chestPain');
					break;

				case 'havePalpitations':
					this.form.removeControl('palpitations');
					break;

				case 'haveCardiacArrhythmias':
					this.form.removeControl('cardiacArrhythmias');
					break;

				case 'haveDifficultyBreathing':
					this.form.removeControl('difficultyBreathing');
					break;

				case 'haveHeartMurmurs':
					this.form.removeControl('heartMurmurs');
					break;

				case 'haveHeartAttacks':
					this.form.removeControl('heartAttacks');
					break;

				case 'haveCoronaryBypassSurgery':
					this.form.removeControl('coronaryBypassSurgery');
					break;

				case 'haveCardiacCatheterization':
					this.form.removeControl('cardiacCatheterization');
					break;

				case 'haveStentPosture':
					this.form.removeControl('stentPosture');
					break;

				case 'haveAnotherDisease':
					this.form.removeControl('anotherDiseases');
					this.anotherDiseasesList = undefined;
					break;

				case 'haveFamilyWithCardio':
					this.form.removeControl('familyWithCardio');
					this.familiarWithCardioList = undefined;
					break;

				case 'haveSmokingHabits':
					this.form.removeControl('smokingHabits');
					break;

				case 'haveHypertensionStudies':
					this.form.removeControl('hypertensionStudies');
					this.hypertensionStudiesList = undefined;
					break;

				case 'haveChangedTreatment':
					this.form.removeControl('changedTreatment');
					this.changedTreatmentList = undefined;
					break;

				case 'haveLiquidAnomaly':
					this.form.removeControl('liquidAnomaly');
					this.liquidAnomalyList = undefined;
					break;

				default:
					break;
			}
		}
	}

	setStep(index: number) {
		this.step = index;
	}

	nextStep(panel?: string) {
		this.step++;
	}

	ngOnInit() {
		this.addBasicControls();

		this.form.addControl('studies', this.fb.array([this.createFormArray('studies')]));
		this.studiesList = this.form.get('studies') as FormArray;
		console.log(this.studiesList);
		this.form.addControl('medicalTreatment', this.fb.array([this.createFormArray('medicalTreatment')]));
		this.medicalTreatmentList = this.form.get('medicalTreatment') as FormArray;
		try {
			this.studiesList = this.form.get('studies') as FormArray;
		}
		catch{ }
		this.questions = [
			{
				label: 'Dolor de Pecho (anginas):',
				name: 'haveChestPain',
				group: 'chestPain'
			},
			{
				label: 'Palpitaciones',
				name: 'havePalpitations',
				group: 'palpitations'
			},
			{
				label: 'Arritmias Cardíacas',
				name: 'haveCardiacArrhythmias',
				group: 'cardiacArrhythmias'
			},
			{
				label: 'Dificultad para respirar',
				name: 'haveDifficultyBreathing',
				group: 'difficultyBreathing'
			},
			{
				label: 'Soplos cardíacos',
				name: 'haveHeartMurmurs',
				group: 'heartMurmurs'
			},
			{
				label: 'Ataques cardíacos (infartos)',
				name: 'haveHeartAttacks',
				group: 'heartAttacks'
			},
			{
				label: 'Cirugía de Bypass coronario',
				name: 'haveCoronaryBypassSurgery',
				group: 'coronaryBypassSurgery'
			},
			{
				label: 'Cateterismo cardíaco',
				name: 'haveCardiacCatheterization',
				group: 'cardiacCatheterization'
			},
			{
				label: 'Postura de Stent',
				name: 'haveStentPosture',
				group: 'stentPosture'
			}
		];
	}

	ngDoCheck(): void {

		if (this.form.get('haveAnotherDisease').value == 'SI' &&
			(this.anotherDiseasesList == null || this.anotherDiseasesList == undefined)) {
			// const varDisease = {
			// 	valor: 'si',
			// 	name: 'haveAnotherDisease'
			// };
			// // tslint:disable-next-line: align
			// this.selectChange(varDisease);
			// console.log('HolAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA anotherDiseases');
			this.anotherDiseasesList = this.form.get('anotherDiseases') as FormArray;
		}

		if (this.form.get('haveFamilyWithCardio').value == 'SI' &&
			(this.familiarWithCardioList == null || this.familiarWithCardioList == undefined)) {
			// const varFamilyCardio = {
			// 	valor: 'si',
			// 	name: 'haveFamilyWithCardio'
			// };
			// // tslint:disable-next-line: align
			// this.selectChange(varFamilyCardio);
			// console.log('HolAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA familyWithCardio');
			this.familiarWithCardioList = this.form.get('familyWithCardio') as FormArray;
		}

		if (this.form.get('haveHypertensionStudies').value == 'SI' &&
			(this.hypertensionStudiesList == null || this.hypertensionStudiesList == undefined)) {
			// const varArterial = {
			// 	valor: 'si',
			// 	name: 'haveHypertensionStudies'
			// };
			// // tslint:disable-next-line: align
			// this.selectChange(varArterial);
			// console.log('HolAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA hypertensionStudies');
			this.hypertensionStudiesList = this.form.get('hypertensionStudies') as FormArray;
		}

		if (this.form.get('haveLiquidAnomaly').value == 'SI' &&
			(this.liquidAnomalyList == null || this.liquidAnomalyList == undefined)) {
			// const varAnomaly = {
			// 	valor: 'si',
			// 	name: 'haveLiquidAnomaly'
			// };
			// // tslint:disable-next-line: align
			// this.selectChange(varAnomaly);
			// console.log('HolAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA liquidAnomaly');
			this.liquidAnomalyList = this.form.get('liquidAnomaly') as FormArray;
		}

		if (this.xValidatorsCardiovascular == 0) {
			if (this.form.get('hypertensionStudies') && ( this.hypertensionStudiesList != null ||
				this.hypertensionStudiesList != undefined) && this.form.get('haveHypertensionStudies').value == 'SI') {
					// tslint:disable-next-line: prefer-for-of
					for (let x = 0; x < this.hypertensionStudiesList.length; x++) {
						this.form.get('hypertensionStudies').get(x.toString()).get('informacion').clearValidators();
						this.form.get('hypertensionStudies').get(x.toString()).get('informacion').updateValueAndValidity();
					}
			}
			if (this.form.get('studies') && ( this.studiesList != null ||
				this.studiesList != undefined)) {
					// tslint:disable-next-line: prefer-for-of
					for (let x = 0; x < this.studiesList.length; x++) {
						this.form.get('studies').get(x.toString()).get('nombre').setValidators(Validators.required);
						this.form.get('studies').get(x.toString()).get('nombre').updateValueAndValidity();
					}
			}
			if (this.form.get('medicalTreatment') && ( this.medicalTreatmentList != null ||
				this.medicalTreatmentList != undefined)) {
					// tslint:disable-next-line: prefer-for-of
					for (let x = 0; x < this.medicalTreatmentList.length; x++) {
						this.form.get('medicalTreatment').get(x.toString()).get('nombre').setValidators(Validators.required);
						this.form.get('medicalTreatment').get(x.toString()).get('nombre').updateValueAndValidity();
					}
			}
			// tslint:disable-next-line: align
			this.form.get('nombre').clearValidators();
   // tslint:disable-next-line: align
        	this.form.get('nombre').updateValueAndValidity();

        	// tslint:disable-next-line: align
			this.form.get('edad').clearValidators();
			// this.form.get('edad').setValidators(Validators.min(1));
        	// tslint:disable-next-line: align
        	this.form.get('edad').updateValueAndValidity();
			this.xValidatorsCardiovascular = 1;
		}


	}

	addBasicControls() {
		this.form.addControl('nombre', this.fb.control(''));
		this.form.addControl('edad', this.fb.control('', [Validators.min(1)]));
		this.form.addControl('nombreMedico', this.fb.control('', Validators.required));
		this.form.addControl('centroSalud', this.fb.control('', Validators.required));
		this.form.addControl('telefonoCentro', this.fb.control('', Validators.required));
		this.form.addControl('haveChestPain', this.fb.control('', Validators.required));
		this.form.addControl('havePalpitations', this.fb.control('', Validators.required));
		this.form.addControl('haveCardiacArrhythmias', this.fb.control('', Validators.required));
		this.form.addControl('haveDifficultyBreathing', this.fb.control('', Validators.required));
		this.form.addControl('haveHeartMurmurs', this.fb.control('', Validators.required));
		this.form.addControl('haveHeartAttacks', this.fb.control('', Validators.required));
		this.form.addControl('haveCoronaryBypassSurgery', this.fb.control('', Validators.required));
		this.form.addControl('haveCardiacCatheterization', this.fb.control('', Validators.required));
		this.form.addControl('haveStentPosture', this.fb.control('', Validators.required));
		this.form.addControl('haveAnotherDisease', this.fb.control('', Validators.required));
		this.form.addControl('haveFamilyWithCardio', this.fb.control('', Validators.required));
		this.form.addControl('haveSmokingHabits', this.fb.control('', Validators.required));
		this.form.addControl('haveHypertensionStudies', this.fb.control('', Validators.required));
		this.form.addControl('haveChangedTreatment', this.fb.control('', Validators.required));
		this.form.addControl('haveLiquidAnomaly', this.fb.control('', Validators.required));
		this.form.addControl('medicalConsultationFrequency', this.fb.control('', Validators.required));
		this.form.addControl('importantInformation', this.fb.control('', Validators.required));
		this.form.addControl('lastMedicalConsultation', this.fb.group({
			fecha: ['', Validators.required],
			resultado: ['', Validators.required],
		}));
	}

	createFormArray(type: string): FormGroup {
		switch (type) {
			case 'studies':
				return this.fb.group({
					nombre: ['', Validators.required],
					resultado: ['', Validators.required],
				});
				break;

			case 'anotherDiseases':
				return this.fb.group({
					disease: ['', Validators.required],
				});
				break;

			case 'familyWithCardio':
				return this.fb.group({
					familiar: ['', Validators.required],
					condicion: ['', Validators.required],
				});
				break;

			case 'hypertensionStudies':
				return this.fb.group({
					estudio: ['', Validators.required],
					fecha: ['', Validators.required],
					resultado: ['', Validators.required],
					informacion: [''],
				});
				break;

			case 'medicalTreatment':
				return this.fb.group({
					nombre: ['', Validators.required],
					dosis: ['', Validators.required],
					frecuencia: ['', Validators.required],
				});
				break;

			case 'liquidAnomaly':
				return this.fb.group({
					fecha: ['', Validators.required],
					informacion: ['', Validators.required],
				});
				break;

			default:
				break;
		}
	}

	addToList(list: any, type: string) {
		list.push(this.createFormArray(type));
	}

	removeToList(index, list: any) {
		list.removeAt(index);
	}

	constructor(private fb: FormBuilder) { }
}
