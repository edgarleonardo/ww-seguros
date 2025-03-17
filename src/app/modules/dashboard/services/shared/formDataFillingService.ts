import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormDataFillingService {

  excludedKeys = [
    'id2Attached', 'id2AttachedUrl', 'specifyRelationship', 'differentMedic', 'isJuridica', 'name', 'nombre', 'edad', 'age', 'exposed_person',
    'fullname_functionary', 'position_functionary', 'old_current_position', 'request', 'exposed_name', 'createdBy'
    , 'lastChangeBy'
    , 'investigated'
    , 'position'
    , 'functionary_name'
    , 'bankEntity'
    , 'contact'
    , 'amount'
    , 'inches'
    , 'createdBy', 'mandatorySubject', 'diagnosis', 'document',
    'idId', 'middle_name',
    'marital_status', 'post_office_box', 'creationDate',
    'diabetesOther',
    'everHospitalized', 'lastTimeSmoked',
    'healthDeclaration',
    'invoices'
  ];

  excludedKeysForm = [
    'valueForForm', 'valueCollectedFromForm', 'haveRange'
  ];

  excludedKeysDisability = [
    'id2Attached', 'id2AttachedUrl', 'specifyRelationship', 'differentMedic', 'isJuridica', 'name', 'nombre', 'edad', 'age', 'exposed_person',
    'fullname_functionary', 'position_functionary', 'old_current_position', 'request', 'exposed_name', 'createdBy'
    , 'lastChangeBy'
    , 'investigated'
    , 'position'
    , 'functionary_name'
    , 'bankEntity'
    , 'contact'
    , 'amount'
    , 'inches'
    , 'createdBy', 'mandatorySubject', 'diagnosis', 'document',
    'idId', 'middle_name',
    'marital_status', 'post_office_box', 'creationDate',
    'diabetesOther',
    'everHospitalized', 'insured', 'contractor', 'policeNo', 'lastName',
    'healthDeclaration'
  ];
  excludedKeysVida = [
    'directorioSolicitud', 'updateDate', 'status',
    'id2Attached', 'id2AttachedUrl', 'specifyRelationship', 'differentMedic', 'isJuridica', 'name', 'nombre', 'edad', 'age', 'exposed_person',
    'fullname_functionary', 'position_functionary', 'old_current_position', 'request', 'exposed_name', 'createdBy'
    , 'lastChangeBy'
    , 'investigated'
    , 'position'
    , 'othersAnnualIncome'
    , 'functionary_name'
    , 'bankEntity'
    , 'contact'
    , 'amount'
    , 'inches'
    , 'createdBy', 'mandatorySubject', 'diagnosis', 'document',
    'idId', 'middle_name',
    'marital_status', 'post_office_box', 'creationDate', 'time', 'duration', 'last_names',
    'type_radio',
    'engine',
    'brand',
    'diabetesOther',
    'everHospitalized',
    'year',
    'how',
    'relationship',
    'hospitalNameAdress',
    'treatment',
    'condition',
    'incomeMainActivity',
    'isExposed',
    'currency',
    'nameBeneficiary',
    'familyBeneficiary',
    'id2Beneficiary',
    'id2AttachedBeneficiary',
    'id2AttachedBeneficiaryUrl',
    'specifyRelationshipBeneficiary',
    'nationalityBeneficiary',
    'ocupationBeneficiary',
    'quantityBeneficiary',
    'healthDeclaration'
  ];
  constructor(
    private fb: FormBuilder
  ) { }

  has(object: any, key: any) {
    return object ? this.hasOwnProperty.call(object, key) : false;
  }
  iterateThroughtAllObject(obj: any, groupControl: any) {
    const formDataGroup = groupControl as FormGroup;
    Object.keys(obj).forEach(e => {
      const key = e;
      const value = obj[key];
      if (value !== undefined && (typeof value) !== 'object') {

        const valueToSet = (value === null || value === undefined) ? '' : value;

        if (valueToSet !== undefined) {
          if (!this.has(formDataGroup.controls, key)) {
            // tslint:disable-next-line: triple-equals
            if (valueToSet == 'true' || valueToSet == 'false') {
              if (this.controlIsNotRequired(key)) {
                formDataGroup.addControl(key, this.fb.control((valueToSet === 'true')));
              } else {
                formDataGroup.addControl(key, this.fb.control((valueToSet === 'true'), Validators.required));
              }
            } else {
              if (this.controlIsNotRequired(key)) {
                formDataGroup.addControl(key, this.fb.control(valueToSet));
              } else {
                if (valueToSet === '') {
                  formDataGroup.addControl(key, this.fb.control(valueToSet, Validators.required));
                }
                else {
                  formDataGroup.addControl(key, this.fb.control(valueToSet, Validators.required));
                }
              }
            }

          } else {
            const valueFormControl = formDataGroup.controls[key] as FormControl;

            if (valueToSet == 'true' || valueToSet == 'false') {
              valueFormControl.setValue((valueToSet === 'true'));
            } else {
              valueFormControl.setValue(valueToSet);
            }
          }
        }
      } else if (value !== null && value !== undefined && (typeof value) === 'object') {
        if (Array.isArray(value)) {
          if (this.has(formDataGroup.controls, key)) {
            formDataGroup.removeControl(key);
          }
          if (value.length > 0) {

            const arrayForm = [];
            value.forEach((element) => {
              const fbGroup = this.fb.group({
                id: ['', Validators.required]
              });

              this.iterateThroughtAllObject(element, fbGroup);
              arrayForm.push(fbGroup);
            });
            formDataGroup.addControl(key, this.fb.array(arrayForm));
          } else {
            formDataGroup.addControl(key, this.fb.array([]));
          }
        } else {
          if (key !== 'anonimousUser') {
            if (!this.has(formDataGroup.controls, key)) {
              formDataGroup.addControl(key, this.fb.group({
                id: ['', Validators.required]
              }));
            }
            const form = formDataGroup.get(key);
            if (value.id != '0' && value.id != '') {
              this.iterateThroughtAllObject(value, form);
            }

            if ((key.includes('solucionAnti') ||
              key.includes('solicitud') ||
              key.includes('knowYour') ||
              key.includes('antiLaundering') ||
              key.includes('columnaVertebralColumnaVertebral')) && (value.id == '0' || value.id == '')/*form.get('id').value == '0'*/) {
              formDataGroup.removeControl(key);
            }
            if (
              form.get('id') !== undefined &&
              form.get('id') !== null &&
              form.get('id').value == '') {
              formDataGroup.removeControl(key);
            }
          }
        }
      }

    });
  }

  iterateThroughtAllObjectDisability(obj: any, groupControl: any) {
    const formDataGroup = groupControl as FormGroup;
    Object.keys(obj).forEach(e => {
      const key = e;
      const value = obj[key];
      if (value !== undefined && (typeof value) !== 'object') {

        const valueToSet = (value === null || value === undefined) ? '' : value;

        if (valueToSet !== undefined) {
          if (!this.has(formDataGroup.controls, key)) {
            // tslint:disable-next-line: triple-equals
            if (valueToSet == 'true' || valueToSet == 'false') {
              if (this.controlIsNotRequiredDisability(key)) {
                formDataGroup.addControl(key, this.fb.control((valueToSet === 'true')));
              } else {
                formDataGroup.addControl(key, this.fb.control((valueToSet === 'true'), Validators.required));
              }
            } else {
              if (this.controlIsNotRequiredDisability(key)) {
                formDataGroup.addControl(key, this.fb.control(valueToSet));
              } else {
                if (valueToSet === '') {
                  formDataGroup.addControl(key, this.fb.control(valueToSet, Validators.required));
                }
                else {
                  formDataGroup.addControl(key, this.fb.control(valueToSet, Validators.required));
                }
              }
            }

          } else {
            const valueFormControl = formDataGroup.controls[key] as FormControl;

            if (valueToSet == 'true' || valueToSet == 'false') {
              valueFormControl.setValue((valueToSet === 'true'));
            } else {
              valueFormControl.setValue(valueToSet);
            }
          }
        }
      } else if (value !== null && value !== undefined && (typeof value) === 'object') {
        if (Array.isArray(value)) {
          if (this.has(formDataGroup.controls, key)) {
            formDataGroup.removeControl(key);
          }
          if (value.length > 0) {

            const arrayForm = [];
            value.forEach((element) => {
              const fbGroup = this.fb.group({
                id: ['', Validators.required]
              });

              this.iterateThroughtAllObjectDisability(element, fbGroup);
              arrayForm.push(fbGroup);
            });
            formDataGroup.addControl(key, this.fb.array(arrayForm));
          } else {
            formDataGroup.addControl(key, this.fb.array([]));
          }
        } else {
          if (key !== 'anonimousUser') {
            if (!this.has(formDataGroup.controls, key)) {
              formDataGroup.addControl(key, this.fb.group({
                id: ['', Validators.required]
              }));
            }
            const form = formDataGroup.get(key);
            if (value.id != '0' && value.id != '') {
              this.iterateThroughtAllObjectDisability(value, form);
            }

            if ((key.includes('solucionAnti') ||
              key.includes('solicitud') ||
              key.includes('knowYour') ||
              key.includes('antiLaundering') ||
              key.includes('columnaVertebralColumnaVertebral')) && (value.id == '0' || value.id == '')/*form.get('id').value == '0'*/) {
              formDataGroup.removeControl(key);
            }
            if (
              form.get('id') !== undefined &&
              form.get('id') !== null &&
              form.get('id').value == '') {
              formDataGroup.removeControl(key);
            }
          }
        }
      }

    });
  }

  iterateThroughtAllObjectVida(obj: any, groupControl: any) {
    const formDataGroup = groupControl as FormGroup;
    Object.keys(obj).forEach(e => {
      const key = e;
      const value = obj[key];
      if (value !== undefined && (typeof value) !== 'object') {

        const valueToSet = (value === null || value === undefined) ? '' : value;

        if (valueToSet !== undefined) {
          if (!this.has(formDataGroup.controls, key)) {
            // tslint:disable-next-line: triple-equals
            if (valueToSet == 'true' || valueToSet == 'false') {
              if (this.controlIsNotRequiredVida(key)) {
                formDataGroup.addControl(key, this.fb.control((valueToSet === 'true')));
              } else {
                formDataGroup.addControl(key, this.fb.control((valueToSet === 'true'), Validators.required));
              }
            } else {
              if (this.controlIsNotRequiredVida(key)) {
                formDataGroup.addControl(key, this.fb.control(valueToSet));
              } else {
                if (valueToSet === '') {
                  formDataGroup.addControl(key, this.fb.control(valueToSet, Validators.required));
                }
                else {
                  formDataGroup.addControl(key, this.fb.control(valueToSet, Validators.required));
                }
              }
            }

          } else {
            const valueFormControl = formDataGroup.controls[key] as FormControl;

            if (valueToSet == 'true' || valueToSet == 'false') {
              valueFormControl.setValue((valueToSet === 'true'));
            } else {
              valueFormControl.setValue(valueToSet);
            }
          }
        }
      } else if (value !== null && value !== undefined && (typeof value) === 'object') {
        if (Array.isArray(value)) {
          if (this.has(formDataGroup.controls, key)) {
            formDataGroup.removeControl(key);
          }
          if (value.length > 0) {

            const arrayForm = [];
            value.forEach((element) => {
              const fbGroup = this.fb.group({
                id: ['', Validators.required]
              });

              this.iterateThroughtAllObjectVida(element, fbGroup);
              arrayForm.push(fbGroup);
            });
            formDataGroup.addControl(key, this.fb.array(arrayForm));
          } else {
            formDataGroup.addControl(key, this.fb.array([]));
          }
        } else {
          if (key !== 'anonimousUser') {
            if (!this.has(formDataGroup.controls, key)) {
              formDataGroup.addControl(key, this.fb.group({
                id: ['', Validators.required]
              }));
            }
            const form = formDataGroup.get(key);
            if (value.id != '0' && value.id != '') {
              this.iterateThroughtAllObjectVida(value, form);
            }

            if ((key.includes('solucionAnti') ||
              key.includes('solicitud') ||
              key.includes('knowYour') ||
              key.includes('antiLaundering') ||
              key.includes('columnaVertebralColumnaVertebral')) && (value.id == '0' || value.id == '')/*form.get('id').value == '0'*/) {
              formDataGroup.removeControl(key);
            }
            if (
              form.get('id') !== undefined &&
              form.get('id') !== null &&
              form.get('id').value == '') {
              formDataGroup.removeControl(key);
            }
          }
        }
      }

    });
  }

  iterateThroughtAllObjectForms(obj: any, groupControl: any) {
    const formDataGroup = groupControl as FormGroup;
    Object.keys(obj).forEach(e => {
      const key = e;
      const value = obj[key];
      if (value !== undefined && (typeof value) !== 'object') {

        const valueToSet = (value === null || value === undefined) ? '' : value;

        if (valueToSet !== undefined) {
          if (!this.has(formDataGroup.controls, key)) {
            // tslint:disable-next-line: triple-equals
            if (valueToSet == 'true' || valueToSet == 'false') {
              if (this.controlIsNotRequiredForm(key)) {
                formDataGroup.addControl(key, this.fb.control((valueToSet === 'true')));
              } else {
                formDataGroup.addControl(key, this.fb.control((valueToSet === 'true'), Validators.required));
              }
            } else {
              if (this.controlIsNotRequiredForm(key)) {
                formDataGroup.addControl(key, this.fb.control(valueToSet));
              } else {
                if (valueToSet === '') {
                  formDataGroup.addControl(key, this.fb.control(valueToSet, Validators.required));
                }
                else {
                  formDataGroup.addControl(key, this.fb.control(valueToSet, Validators.required));
                }
              }
            }

          } else {
            const valueFormControl = formDataGroup.controls[key] as FormControl;

            if (valueToSet == 'true' || valueToSet == 'false') {
              valueFormControl.setValue((valueToSet === 'true'));
            } else {
              valueFormControl.setValue(valueToSet);
            }
          }
        }
      } else if (value !== null && value !== undefined && (typeof value) === 'object') {
        if (Array.isArray(value)) {
          if (this.has(formDataGroup.controls, key)) {
            formDataGroup.removeControl(key);
          }
          if (value.length > 0) {

            const arrayForm = [];
            value.forEach((element) => {
              const fbGroup = this.fb.group({
                id: ['', Validators.required]
              });

              this.iterateThroughtAllObject(element, fbGroup);
              arrayForm.push(fbGroup);
            });
            formDataGroup.addControl(key, this.fb.array(arrayForm));
          } else {
            formDataGroup.addControl(key, this.fb.array([]));
          }
        } else {
          if (key !== 'anonimousUser') {
            if (!this.has(formDataGroup.controls, key)) {
              formDataGroup.addControl(key, this.fb.group({
                id: ['', Validators.required]
              }));
            }
            const form = formDataGroup.get(key);
            if (value.id != '0' && value.id != '') {
              this.iterateThroughtAllObject(value, form);
            }

            if ((key.includes('solucionAnti') ||
              key.includes('solicitud') ||
              key.includes('knowYour') ||
              key.includes('antiLaundering') ||
              key.includes('columnaVertebralColumnaVertebral')) && (value.id == '0' || value.id == '')/*form.get('id').value == '0'*/) {
              formDataGroup.removeControl(key);
            }
            if (
              form.get('id') !== undefined &&
              form.get('id') !== null &&
              form.get('id').value == '') {
              formDataGroup.removeControl(key);
            }
          }
        }
      }

    });
  }

  controlIsNotRequired(key) {
    for (const idx in this.excludedKeys) {
      if (Object.prototype.hasOwnProperty.call(this.excludedKeys, idx)) {
        if (key === this.excludedKeys[idx]) {
          return true;
        } else if ((key.charAt(key.length - 3) + key.charAt(key.length - 2) + key.charAt(key.length - 1)) === 'Url') {
          return true;
        }
      }
    }
  }

  controlIsNotRequiredForm(key) {
    for (const idx in this.excludedKeysForm) {
      if (Object.prototype.hasOwnProperty.call(this.excludedKeysForm, idx)) {
        if (key === this.excludedKeysForm[idx]) {
          return true;
        } else if ((key.charAt(key.length - 3) + key.charAt(key.length - 2) + key.charAt(key.length - 1)) === 'Url') {
          return true;
        }
      }
    }
  }

  controlIsNotRequiredDisability(key) {
    for (const idx in this.excludedKeysDisability) {
      if (Object.prototype.hasOwnProperty.call(this.excludedKeysDisability, idx)) {
        if (key === this.excludedKeysDisability[idx]) {
          return true;
        } else if ((key.charAt(key.length - 3) + key.charAt(key.length - 2) + key.charAt(key.length - 1)) === 'Url') {
          return true;
        }
      }
    }
  }
  controlIsNotRequiredVida(key) {
    for (const idx in this.excludedKeysVida) {
      if (Object.prototype.hasOwnProperty.call(this.excludedKeysVida, idx)) {
        if (key === 'healthDeclaration') {
          console.log(key, this.excludedKeysVida[idx], key === this.excludedKeysVida[idx]);
        }
        if (key === this.excludedKeysVida[idx]) {
          return true;
        } else if ((key.charAt(key.length - 3) + key.charAt(key.length - 2) + key.charAt(key.length - 1)) === 'Url') {
          return true;
        }
      }
    }
  }
}
