import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FieldConfig } from 'src/app/shared/components/form-components/models/field-config';
import { $time } from 'src/app/core/form/objects';
import { FormArrayGeneratorService } from 'src/app/core/services/forms/form-array-generator.service';


@Component({
  selector: 'app-musculoskeletal',
  templateUrl: './musculoskeletal.component.html',
  styles: []
})
export class MusculoskeletalComponent implements OnInit {

  @Input() form: FormGroup;

  yesNo:FieldConfig ={
    label:'',
    options: [

        {
          value:'si',
          viewValue: 'Si'

        },

        {
          value:'no',
          viewValue: 'No'
        }
    ]
  };

  timeSelect = {
    label: 'Seleccione',
    options: $time
  };

  // skeletalMuscle: FormGroup;
  
  episodeFormArray: FormArray;
  episodeProperty;

  surgeryFormArray: FormArray;
  surgeryProperty;

  therapyFormArray: FormArray;
  therapyProperty;

  accordionTitles=["Datos"];

  selectChange(event: any) {

    const formE = this.form.get('data').get('episode') as FormGroup;
    const formS = this.form.get('data').get('surgery') as FormGroup;
    const formNFA = this.form.get('data') as FormGroup;

    
		if (event.valor === 'si') {
      switch (event.name) {
        
        case 'episode_radio':

                  formE.addControl('episode_array', this.episodeProperty);
                  this.episodeFormArray = this.form.get('data').get('episode').get('episode_array') as FormArray;
                  console.log(JSON.stringify(this.form.value));

                  break;

        case 'surgery_radio':

                  formS.addControl('surgery_array', this.surgeryProperty);
                  this.surgeryFormArray = this.form.get('data').get('surgery').get('surgery_array') as FormArray;
                  
                  console.log(JSON.stringify(this.form.value));
                  break;

        case 'skeletal_disorder_radio':

                  formNFA.addControl('disorder', this.fb.group({

                        bodyPart:['', Validators.required],
                        cause: ['', Validators.required],
                        date: [new Date(), Validators.required],

                  }));
                  console.log(JSON.stringify(this.form.value));
                  break;

        case 'recovered_radio':

                  formNFA.removeControl('areaText')
                  break;

        }

			}
		 else if (event.valor === 'no') {
	
      switch (event.name) {

        case 'episode_radio':

            formE.removeControl('episode_array');
            this.episodeFormArray = undefined;

            break;

        case 'surgery_radio':

            formS.removeControl('surgery_array');
            this.surgeryFormArray = undefined;
            
            break;

        case 'skeletal_disorder_radio':

            formNFA.removeControl('disorder')
            break;

        case 'recovered_radio':

            formNFA.addControl('areaText', this.fb.group({

                residual_symptoms:['', Validators.required],

            }));

            console.log(JSON.stringify(this.form.value));
            break;

        }

			}
		
  }

  episodeGroup ={
    date: [new Date(), Validators.required],
    duration: ['', Validators.required],
    DayMonthYear: ['', Validators.required]
  }

  surgeryGroup ={
    date: [new Date(), Validators.required],
    name: ['', Validators.required],
    place: ['', Validators.required]
  }

  therapyGroup ={
    date: [new Date(), Validators.required],
    name: ['', Validators.required],
    dose: ['', Validators.required],
    others: ['', Validators.required]

  }

  createFormArray(name: string) {

    const formT = this.form.get('data').get('therapy') as FormGroup;

    formT.addControl('therapy_array', this.therapyProperty);

		switch (name) {

			case 'episode_array':

				  return this.episodeGroup;
          break;

      case 'surgery_array':

          return this.surgeryGroup;
          break;

      case 'therapy_array':

          return this.therapyGroup;

          break;
      }

    }

  constructor(private fb:FormBuilder, public formMethods: FormArrayGeneratorService) { }

  ngOnInit() {

    this.episodeProperty = this.fb.array([this.formMethods.createItem(this.episodeGroup)]);
    this.surgeryProperty = this.fb.array([this.formMethods.createItem(this.surgeryGroup)]);
    this.therapyProperty = this.fb.array([this.formMethods.createItem(this.therapyGroup)]);

    this.addBasicControls();

    // this.form = this.fb.group({

    //   full_name: ['', Validators.required],
    //   age:['', [Validators.required, Validators.min(1)]],
    //   doctor_name: ['', Validators.required],
    //   hospital_name: ['', Validators.required],
    //   hospital_telephone: ['', Validators.required],

    //   data: this.fb.group({

    //     skeletal_disorder_radio:['', Validators.required],
    //     recovered_radio:['', Validators.required],
    //     date: [new Date(), Validators.required],
    //     episode_radio:['', Validators.required],
    //     episode:  this.fb.group({

    //       episode_array: this.fb.array([this.formMethods.createItem(this.episodeGroup)])

    //   }),

    //     surgery_radio:['', Validators.required],
    //     surgery: this.fb.group({

    //       surgery_array: this.fb.array([this.formMethods.createItem(this.surgeryGroup)])

    //     }),

    //     therapy: this.fb.group({

    //       therapy_array: this.fb.array([this.formMethods.createItem(this.therapyGroup)])

    //     }),

    //     aditional_info:['', Validators.required]
    //   }),


    // })

    this.therapyFormArray = this.form.get('data').get('therapy').get('therapy_array') as FormArray;

  }

  addBasicControls(){

    this.form.addControl('full_name', this.fb.control('', Validators.required));
    this.form.addControl('age', this.fb.control('', [Validators.required, Validators.min(1)]));
    this.form.addControl('doctor_name', this.fb.control('', Validators.required));
    this.form.addControl('hospital_name', this.fb.control('', Validators.required));
    this.form.addControl('hospital_telephone', this.fb.control('', Validators.required));

    this.form.addControl('data', this.fb.group({

      skeletal_disorder_radio:['', Validators.required],
      recovered_radio:['', Validators.required],
      date: [new Date(), Validators.required],
      episode_radio:['', Validators.required],
      episode:  this.fb.group({

        episode_array: this.fb.array([this.formMethods.createItem(this.episodeGroup)])

    }),

      surgery_radio:['', Validators.required],
      surgery: this.fb.group({

        surgery_array: this.fb.array([this.formMethods.createItem(this.surgeryGroup)])

      }),

      therapy: this.fb.group({

        therapy_array: this.fb.array([this.formMethods.createItem(this.therapyGroup)])

      }),

      aditional_info:['', Validators.required]
    })
    
    );

  }

  addFormArray(array: any, name: string) {

    const increment = array.length + 1;
    array = this.formMethods.addElement(array, increment, this.createFormArray(name)).formArray;
    
    console.log(JSON.stringify(this.form.value));
    // array.push(this.createFormArray(name));
    
  }

  removeFormArray(index, array: any) {
    array.removeAt(index);
  }

}