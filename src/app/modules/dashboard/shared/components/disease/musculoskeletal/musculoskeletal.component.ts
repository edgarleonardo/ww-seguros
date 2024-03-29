import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FieldConfig } from 'src/app/shared/components/form-components/models/field-config';
import { $time } from 'src/app/core/form/objects';
import { FormArrayGeneratorService } from 'src/app/core/services/forms/form-array-generator.service';


@Component({
  selector: 'app-musculoskeletal',
  templateUrl: './musculoskeletal.component.html',
  styles: []
})
export class MusculoskeletalComponent implements OnInit, DoCheck {

  @Input() form: FormGroup;
  @Input() showWarningDot: boolean;
  @Input() affected: string;

  step: number;

  yesNo: FieldConfig = {
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

  accordionTitles = ['Datos'];

  xValidatorsMusculo = 0;

  selectChange(event: any) {

    const formE = this.form.get('data').get('episode') as FormGroup;
    const formS = this.form.get('data').get('surgery') as FormGroup;
    const formNFA = this.form.get('data') as FormGroup;


    if (event.valor === 'SI') {
      switch (event.name) {
        case 'episode_radio':
          if (this.form.get('data').get('episode').get('episode_array')) {
            (this.form.get('data').get('episode') as FormGroup).removeControl('episode_array');
          }
          formE.addControl('episode_array', this.fb.array([this.createFormArray('episode_array')]));
          this.episodeFormArray = this.form.get('data').get('episode').get('episode_array') as FormArray;
          break;

        case 'surgery_radio':
          if (this.form.get('data').get('surgery').get('surgery_array')) {
            (this.form.get('data').get('surgery') as FormGroup).removeControl('surgery_array');
          }
          formS.addControl('surgery_array', this.fb.array([this.createFormArray('surgery_array')]));
          this.surgeryFormArray = this.form.get('data').get('surgery').get('surgery_array') as FormArray;
          break;

        case 'skeletal_disorder_radio':
          formNFA.addControl('disorder', this.fb.group({
            bodyPart: ['', Validators.required],
            cause: ['', Validators.required],
            date: [new Date(), Validators.required],
          }));
          break;

        case 'recovered_radio':
          formNFA.addControl('date', this.fb.control(new Date(), Validators.required));
          formNFA.addControl('areaText', this.fb.group({
            residual_symptoms: ['', Validators.required],
          }));
          break;
      }
    } else if (event.valor === 'NO') {

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
          formNFA.removeControl('disorder');
          break;

        case 'recovered_radio':
          formNFA.removeControl('date');
          formNFA.removeControl('areaText');
          break;
      }

    }

  }


  createFormArray(name: string) {

    // const formT = this.form.get('data').get('therapy') as FormGroup;

    // formT.addControl('therapy_array', this.therapyProperty);

    switch (name) {
      case 'episode_array':
        return this.fb.group({
          date: [new Date(), Validators.required],
          duration: ['', [Validators.required, Validators.min(1)]],
          dayMonthYear: ['', Validators.required]
        });
        break;

      case 'surgery_array':

        return this.fb.group({
          date: [new Date(), Validators.required],
          name: ['', Validators.required],
          place: ['', Validators.required]
        });
        break;

      case 'therapy_array':

        return this.fb.group({
          date: [new Date(), Validators.required],
          name: ['', Validators.required],
          dose: ['', Validators.required],
          others: ['', Validators.required]

        });

        break;
    }

  }

  constructor(private fb: FormBuilder, public formMethods: FormArrayGeneratorService) { }

  ngOnInit() {

    if (this.form.get('data') !== undefined && this.form.get('data') !== null) {
      if (this.form.get('data').get('surgery').get('surgery_array') !== null) {
        this.surgeryFormArray = this.form.get('data').get('surgery').get('surgery_array') as FormArray;

      } else {

        const formE = this.form.get('data').get('episode') as FormGroup;
        const formS = this.form.get('data').get('surgery') as FormGroup;
        formS.addControl('surgery_array', this.surgeryProperty);
        this.surgeryFormArray = this.form.get('data').get('surgery').get('surgery_array') as FormArray;
        console.log(this.surgeryFormArray);
        console.log(this.form);
      }

    } else {
      this.addBasicControls();
    }
    // this.addBasicControls();

    // this.episodeFormArray = this.form.get('data').get('episode').get('episode_array') as FormArray;
    if (this.form.get('data').get('therapy') && this.form.get('data').get('therapy').get('therapy_array')) {
      this.therapyFormArray = this.form.get('data').get('therapy').get('therapy_array') as FormArray;
    }
    if (this.form.get('data').get('surgery') && this.form.get('data').get('surgery').get('surgery_array')) {
      this.surgeryFormArray = this.form.get('data').get('surgery').get('surgery_array') as FormArray;
    }
    if (this.form.get('data').get('episode') && this.form.get('data').get('episode').get('episode_array')) {
      this.episodeFormArray = this.form.get('data').get('episode').get('episode_array') as FormArray;
    }

    console.log(this.surgeryFormArray);

  }

  ngDoCheck() {

    if (this.form.get('data').get('recovered_radio').value != 'SI') {
      if (this.form.get('data').get('date')) {
        (this.form.get('data') as FormGroup).removeControl('date');
      }
    }

    if (this.xValidatorsMusculo == 0) {
      if (this.form.get('data').get('surgery').get('surgery_array') && (this.surgeryFormArray != null ||
        this.surgeryFormArray != undefined) && this.form.get('data').get('surgery_radio').value == 'SI') {
          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.surgeryFormArray.length; x++) {
            (this.form.get('data').get('surgery').get('surgery_array').get(x.toString()) as
            FormGroup).get('name').setValidators(Validators.required);
            (this.form.get('data').get('surgery').get('surgery_array').get(x.toString()) as
            FormGroup).get('name').updateValueAndValidity();
          }
      }
      if (this.form.get('data').get('therapy').get('therapy_array') && (this.therapyFormArray != null ||
        this.therapyFormArray != undefined)) {
          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.therapyFormArray.length; x++) {
            (this.form.get('data').get('therapy').get('therapy_array').get(x.toString()) as
            FormGroup).get('name').setValidators(Validators.required);
            (this.form.get('data').get('therapy').get('therapy_array').get(x.toString()) as
            FormGroup).get('name').updateValueAndValidity();
          }
      }
      this.xValidatorsMusculo = 1;
    }
  }

  IssurgeryFormArray() {
    try {
      if (this.surgeryFormArray.length > 0) {
        return true;
      }
    } catch { }
    return false;
  }
  addBasicControls() {
    this.form.addControl('doctor_name', this.fb.control('', Validators.required));
    this.form.addControl('hospital_name', this.fb.control('', Validators.required));
    this.form.addControl('hospital_telephone', this.fb.control('', Validators.required));

    this.form.addControl('data', this.fb.group({

      skeletal_disorder_radio: ['', Validators.required],
      recovered_radio: ['', Validators.required],
      episode_radio: ['', Validators.required],
      episode: this.fb.group({

        // episode_array: this.fb.array([this.createFormArray('episode_array')])

      }),

      surgery_radio: ['', Validators.required],
      surgery: this.fb.group({

        // surgery_array: this.fb.array([this.createFormArray('surgery_array')])

      }),

      therapy: this.fb.group({

        therapy_array: this.fb.array([this.createFormArray('therapy_array')])

      }),

      aditional_info: ['', Validators.required]
    })

    );

  }

  addFormArray(array: any, name: string) {

    array.push(this.createFormArray(name));

    // array.push(this.createFormArray(name));

  }

  removeFormArray(index, array: any) {
    array.removeAt(index);
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep(panel?: string) {
    this.step++;
  }

}
