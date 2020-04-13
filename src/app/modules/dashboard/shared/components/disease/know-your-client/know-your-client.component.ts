import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { FormArrayGeneratorService } from 'src/app/core/services/forms/form-array-generator.service';
import { $country } from 'src/app/core/form/objects';
import { FieldConfig } from 'src/app/shared/components/form-components/models/field-config';

@Component({
  selector: 'app-know-your-client',
  templateUrl: './know-your-client.component.html',
  styles: []
})
export class KnowYourClientComponent implements OnInit {

	@Input() form: FormGroup;
  accordionTitles = [
		'Datos Generales',
		'Datos del representante o apoderado legal',
		'Composición del órgano de gestión',
		'Principales Accionistas - Beneﬁciario Final',
		'Personas Políticamente Expuestas',
		'Perfil Financiero',
		'Declaración',
		'Datos del corredor (quien declara haber revisado los datos dados por el cliente o contratante)',
		'Para uso de la aseguradora'
	];

	exposed_politically: FieldConfig = {
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

	main_annual_income_options: FieldConfig = {
		label: 'Ingresos anuales actividad principal',
		options: [
			{
				value: 'menos de 250000',
				viewValue: '< de US$250 mil'
			},
			{
				value: '250000 a 1000000',
				viewValue: 'US$250 mil a US$1 millón'
			},
			{
				value: '10000000 a 10000000',
				viewValue: 'US$1 millón a  US$10 millones'
			},
			{
				value: 'mas de 10000000',
				viewValue: '> de US$10 millones'
			}
		]
	};

	other_annual_income_options: FieldConfig = {
		label: 'Ingresos anuales por otras actividades',
		options: [
			{
				value: 'menos de 250000',
				viewValue: '< de US$250 mil'
			},
			{
				value: '250000 a 1000000',
				viewValue: 'US$250 mil a US$1 millón'
			},
			{
				value: '10000000 a 10000000',
				viewValue: 'US$1 millón a  US$10 millones'
			},
			{
				value: 'mas de 10000000',
				viewValue: '> de US$10 millones'
			}
		]
	};

	documents= [{

    		viewValue:'Copia Registro Mercantil',
    		checked: 'false'

  		}, 
 	      {
    
    		viewValue:'Copia de Documento de Identidad Personal o pasaporte del Representante o apoderado legal',
    		checked: 'false'

  		},
   		{

    		viewValue:'Copia de Documento de Identidad o pasaportes de los principales accionistas',
    		checked: 'false'

  		}, 
  		{

    		viewValue:'Copia de Documento de Identidad o pasaporte de los miembros del órgano de gestión',
    		checked: 'false'

  		}, 
	   ]


  	onChange0(e){
   		this.documents[0].checked=e.checked;
  	}

  	onChange1(e){
    		this.documents[1].checked=e.checked;
  	}

  	onChange2(e){
    		this.documents[2].checked=e.checked;
  	}

  	onChange3(e){
    		this.documents[3].checked=e.checked;
  	}


	countryList: FieldConfig = {
		label: 'País',
		options: $country
	};

	// form: FormGroup;
	bodyMembersFormArray: FormArray;
	shareholdersFormArray: FormArray;
	branchOfficeFormArray: FormArray;
	branch_property;
	

	management_bodyFormGroup={
		name_lastname:['', Validators.required],
		position:['', Validators.required],
		id_passport_management_body:['', Validators.required],
		nationality_management_body:['', Validators.required]
	}

	shareholdersFormGroup={
		name_lastname_shareholder:['', Validators.required],
		participation_percentage:['', [Validators.required, Validators.min(1), Validators.max(100)]],
		id_passport_shareholder:['', Validators.required],
		nationality_shareholder:['', Validators.required]
	}	

	branchGroup={

		branch_office_name:['', Validators.required],
		  branch_office_address:['', Validators.required],
		  list_countrys_branch_office:['', Validators.required],
		  register_number_branch_office:['', [Validators.required, Validators.min(1)]],
		  telephone_branch_office:['', Validators.required],
		  other_info_branch_office:['', Validators.required]

	}

	constructor(private fb: FormBuilder, public formMethods: FormArrayGeneratorService) { 

	}

	selectChangeText(event: any) {

		const form = this.form.get('exposed') as FormGroup;

		if (event.valor === 'si') {
		
					form.addControl('areatext', this.fb.group({
						specify_investigated_representative: ['', Validators.required],
					}));
					console.log(JSON.stringify(this.form.value));
			}
		 else if (event.valor === 'no') {
	
					form.removeControl('areatext');

			}
		
	}

	selectChangeExposedPerson(event: any) {

		const form = this.form.get('exposed') as FormGroup;

		if (event.valor === 'si') {
		
					form.addControl('input', this.fb.group({
						exposed_name: ['', Validators.required],
						old_current_position: ['', Validators.required],
					}));
					console.log(JSON.stringify(this.form.value));
			}
		 else if (event.valor === 'no') {
	
					form.removeControl('input');

			}
		
	}

	selectChangeBranchOffice(event) {

		const form = this.form.get('exposed').get('branch_office') as FormGroup;
	
		if (event.valor === 'si') {
		
			  form.addControl('allBranch_office', this.branch_property);
			  this.branchOfficeFormArray = this.form.get('exposed').get('branch_office').get('allBranch_office') as FormArray;
		  }
		 else if (event.valor === 'no') {
	  
			  form.removeControl('allBranch_office');
			  this.branchOfficeFormArray= undefined;
	
		  }
		
	  }

	  createFormArray(){
    
		return this.branchGroup;
	}

	ngOnInit() {

		this.addBasicControls();

		this.branch_property = this.fb.array([this.formMethods.createItem(this.branchGroup)]);

	// 	this.form = this.fb.group({
	// 		request: ['', Validators.required],

    //   general_data: this.fb.group({
    //       society_name:['',Validators.required],
	// 		    commercial_name:['',Validators.required],
	// 		    contributor_num:['', Validators.required],
	// 		    home:['',Validators.required],
	// 		    telephone:['', Validators.required],
	// 		    email:['', [Validators.required, Validators.email]],
	// 		    commercial_activity:['', Validators.required],
    //       list_countrys:['', Validators.required]
    //  }),
      
    //  representative_data: this.fb.group({
    //     name_lastname:['', Validators.required],
	// 		  birthplace:['', Validators.required],
	// 		  birthdate:['', Validators.required],
	// 		  society_position:['', Validators.required],
	// 		  nationality:['', Validators.required],
	// 		  home_telephone:['', Validators.required],
	// 		  cellphone:['',Validators.required],
	// 		  id_passport:['', Validators.required],
	// 		  representative_email:['', Validators.required],
	// 		  address:['', Validators.required],
    //  }),

			

	// 		management_body_composition: this.fb.group({
	// 			allMembers: this.fb.array([this.formMethods.createItem(this.management_bodyFormGroup)])
	// 		}),

	// 		shareholders: this.fb.group({
    //     			allShareholders: this.fb.array([this.formMethods.createItem(this.shareholdersFormGroup)]),
    //     			employee_numbers: ['', Validators.required]
	// 		}),

    //   exposed: this.fb.group({
    //     exposed_person:[''],
    //     stock_Exchange:['', Validators.required],
    //     branch_office_radio:[''],
	// 		  branch_office: this.fb.group({ 
	// 			allBranch_office: this.fb.array([this.formMethods.createItem(this.branchGroup)])
	// 		  }), 
    //     investigated_representative:[''],
       
    //   }),

    //   finance: this.fb.group({

    //     main_annual_income:['', Validators.required],
    //     annual_income_others:['', Validators.required],
    //     documents: this.fb.group({
    //         mercantile_register_document:[''],
    //         id_shareholder_document:[''],
    //         id_representative_document:[''],
    //         managemente_body_document:[''],
    //     })
    //   }),

    //   broker: this.fb.group({
    //     social_name:['', Validators.required],
	// 	  	license_num:['', Validators.required],
    //   }),

    //   info_for_the_insurance_carrier: this.fb.group({
    //     fullname_functionary:['', Validators.required],
	// 		  position_functionary:['', Validators.required]
    //   })

	// 	});

		this.bodyMembersFormArray = this.form.get('management_body_composition').get('allMembers') as FormArray;
		this.shareholdersFormArray = this.form.get('shareholders').get('allShareholders') as FormArray;

	}

	addBasicControls() {

		this.form.addControl('request', this.fb.control('', [Validators.required, Validators.min(1)]));

		this.form.addControl('general_data', this.fb.group({
			society_name:['',Validators.required],
				  commercial_name:['',Validators.required],
				  contributor_num:['', [Validators.required, Validators.min(1)]],
				  home:['',Validators.required],
				  telephone:['', Validators.required],
				  email:['', [Validators.required, Validators.email]],
				  commercial_activity:['', Validators.required],
			list_countrys:['', Validators.required]
	   }));

	   this.form.addControl('representative_data', this.fb.group({
        name_lastname:['', Validators.required],
			  birthplace:['', Validators.required],
			  birthdate:['', Validators.required],
			  society_position:['', Validators.required],
			  nationality:['', Validators.required],
			  home_telephone:['', Validators.required],
			  cellphone:['',Validators.required],
			  id_passport:['', Validators.required],
			  representative_email:['', Validators.required],
			  address:['', Validators.required],
	 }));
	 
	 	this.form.addControl('management_body_composition', this.fb.group({
			allMembers: this.fb.array([this.formMethods.createItem(this.management_bodyFormGroup)])
		}));

		this.form.addControl('shareholders', this.fb.group({
			allShareholders: this.fb.array([this.formMethods.createItem(this.shareholdersFormGroup)]),
			employee_numbers: ['', Validators.required]
	}));

		this.form.addControl('exposed', this.fb.group({
			exposed_person:[''],
			stock_Exchange:['', Validators.required],
			branch_office_radio:[''],
				  branch_office: this.fb.group({ 
					allBranch_office: this.fb.array([this.formMethods.createItem(this.branchGroup)])
				  }), 
			investigated_representative:[''],
		   
		  }));

		this.form.addControl('finance', this.fb.group({

			main_annual_income:['', Validators.required],
			annual_income_others:['', Validators.required],
			documents: this.fb.group({
				mercantile_register_document:[''],
				id_shareholder_document:[''],
				id_representative_document:[''],
				managemente_body_document:[''],
			})
		  }));

		this.form.addControl('broker', this.fb.group({
			social_name:['', Validators.required],
				  license_num:['', [Validators.required, Validators.min(1)]],
		  }));

		this.form.addControl('info_for_the_insurance_carrier', this.fb.group({
			fullname_functionary:['', Validators.required],
				  position_functionary:['', Validators.required]
		  }));

	}

	addMBody(bodyMembersFormArray, group) {
		const increment = bodyMembersFormArray.length + 1;
		bodyMembersFormArray = this.formMethods.addElement(bodyMembersFormArray, increment, group).formArray;
	  }

	addShareholders(shareholdersFormArray, group) {
		const increment = shareholdersFormArray.length + 1;
		shareholdersFormArray = this.formMethods.addElement(shareholdersFormArray, increment, group).formArray;
    	 }

		 addBranchOffice(branchOfficeFormArray) {

			const increment = branchOfficeFormArray.length + 1;
			branchOfficeFormArray = this.formMethods.addElement(branchOfficeFormArray, increment, this.createFormArray()).formArray;
			// console.log(JSON.stringify(this.form.value));
		  }


}
