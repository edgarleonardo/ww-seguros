import { Component, OnInit, Output, EventEmitter, Input, DoCheck, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { FormArrayGeneratorService } from 'src/app/core/services/forms/form-array-generator.service';
import { FieldConfig } from 'src/app/shared/components/form-components/models/field-config';
import { DisabilityService } from '../disability/services/disability.service';
import { $country, $weightTypes, $heightTypes, $time, $family, $sex } from 'src/app/core/form/objects';
import { FormHandlerService } from 'src/app/core/services/forms/form-handler.service';
import { DiseaseService } from '../../../shared/components/disease/shared/disease/disease.service';
import { UserService } from '../../../../../core/services/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { DialogOptionService } from 'src/app/core/services/dialog/dialog-option.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { BaseDialogComponent } from 'src/app/shared/components/base-dialog/base-dialog.component';
import { FormDataFillingService } from 'src/app/modules/dashboard/services/shared/formDataFillingService';
import { map, first } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import { RequestsService } from 'src/app/modules/dashboard/services/requests/requests.service';
import {CountryRolesService} from "../../../../../shared/services/country-roles.service";
// tslint:disable: forin
// tslint:disable: one-line

@Component({
  selector: 'app-disability',
  templateUrl: './disability.component.html',
  styleUrls: ['./disability.component.scss']
})
export class DisabilityComponent implements OnInit, DoCheck {
  sicknessQuestions: any[];
  coveragesQuestions: any[];
  todayDate = new Date();
  changingCoveragesList: FormArray;
  filesStudiesArray: FormArray;
  arrayFilesTitles = [];
  filesDocumentsKnowClientArray: FormArray;
  arrayFilesTitlesDocumentsKnowClient = [];
  filesCopyIdArray: FormArray;
  arrayFilesTitlesCopyId = [];
  mercantileRegisterArray: FormArray;
  arrayFilesTitlesMercantile = [];
  role: string;
  routeSelected = 'disability';
  accordionTitles = [
    'Sección A. Datos del propuesto Asegurado y Estatus laboral',
    'Sección B. Datos del Contratante', 'Sección C. Cuestionario Médico',
    'Sección D. Opción del Plan', 'Sección E. Beneficiarios Primarios',
    'Beneficiario(s) Contigente(s)', 'Archivos Adjuntos'];
  bmi: number;
  step: number;

  // massName = 'PESO';
  // heightName = 'ALTURA';
  showContent = false;

  genderOptions: FieldConfig = {

    label: '',
    options: [
      {
        value: 'MASCULINO',
        viewValue: 'MASCULINO'
      },
      {
        value: 'FEMENINO',
        viewValue: 'FEMENINO'
      }
    ]
  };
  idType: FieldConfig =
    {
      label: 'Tipo de documento de identidad',
      options: [
        {
          value: 'CÉDULA',
          viewValue: 'CÉDULA',
        },
        {
          value: 'PASAPORTE',
          viewValue: 'PASAPORTE',
        }
      ],
      name: 'id2Type',
    };
  idTypeRepre: FieldConfig =
    {
      label: 'Tipo de documento de identidad',
      options: [
        {
          value: 'CÉDULA',
          viewValue: 'CÉDULA',
        },
        {
          value: 'PASAPORTE',
          viewValue: 'PASAPORTE',
        }
      ],
      name: 'idTypeRepre',
    };
  contractOPtions: FieldConfig = {
    label: '',
    options: [
      {
        value: 'PERMANENTE',
        viewValue: 'PERMANENTE'
      },
      {
        value: 'TEMPORAL',
        viewValue: 'TEMPORAL'
      }
    ]
  };

  type = {
    label: 'Tipo de Solicitud',
    options: [
      {
        value: 'vida',
        viewValue: 'Solicitud de Seguro de Vida',
        link: '/dashboard/requests/new-requests/life'
      },
      {
        value: 'disability',
        viewValue: 'Solicitud de Suscripción Disability',
        link: '/dashboard/requests/new-requests/disability'
      },
      {
        value: 'gastos mayores',
        viewValue: 'Suscripción Seguro Gastos Médicos Mayores',
        link: '/dashboard/requests/new-requests/major-expenses'
      }
    ]
  };

  currencyOptions: FieldConfig = {
    label: 'Moneda',
    options: this.disabilityService.currencyArray
  };

  YesNo: FieldConfig = {
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

  weightUnit = {
    label: 'Unidad de peso',
    options: $weightTypes,
    name: 'weightUnit'
  };

  heightUnit = {
    label: 'Unidad de altura',
    options: $heightTypes,
    name: 'heightUnit'
  };

  status: FieldConfig = {
    label: 'Estado Civil',
    options: [
      {
        value: 'CASADO',
        viewValue: 'CASADO'
      },
      {
        value: 'SOLTERO',
        viewValue: 'SOLTERO'
      },
      {
        value: 'UNIÓN LIBRE',
        viewValue: 'UNIÓN LIBRE'
      },
      {
        value: 'DIVORCIADO',
        viewValue: 'DIVORCIADO'
      }
    ]
  };

  countryList: FieldConfig = {
    label: 'País de Nacimiento',
    options: $country
  };

  country: FieldConfig = {
    label: 'País',
    options: $country
  };

  countryTaxing: FieldConfig = {
    label: 'País donde tributa por sus ingresos',
    options: $country
  };

  heightList: FieldConfig = {
    label: 'Unidad',
    options: $heightTypes
  };

  weightList: FieldConfig = {
    label: 'Unidad',
    options: $weightTypes
  };

  testOptions: FieldConfig = {

    label: '¿Cuál?',
    options: this.disabilityService.testArray

  };

  countryList2: FieldConfig = {
    label: 'País de residencia',
    options: $country
  };

  cityList: FieldConfig = {
    label: 'Ciudad',
    options: [
      {
        value: 'santiago',
        viewValue: 'Santiago'
      }
    ]
  };

  waitingTime: FieldConfig = {
    label: '',
    options: [
      {
        value: '30 DÍAS',
        viewValue: '30 DÍAS'
      },
      {
        value: '60 DÍAS',
        viewValue: '60 DÍAS'
      },
      {
        value: '90 DÍAS',
        viewValue: '90 DÍAS'
      },
      {
        value: '120 DÍAS',
        viewValue: '120 DÍAS'
      }
    ]
  };

  lifeOptions: FieldConfig = {

    label: 'Vida/MA&D',
    options: this.disabilityService.lifeArray

  };

  rentArray: any[] = [
    { value: 'US$ 1,000', viewValue: 'US$ 1,000' },
    { value: 'US$ 2,000', viewValue: 'US$ 2,000' },
    { value: 'US$ 3,000', viewValue: 'US$ 3,000' },
    { value: 'US$ 4,000', viewValue: 'US$ 4,000' },
    { value: 'US$ 5,000', viewValue: 'US$ 5,000' },
    { value: 'US$ 6,000', viewValue: 'US$ 6,000' },
    { value: 'US$ 7,000', viewValue: 'US$ 7,000' },
    { value: 'US$ 8,000', viewValue: 'US$ 8,000' },
    { value: 'US$ 9,000', viewValue: 'US$ 9,000' },
    { value: 'US$ 10,000', viewValue: 'US$ 10,000' },
    { value: 'US$ 11,000', viewValue: 'US$ 11,000' },
    { value: 'US$ 12,000', viewValue: 'US$ 12,000' }
  ];

  trashArray = [
    { value: 'US$ 1,000', viewValue: 'US$ 1,000' },
    { value: 'US$ 2,000', viewValue: 'US$ 2,000' },
    { value: 'US$ 3,000', viewValue: 'US$ 3,000' },
    { value: 'US$ 4,000', viewValue: 'US$ 4,000' },
    { value: 'US$ 5,000', viewValue: 'US$ 5,000' },
    { value: 'US$ 6,000', viewValue: 'US$ 6,000' },
    { value: 'US$ 7,000', viewValue: 'US$ 7,000' },
    { value: 'US$ 8,000', viewValue: 'US$ 8,000' },
    { value: 'US$ 9,000', viewValue: 'US$ 9,000' },
    { value: 'US$ 10,000', viewValue: 'US$ 10,000' },
    { value: 'US$ 11,000', viewValue: 'US$ 11,000' },
    { value: 'US$ 12,000', viewValue: 'US$ 12,000' }
  ];

  rentOptions: FieldConfig = {

    label: 'Renta Disability',
    options: this.rentArray

  };

  year = {
    label: 'Seleccione',
    options: $time,
    name: 'time'
  };

  sicknessOptions: FieldConfig = {
    label: 'Enfermedades/Desordenes',
    options: [
      {
        value: 'DEPRESIÓN',
        viewValue: 'DEPRESIÓN'
      },
      {
        value: 'HIPERTENSIÓN ARTERIAL',
        viewValue: 'HIPERTENSIÓN ARTERIAL'
      },
      {
        value: 'DESÓRDENES CARDIOVASCULARES',
        viewValue: 'DESÓRDENES CARDIOVASCULARES'
      },
      {
        value: 'DESÓRDENES DE HÍGADO',
        viewValue: 'DESÓRDENES DE HÍGADO'
      },
      {
        value: 'DESÓRDENES DIGESTIVOS',
        viewValue: 'DESÓRDENES DIGESTIVOS'
      },
      {
        value: 'DESÓRDENES RENALES',
        viewValue: 'DESÓRDENES RENALES'
      },
      {
        value: 'DESÓRDENES REUMÁTICOS',
        viewValue: 'DESÓRDENES REUMÁTICOS'
      },
      {
        value: 'DESÓRDENES RESPIRATORIOS O PULMONARES',
        viewValue: 'DESÓRDENES RESPIRATORIOS O PULMONARES'
      },
      {
        value: 'DESÓRDENES GINECOLÓGICOS',
        viewValue: 'DESÓRDENES GINECOLÓGICOS'
      },
      {
        value: 'DESÓRDENES UROLÓGICOS O METABÓLICOS (DIABETES, HIPERCOLESTEROLEMIA)',
        viewValue: 'DESÓRDENES UROLÓGICOS O METABÓLICOS (DIABETES, HIPERCOLESTEROLEMIA)'
      },
      {
        value: 'DESÓRDENES OSTEOARTICULARES (DISCAL, VERTEBRAL Y PARAVERTEBRAL, LUMBADO, CLÁTICA)',
        viewValue: 'DESÓRDENES OSTEOARTICULARES (DISCAL, VERTEBRAL Y PARAVERTEBRAL, LUMBADO, CLÁTICA)'
      }
    ]
  };

  negationOptions: FieldConfig = {
    label: '',
    options: [
      {
        value: 'DECLINADO',
        viewValue: 'DECLINADO'
      },
      {
        value: 'APLAZADO',
        viewValue: 'APLAZADO'
      },
      {
        value: 'RECARGADO',
        viewValue: 'RECARGADO'
      },
      {
        value: 'LIMITADO',
        viewValue: 'LIMITADO'
      },
    ]
  };

  policyOptions: FieldConfig = {
    label: 'Tipo de Póliza',
    options: [
      {
        value: 'SALUD',
        viewValue: 'SALUD'
      },
      {
        value: 'VIDA',
        viewValue: 'VIDA'
      }
    ]
  };

  durationTime: FieldConfig = {
    label: 'Tiempo',
    options: [
      {
        value: 'MES(ES)',
        viewValue: 'MES(ES)'
      },
      {
        value: 'AÑO(S)',
        viewValue: 'AÑO(S)'
      }
    ]
  };

  family = $family;

  typeRequestGroup: FormGroup;

  disabilityGroup: FormGroup;
  mainFormArray: FormArray;
  mainProperty;
  contingentFormArray: FormArray;
  contingentProperty;
  testArray: FormArray;
  testProperty;
  sickPayArray: FormArray;
  sickPayProperty;
  therapyArray: FormArray;
  therapyProperty;
  otherAnalysisArray: FormArray;
  otherAnalysisProperty;
  inpatientCareArray: FormArray;
  inpatientCareProperty;
  hospitalizationArray: FormArray;
  hospitalizationProperty;
  bloodSickArray: FormArray;
  bloodSickProperty;
  VIHArray: FormArray;
  VIHProperty;
  specialTherapyArray: FormArray;
  specialTherapyProperty;
  accidentArray: FormArray;
  accidentProperty;
  denyArray: FormArray;
  denyProperty;
  insuranceArray: FormArray;
  insuranceProperty;
  existingCoveragesList: FormArray;

  primaryBeneficaryTitles = [];
  contigentBeneficaryTitles = [];
  primaryAnotherTitle: any;
  contigentAnotherTitle: any;

  money_laundering: FormGroup;
  know_client: FormGroup;


  mainGroup = {
    full_name: ['', Validators.required],
    id2: ['', Validators.required],
    id2Attached: [''],
    id2Type: ['', Validators.required],
    nationality: ['', Validators.required],
    ocupation: ['', Validators.required],
    family: ['', Validators.required],
    percentage: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
  };

  contingentGroup = {
    full_name: [''],
    id2: [''],
    id2Type: [''],
    id2Attached: [''],
    nationality: [''],
    ocupation: [''],
    family: [''],
    percentage: ['', [Validators.min(1), Validators.max(100)]]
  };

  testGroup = {
    date: ['', Validators.required],
    test: ['', Validators.required],
  };

  therapyGroup = {
    diagnosis: ['', Validators.required],
    date: ['', Validators.required],
    reason: ['', Validators.required],
    therapy: ['', Validators.required]
  };

  sickPayGroup = {
    date: ['', Validators.required],
    reason: ['', Validators.required],
    therapy: ['', Validators.required]
  };

  otherAnalysisGroup = {
    date: ['', Validators.required],
    reason: ['', Validators.required],
  };

  sex = $sex;

  parentescoAsegurado = {
    label: 'Parentesco con el asegurado',
    name: 'relationship',
    options: $family.options
  };

  policyHolderGroup = {
    name: ['', Validators.required],
    secondName: [''],
    lastName: ['', Validators.required],
    birthdate: ['', Validators.required],
    sex: ['', Validators.required],
    id_passport: ['', Validators.required],
    id2Type: ['', Validators.required],
    // idTypeRepre: ['', Validators.required],
    marital_status: ['', Validators.required],
    nationality: ['', Validators.required],
    telephone: [''],
    officeTel: [''],
    fax: [''],
    cell: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    // annual_income: ['', [Validators.required, Validators.min(1)]],
    // currency: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    country_residence: ['', Validators.required],
    relationship: ['', Validators.required],
    pep_radio_payer: ['', Validators.required],
    // representative: ['', Validators.required],
    // passport_id: ['', Validators.required],
    id2Attached: ['', Validators.required],
    businessName: ['', Validators.required],
    businessOcupation: ['', Validators.required],
    businessAddress: ['', Validators.required],
    businessCountry: ['', Validators.required],
    businessInsurancePurpose: ['', Validators.required],
    policyHolderTaxCountry: ['', Validators.required],
  };

  policyPayerGroup = {
    name: ['', Validators.required],
    secondName: [''],
    lastName: ['', Validators.required],
    birthdate: ['', Validators.required],
    sex: ['', Validators.required],
    id_passport: ['', Validators.required],
    id2Type: ['', Validators.required],
    // idTypeRepre: ['', Validators.required],
    marital_status: ['', Validators.required],
    nationality: ['', Validators.required],
    telephone: [''],
    officeTel: [''],
    fax: [''],
    cell: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    // annual_income: ['', [Validators.required, Validators.min(1)]],
    // currency: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    country_residence: ['', Validators.required],
    relationship: ['', Validators.required],
    pep_radio_payer: ['', Validators.required],
    // representative: ['', Validators.required],
    // passport_id: ['', Validators.required],
    id2Attached: ['', Validators.required],
    businessName: ['', Validators.required],
    businessOcupation: ['', Validators.required],
    businessAddress: ['', Validators.required],
    businessCountry: ['', Validators.required],
    businessInsurancePurpose: ['', Validators.required],
    policyHolderTaxCountry: ['', Validators.required],
  };

  inpatientCareGroup = {
    date: ['', Validators.required],
    reason: ['', Validators.required],
  };

  hospitalizationGroup = {
    date: ['', Validators.required],
    reason: ['', Validators.required],
  };

  bloodSickGroup = {
    date: ['', Validators.required],
    name: ['', Validators.required],
    reason: ['', Validators.required]
  };

  VIHGroup = {
    date: ['', Validators.required],
    name: ['', Validators.required],
    // reason: ['', Validators.required]
  };

  specialTherapyGroup = {
    date: ['', Validators.required],
    name: ['', Validators.required],
    reason: ['', Validators.required]
  };

  accidentGroup = {
    date: ['', Validators.required],
    effects: ['', Validators.required],
    reason: ['', Validators.required]
  };

  denyGroup = {
    negationRadio: ['', Validators.required],
    reason: ['', Validators.required]
  };

  insuranceGroup = {
    company: ['', Validators.required],
    num: ['', Validators.required],
    name: ['', Validators.required],
    insured_company: ['', Validators.required],
    policy: ['', Validators.required],
    date: ['', Validators.required],
    claim_radio: ['', Validators.required]
  };

  noCotizacion;
  age;

  juridicalObligatoryOptions: any;
  physicalObligatoryOptions: any;

  @ViewChild('form', { static: false }) form;

  constructor(
    private fb: FormBuilder,
    private dataMappingFromApi: FormDataFillingService,
    public formMethods: FormArrayGeneratorService,
    private disabilityService: DisabilityService,
    public formHandler: FormHandlerService,
    public diseaseService: DiseaseService,
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogModal: DialogService,
    private dialogOption: DialogOptionService,
    public dialog: MatDialog,
    public appComponent: AppComponent,
    private cd: ChangeDetectorRef,
    public requestService: RequestsService,
    private countryRolesService: CountryRolesService,
  ) { }

  ID = null;
  disableRequestDropdown = false;

  ngOnInit() {

    //this.ID = this.disabilityService.id;

    this.requestService.getJuridicalObligatoryOptions().subscribe((res: any) => {
      const Options = [];
      for (const key in res.data) {
        if (Object.prototype.hasOwnProperty.call(res.data, key)) {
          const element = res.data[key];
          Options.push({ value: element.descripcion, viewValue: element.descripcion, obligatory: element.sujeto_obligado });
        }
      }
      this.juridicalObligatoryOptions = {
        options: Options
      };
    });

    this.requestService.getPhysicalObligatoryOptions().subscribe((res: any) => {
      const Options = [];
      for (const key in res.data) {
        if (Object.prototype.hasOwnProperty.call(res.data, key)) {
          const element = res.data[key];
          Options.push({ value: element.descripcion, viewValue: element.descripcion, obligatory: element.sujeto_obligado });
        }
      }
      this.physicalObligatoryOptions = {
        options: Options
      };
    });


    this.route.params.subscribe(res => {
      this.ID = res.id;
    });
    this.route.params.subscribe(res => {
      this.noCotizacion = res.noCotizacion;
    });
    if (this.ID != null) {
      console.log('El ID es ' + this.ID);
      this.getData(this.ID);
      this.disableRequestDropdown = true;
    } else if (this.ID == null) {
      console.log('ID esta vacio');
    }

    this.role = this.countryRolesService.getLocalStorageCountry().dominio;

    this.sicknessQuestions = [
      {
        label: 'Hipertensión arterial',
        name: 'haveHypertension'
      },
      {
        label: 'Artritis',
        name: 'haveArthritis'
      },
      {
        label: 'Desórdenes cardiovasculares',
        name: 'haveCardiovascular'
      },
      {
        label: 'Padecimientos renales',
        name: 'haveRenalUrinary'
      },
      {
        label: 'Padecimientos metabólicos (diabetes, hipercolesterolemia)',
        name: 'haveMetabolics'
      },
      {
        label: 'Padecimientos musculoesqueleticos',
        name: 'haveMusculoSkeletal'
      },
      {
        label: 'Desórdenes urológicos',
        name: 'haveProstatics'
      },
      {
        label: 'Desórdenes osteoarticulares (discal, vertebral y paravertebral, lumbado, clática)',
        name: 'haveSpine'
      },
      {
        label: 'Padecimientos de hígado',
        name: 'haveLiver'
      },
      {
        label: 'Padecimientos digestivos',
        name: 'haveDigestive'
      },
      {
        label: 'Padecimientos reumáticos',
        name: 'haveRheumatic'
      },
      {
        label: 'Desórdenes respiratorios o pulmonares',
        name: 'haveLung'
      },
      {
        label: 'Padecimientos ginecológicos',
        name: 'haveGynecology'
      }
    ];

    this.coveragesQuestions = [
      {
        // tslint:disable-next-line: max-line-length
        label: '1.a. ¿La persona propuesta para seguro tiene alguna cobertura existente, o alguna solicitud pendiente para seguro de vida o anualidad con esta compañía o cualquier otra?',
        name: 'hasAnotherCoverage',
        group: 'anotherCoverages'
      },
      {
        label: '1.b. ¿Tiene la persona propuesta para seguro la intención de remplazar, descontinuar o cambiar alguna de estas coberturas?',
        name: 'changeAnotherCoverage',
        group: 'changingCoverages'
      }
    ];

    this.mainProperty = this.fb.array([this.formMethods.createItem(this.mainGroup)]);
    this.contingentProperty = this.fb.array([this.formMethods.createItem(this.contingentGroup)]);
    this.testProperty = this.fb.array([this.formMethods.createItem(this.testGroup)]);
    this.sickPayProperty = this.fb.array([this.formMethods.createItem(this.sickPayGroup)]);
    this.therapyProperty = this.fb.array([this.formMethods.createItem(this.therapyGroup)]);
    this.otherAnalysisProperty = this.fb.array([this.formMethods.createItem(this.otherAnalysisGroup)]);
    this.inpatientCareProperty = this.fb.array([this.formMethods.createItem(this.inpatientCareGroup)]);
    this.hospitalizationProperty = this.fb.array([this.formMethods.createItem(this.hospitalizationGroup)]);
    this.bloodSickProperty = this.fb.array([this.formMethods.createItem(this.bloodSickGroup)]);
    this.VIHProperty = this.fb.array([this.formMethods.createItem(this.VIHGroup)]);
    this.specialTherapyProperty = this.fb.array([this.formMethods.createItem(this.specialTherapyGroup)]);
    this.accidentProperty = this.fb.array([this.formMethods.createItem(this.accidentGroup)]);
    this.denyProperty = this.fb.array([this.formMethods.createItem(this.denyGroup)]);
    this.insuranceProperty = this.fb.array([this.formMethods.createItem(this.insuranceGroup)]);

    this.money_laundering = this.fb.group({}),
      this.know_client = this.fb.group({}),

      this.typeRequestGroup = this.fb.group({
        typeRequest: [''],

      });

    this.disabilityGroup = this.fb.group({

      // money_laundering: this.fb.group({}),
      // know_client: this.fb.group({}),

      num_financial_quote: ['', Validators.required],
      isComplete: [false, Validators.required],
      comentary: [''],

      // typeRequest:[''],
      insured_data: this.fb.group({
        name: ['', Validators.required],
        last_name: ['', Validators.required],
        birthdate: ['', Validators.required],
        gender: ['', Validators.required],
        job: ['', Validators.required],
        nationality: ['', Validators.required],
        id_passport: ['', Validators.required],
        id2Type: ['', Validators.required],
        id2Attached: [''],
        contract: ['', Validators.required],
        date_since: ['', Validators.required],
        date_until: ['', Validators.required],
        position: ['', Validators.required],
        salary: ['', [Validators.required, Validators.min(1)]],
        // currency: ['', Validators.required],
        address: ['', Validators.required],
        telephone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        job_description: ['', Validators.required],
        job_hours: [{ value: '', disabled: true }, [Validators.required, Validators.min(0)]],
        date: ['', Validators.required],
        reason_pension: [''],
        office_hours: ['', [Validators.required, Validators.min(0)]],
        company: ['', Validators.required],
        amount_pension: ['', Validators.min(1)],
        currency_pension: [''],
        outside_hours: ['', [Validators.required, Validators.min(0)]],
        pension_radio: ['', Validators.required],
        pep_radio_insured: ['', Validators.required],
        insuredPolicyholderRadio: ['', Validators.required],
        insuredPayerRadio: ['', Validators.required],
      }),
      // policyholder: this.fb.group(this.policyHolderGroup),
      questions: this.fb.group({
        smoker_radio: ['', Validators.required],
        alcohol_radio: ['', Validators.required],
        weight: ['', [Validators.required, Validators.min(1)]],
        height: ['', [Validators.required, Validators.min(1)]],
        weightUnit: ['', Validators.required],
        heightUnit: ['', Validators.required],
        bmiName: [{ value: '', disabled: true }, Validators.required],
        questionnaire: this.fb.group({
          health_radio: ['', Validators.required],
          therapy_radio: ['', Validators.required],
          sick_pay_radio: ['', Validators.required],
          analysis_radio: ['', Validators.required],
          other_analysis_radio: ['', Validators.required],
          inpatientCare_radio: ['', Validators.required],
          hospitalization_radio: ['', Validators.required],
          sicknessType_radio: ['', Validators.required],
          bloodSick_radio: ['', Validators.required],
          VIH_radio: ['', Validators.required],
          specialTherapy_radio: ['', Validators.required],
          accident_radio: ['', Validators.required],
          deny_radio: ['', Validators.required],
          insurance_radio: ['', Validators.required],
        })
      }),
      plan: this.fb.group({
        period: ['', Validators.required],
        life: ['', Validators.required],
        rent: ['', Validators.required]
      }),
      main: this.fb.group({
        full_name: [''],
        family: [''],
        id_passport: [''],
        id2Type: [''],
        id2Attached: [''],
        main_array: this.fb.array([this.formMethods.createItem(this.mainGroup)])
      }),
      contingent: this.fb.group({
        full_name: [''],
        family: [''],
        id_passport: [''],
        id2Type: [''],
        id2Attached: [''],
        contingent_array: this.fb.array([this.formMethods.createItem(this.contingentGroup)]),
        hasAnotherCoverage: ['', Validators.required],
        changeAnotherCoverage: ['', Validators.required],
      }),
      // bankTransfer: this.fb.group({
      //   bankEntity: [' '],
      //   amount: [' '],
      //   contact: [' ']
      // }),
      questionnaires: this.fb.group({}),
      files: this.fb.group({
        studies: this.fb.array([]),
      }),
    });

    this.mainFormArray = this.disabilityGroup.get('main').get('main_array') as FormArray;
    this.contingentFormArray = this.disabilityGroup.get('contingent').get('contingent_array') as FormArray;
    this.filesStudiesArray = this.disabilityGroup.get('files').get('studies') as FormArray;

    this.disabilityGroup.get('insured_data').get('birthdate').valueChanges.subscribe(value => {
      const timeDiff = Math.abs(Date.now() - new Date(value).getTime());
      this.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
      // this.disabilityGroup.get('person').get('this.age').setValue(this.age);
    });

  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep(panel?: string) {
    this.step++;
  }

  showWarningDot(form: any): boolean {

    if (this.form !== undefined) {
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

  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form.submitted) {
      return true;
    }

    if (this.disabilityGroup.dirty && !this.form.submitted) {
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

  getBmi() {
    const weightUnit = this.disabilityGroup.get('questions').get('weightUnit').value;
    const heightUnit = this.disabilityGroup.get('questions').get('heightUnit').value;

    let weight = this.disabilityGroup.get('questions').get('weight').value;
    let height = this.disabilityGroup.get('questions').get('height').value;
    let inches;

    if (this.disabilityGroup.get('questions').get('inches')) { inches = this.disabilityGroup.get('questions').get('inches').value; }

    if (weightUnit === 'LIBRAS') { weight = weight / 2.205; }
    if (heightUnit === 'PIE') {
      height = (((height * 12) + inches) * 2.54) / 100;
    }
    const bmi = weight / ((height / 100) * (height * 100));

    if (bmi !== Infinity && !isNaN(bmi)) {
      const value = parseFloat(`${bmi}`).toFixed(5);
      this.disabilityGroup.get('questions').get('bmiName').setValue(value);
    }
  }

  onHeightUnitChange(evento) {
    const form = this.disabilityGroup.get('questions') as FormGroup;
    if (evento.valor === 'PIE') {
      form.addControl('inches', this.fb.control('', [Validators.required, Validators.min(0), Validators.max(11)]));
    } else {
      form.removeControl('inches');
    }

    this.getBmi();
  }

  onWeightUnitChange() {
    this.getBmi();

  }

  // actualValue;
  y = 0
  x = 0;
  // xx = 0;
  ngDoCheck(): void {

    // if (this.disabilityGroup.get('questions').get('weightUnit').value != '' &&
    //   this.disabilityGroup.get('questions').get('heightUnit').value != '') {
    //   // &&
    //   // this.disabilityGroup.get('questions').get('weight').value != (null || undefined) &&
    //   // this.disabilityGroup.get('questions').get('height').value != (null || undefined)
    //   // console.log(this.disabilityGroup.get('questions').get('heightUnit').value);
    //   // console.log(this.disabilityGroup.get('questions').get('weightUnit').value);

    //   let weightConst;
    //   let heightConst;

    //   if (this.disabilityGroup.get('questions').get('weightUnit').value == 'libras') {
    //     weightConst = this.disabilityGroup.get('questions').get('weight').value / 2.205;
    //     // console.log("holaaaaaaaaaaaaaaaaa 1 " + weightConst);
    //   }
    //   else if (this.disabilityGroup.get('questions').get('weightUnit').value == 'kilogramos') {
    //     weightConst = this.disabilityGroup.get('questions').get('weight').value;
    //     // console.log("adiiooooooooooooooos 2 " + weightConst);
    //   }

    //   if (this.disabilityGroup.get('questions').get('heightUnit').value == 'pie') {
    //     heightConst = this.disabilityGroup.get('questions').get('height').value / 3.281;
    //     // console.log("saludoooooooooooooooooos 3" + heightConst);
    //   }
    //   else if (this.disabilityGroup.get('questions').get('heightUnit').value == 'metro') {
    //     heightConst = this.disabilityGroup.get('questions').get('height').value;
    //     // console.log("despedidadsdsaaaaaaaaaaaaaaaaasssssss 4" + heightConst);
    //   }

    //   this.bmi = Math.round((weightConst / (heightConst * heightConst) * 100)) / 100;
    //   this.disabilityGroup.get('questions').get('bmiName').setValue(this.bmi)
    //   // console.log(this.disabilityGroup.get('questions').get('weight').value / 2.205);
    //   // console.log(this.disabilityGroup.get('questions').get('height').value / 3.281);
    //   // console.log('this.bmi =======  aaaaaaaaaaaaaaaaaa ' + this.bmi);
    // }

    let valueSalary;
    // const plan = this.disabilityGroup.get('plan') as FormGroup;
    // console.log(this.disabilityGroup.get('insured_data').get('salary').value * 0.7 );
    // tslint:disable-next-line: prefer-for-of
    if (this.disabilityGroup.get('insured_data').get('salary').valueChanges) {
      valueSalary = this.disabilityGroup.get('insured_data').get('salary').value;
      this.y = 0;
    }

    if ((valueSalary != null ||
      valueSalary != undefined) &&
      valueSalary > 0) {
      // this.actualValue = valueSalary;
      // console.log(this.actualValue);
      if ((1000 < (valueSalary * 0.7)) && this.y == 0) {
        for (let x = 0; x < this.trashArray.length; x++) {
          // tslint:disable-next-line: radix
          if (this.rentArray[x] == (null || undefined) &&
            // tslint:disable-next-line: radix
            (Number.parseInt(this.trashArray[x].value.slice(3).replace(',', ''))) <
            (valueSalary * 0.7)) {

            this.rentArray.push(this.trashArray[x]);
            // tslint:disable-next-line: radix
            // console.log(Number.parseInt(this.rentArray[x].value.slice(3).replace(',', '')));
          }
        }
        // plan.removeControl('rent');
        // this.actualValue = valueSalary;
        this.y = 1;
        // plan.addControl('rent', this.fb.control(['', Validators.required]));
      }
      for (let x = 0; x < this.rentArray.length; x++) {
        // tslint:disable-next-line: radix
        if ((Number.parseInt(this.rentArray[x].value.slice(3).replace(',', ''))) >
          (valueSalary * 0.7)) {

          this.rentArray.splice(x, 1);
          this.y = 0;
          // tslint:disable-next-line: radix
          // console.log(Number.parseInt(this.rentArray[x].value.slice(3).replace(',', '')));
        }
      }
    }
    // console.log(this.rentArray);

    // tslint:disable-next-line: align
    if (this.age >= 50 && this.disabilityGroup.get('insured_data').get('gender').value == 'MASCULINO') {
      // if (this.xx != 0) {
      //   this.xx = 0;
      // }
      const questionnaires = this.disabilityGroup.get('questionnaires') as FormGroup;
      if (this.x == 0) {
        if (!this.disabilityGroup.get('questionnaires').get('solicitudProstatica')) {
          questionnaires.addControl('solicitudProstatica', this.fb.group({}));
          this.x++;
        }
        // this.disabilityGroup.get('questions').get('questionnaire').get('sicknessType_radio').setValue('si');
        // const var1 = {
        //   name: 'sicknessType_radio', valor: 'si'
        // };
        // this.selectChange(var1);
        // if (this.disabilityGroup.get('questions').get('questionnaire').get('sicknessType')) {
        //   this.disabilityGroup.get('questions').get('questionnaire').get('sicknessType').get('haveProstatics').setValue('si');
        //   this.x++;
        // }
      }
    }
    else if (this.age < 50 || this.disabilityGroup.get('insured_data').get('gender').value == 'FEMENINO') {
      // if (this.xx == 0) {
      //   this.x++;
      // }
      const questionnaires = this.disabilityGroup.get('questionnaires') as FormGroup;
      if (this.x != 0) {
        if (this.disabilityGroup.get('questionnaires').get('solicitudProstatica')) {
          questionnaires.removeControl('solicitudProstatica');
          this.x = 0;
        }
        // if (this.disabilityGroup.get('questions').get('questionnaire').get('sicknessType')) {
        //   this.disabilityGroup.get('questions').get('questionnaire').get('sicknessType').get('haveProstatics').setValue('no');
        //   this.x = 0;
        //   this.xx++;
        // }
      }
      if (this.disabilityGroup.get('questionnaires').get('solicitudProstatica') && this.ID != null) {
        this.x = 1;
      }
      // if (!this.disabilityGroup.get('questionnaires').get('solicitudProstatica') &&
      //   !this.disabilityGroup.get('questions').get('questionnaire').get('sicknessType')) {
      //   this.x = 0;
      // }
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('therapy_radio').value != 'SI' &&
      this.disabilityGroup.get('questions').get('questionnaire').get('therapy_array')) {

      const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
      formQDoCheck.removeControl('therapy_array');
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('sick_pay_radio').value != 'SI' &&
      this.disabilityGroup.get('questions').get('questionnaire').get('sick_pay_array')) {

      const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
      formQDoCheck.removeControl('sick_pay_array');
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('analysis_radio').value != 'SI' &&
      this.disabilityGroup.get('questions').get('questionnaire').get('analysis_array')) {

      const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
      formQDoCheck.removeControl('analysis_array');
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('other_analysis_radio').value != 'SI' &&
      this.disabilityGroup.get('questions').get('questionnaire').get('other_analysis_array')) {

      const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
      formQDoCheck.removeControl('other_analysis_array');
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('inpatientCare_radio').value != 'SI' &&
      this.disabilityGroup.get('questions').get('questionnaire').get('inpatientCare_array')) {

      const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
      formQDoCheck.removeControl('inpatientCare_array');
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('hospitalization_radio').value != 'SI' &&
      this.disabilityGroup.get('questions').get('questionnaire').get('hospitalization_array')) {

      const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
      formQDoCheck.removeControl('hospitalization_array');
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('bloodSick_radio').value != 'SI' &&
      this.disabilityGroup.get('questions').get('questionnaire').get('bloodSick_array')) {

      const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
      formQDoCheck.removeControl('bloodSick_array');
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('VIH_radio').value != 'SI' &&
      this.disabilityGroup.get('questions').get('questionnaire').get('VIH_array')) {

      const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
      formQDoCheck.removeControl('VIH_array');
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('specialTherapy_radio').value != 'SI' &&
      this.disabilityGroup.get('questions').get('questionnaire').get('specialTherapy_array')) {

      const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
      formQDoCheck.removeControl('specialTherapy_array');
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('accident_radio').value != 'SI' &&
      this.disabilityGroup.get('questions').get('questionnaire').get('accident_array')) {

      const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
      formQDoCheck.removeControl('accident_array');
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('deny_radio').value != 'SI' &&
      this.disabilityGroup.get('questions').get('questionnaire').get('deny_array')) {

      const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
      formQDoCheck.removeControl('deny_array');
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('insurance_radio').value != 'SI' &&
      this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array')) {

      const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
      formQDoCheck.removeControl('insurance_array');
    }

    if (this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array')) {
      // tslint:disable-next-line: prefer-for-of
      for (let x = 0; x < this.insuranceArray.controls.length; x++) {

        if ((this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array'
        ).get(x.toString()).get('claim_radio').value == 'NO' ||
          this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array'
          ).get(x.toString()).get('claim_radio').value == '' ||
          this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array'
          ).get(x.toString()).get('claim_radio').value == null ||
          this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array'
          ).get(x.toString()).get('claim_radio').value == undefined) &&
          this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array'
          ).get(x.toString()).get('claim')) {

          const formQDoCheck = this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array'
          ).get(x.toString()) as FormGroup;
          formQDoCheck.removeControl('claim');
        }
      }
    }

    if (this.disabilityGroup.get('contingent').get('hasAnotherCoverage').value != 'SI' &&
      this.disabilityGroup.get('contingent').get('anotherCoverages')) {

      const formCBDoCheck = this.disabilityGroup.get('contingent') as FormGroup;
      formCBDoCheck.removeControl('anotherCoverages');
    }

    if (this.disabilityGroup.get('contingent').get('hasAnotherCoverage').value == 'SI') {

      if (this.disabilityGroup.get('contingent').get('changeAnotherCoverage')) {
        if ((this.disabilityGroup.get('contingent').get('changeAnotherCoverage').value == 'NO'
          || this.disabilityGroup.get('contingent').get('changeAnotherCoverage').value == ''
          || this.disabilityGroup.get('contingent').get('changeAnotherCoverage').value == null
          || this.disabilityGroup.get('contingent').get('changeAnotherCoverage').value == undefined) &&
          this.disabilityGroup.get('contingent').get('changingCoverages')) {

          const formCBDoCheck = this.disabilityGroup.get('contingent') as FormGroup;
          formCBDoCheck.removeControl('changingCoverages');
        }
      }
    }

    let totalJobHours;
    let insideHours;
    let outsideHours;
    // if (this.disabilityGroup.get('insured_data').get('job_hours').valueChanges) {
    //   totalJobHours = this.disabilityGroup.get('insured_data').get('job_hours').value;
    // }
    insideHours = Number.parseFloat(this.disabilityGroup.get('insured_data').get('office_hours').value);
    outsideHours = Number.parseFloat(this.disabilityGroup.get('insured_data').get('outside_hours').value);
    // if (insideHours == null || insideHours == undefined) {
    //   insideHours = 0;
    // }
    // if (outsideHours == null || outsideHours == undefined) {
    //   outsideHours = 0;
    // }
    totalJobHours = (insideHours + outsideHours);
    // if ((insideHours == null || insideHours == undefined) && (outsideHours == null || outsideHours == undefined) ) {
    //   totalJobHours = '';
    // }
    this.disabilityGroup.get('insured_data').get('job_hours').setValue(totalJobHours);

    if (this.disabilityGroup.get('questions').get('questionnaire').get('analysis_array')) {
      let formQDoCheckArray;
      // tslint:disable-next-line: prefer-for-of
      for (let x = 0; x < this.testArray.controls.length; x++) {

        formQDoCheckArray = this.disabilityGroup.get('questions').get('questionnaire').get
          ('analysis_array').get(x.toString()) as FormGroup;

        if (this.disabilityGroup.get('questions').get('questionnaire').get
          ('analysis_array').get(x.toString()).get('test').value == 'OTROS') {

          if (!(this.disabilityGroup.get('questions').get('questionnaire').get
            ('analysis_array').get(x.toString()).get('specifyStudy'))) {
            formQDoCheckArray.addControl('specifyStudy', this.fb.control('', Validators.required));
          }
        }
        if (this.disabilityGroup.get('questions').get('questionnaire').get
          ('analysis_array').get(x.toString()).get('test').value != 'OTROS') {

          if (this.disabilityGroup.get('questions').get('questionnaire').get
            ('analysis_array').get(x.toString()).get('specifyStudy')) {
            formQDoCheckArray.removeControl('specifyStudy');
          }
        }
      }
    }
  }

  onStudiesChange(event, i, name, group?: string) {
    const reader = new FileReader();

    console.log(event);

    if (name == 'studies') {
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.disabilityGroup.get('files').get('studies').get(i.toString()).patchValue({
            ['study']: reader.result
          });

          //this.markForCheck();
        };
      }
    }
    else if (name == 'documentsKnowClient') {
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.disabilityGroup.get('files').get('documentsKnowClient').get(i.toString()).patchValue({
            ['document']: reader.result
          });

          //this.markForCheck();
        };
      }
    }
    else if (name == 'copyId') {
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.disabilityGroup.get('files').get('copyId').get(i.toString()).patchValue({
            ['idId']: reader.result
          });

          //this.markForCheck();
        };
      }
    } else if (name == 'mercantile') {
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.disabilityGroup.get('files').get('mercantile').get(i.toString()).patchValue({
            ['register']: reader.result
          });

          //this.markForCheck();
        };
      }
    } else if (name == 'commercialRegister') {
      console.log(name, group);
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.disabilityGroup.get(group).get(name).get(i.toString()).patchValue({
            [name + 's']: reader.result
          });
        };
      }
    } else if (name == 'legalRepresentativeId2') {
      console.log(name, group);
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.disabilityGroup.get(group).get(name).get(i.toString()).patchValue({
            [name + 's']: reader.result
          });
        };
      }
    } else if (name === 'policyholder') {
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.disabilityGroup.get(name).patchValue({
            ['id2Attached']: reader.result
          });

          //this.markForCheck();
        };
      }
    } else if (name === 'payer') {
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.disabilityGroup.get(name).patchValue({
            ['id2Attached']: reader.result
          });

          //this.markForCheck();
        };
      }
    } else if (name === 'insured_data') {
        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);

          reader.onload = () => {
            this.disabilityGroup.get(name).patchValue({
              ['id2Attached']: reader.result
            });

            //this.markForCheck();
          };
        }
    } else if (name === 'incomesCertified') {
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.disabilityGroup.get('files').patchValue({
            ['incomesCertified']: reader.result
          });

          //this.markForCheck();
        };
      }
    }
  }

  juridicalGroup() {
    return this.fb.group({
      businessName: ['', Validators.required],
      rnc: ['', Validators.required],
      family: ['', Validators.required],
      purpose: ['', Validators.required],
      taxCountry: ['', Validators.required],
      commercialRegister: this.fb.array([this.createFormArray('commercialRegister')]),
      legalRepresentativeId2: this.fb.array([this.createFormArray('legalRepresentativeId2')]),
    });
  }

  selectChange(event, position?) {
    const form = this.disabilityGroup.get('questions') as FormGroup;
    const formP = this.disabilityGroup.get('insured_data') as FormGroup;
    const formInsured = this.disabilityGroup.get('insured_data') as FormGroup;
    const formHolder = this.disabilityGroup.get('policyholder') as FormGroup;
    const formPayer = this.disabilityGroup.get('payer') as FormGroup;
    const questionnaires = this.disabilityGroup.get('questionnaires') as FormGroup;
    const formQ = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
    let formC;
    if (this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array')) {
      formC = this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array').get(position) as FormGroup;
    }
    const formGeneral = this.disabilityGroup as FormGroup;
    const formCB = this.disabilityGroup.get('contingent') as FormGroup;
    const formFiles = this.disabilityGroup.get('files') as FormGroup;

    console.log(event);

    if (event.name === 'mandatorySubject') {
      if (formP.get('policyholderKnowClientRadio').value === 'SI') {
        if (this.juridicalObligatoryOptions.options[this.juridicalObligatoryOptions.options.map((e) => e.value).indexOf(event.valor)].obligatory === '1') {
          formGeneral.addControl('antiLaundering', this.fb.group({}));
        } else {
          formGeneral.removeControl('antiLaundering');
        }
      } else if (formP.get('policyholderKnowClientRadio').value === 'NO') {
        if (this.physicalObligatoryOptions.options[this.physicalObligatoryOptions.options.map((e) => e.value).indexOf(event.valor)].obligatory === '1') {
          formGeneral.addControl('antiLaundering', this.fb.group({}));
        } else {
          formGeneral.removeControl('antiLaundering');
        }
      }
    }

    if (event.name === 'payerMandatorySubject') {
      if (formP.get('payerKnowClientRadio').value === 'SI') {
        if (this.juridicalObligatoryOptions.options[this.juridicalObligatoryOptions.options.map((e) => e.value).indexOf(event.valor)].obligatory === '1') {
          formGeneral.addControl('antiLaunderingPayer', this.fb.group({}));
        } else {
          formGeneral.removeControl('antiLaunderingPayer');
        }
      } else if (formP.get('payerKnowClientRadio').value === 'NO') {
        if (this.physicalObligatoryOptions.options[this.physicalObligatoryOptions.options.map((e) => e.value).indexOf(event.valor)].obligatory === '1') {
          formGeneral.addControl('antiLaunderingPayer', this.fb.group({}));
        } else {
          formGeneral.removeControl('antiLaunderingPayer');
        }
      }
    }

    if (event.valor === 'SI') {
      // console.log(JSON.stringify(this.disabilityGroup.value));

      switch (event.name) {
        case 'smoker_radio':
          form.addControl('smoke', this.fb.group({
            quantity: ['', [Validators.required, Validators.min(1)]],
            duration: ['', [Validators.required, Validators.min(0)]],
            timeDuration: ['', Validators.required]
          }));
          break;

        case 'alcohol_radio':
          form.addControl('alcohol', this.fb.group({
            quantity: ['', [Validators.required, Validators.min(1)]]
          }));
          break;

        case 'health_radio':
          formQ.addControl('health', this.fb.group({
            date: ['', Validators.required],
            reason: ['', Validators.required],
            therapy: ['', Validators.required]
          }));
          break;

        case 'therapy_radio':
          formQ.addControl('therapy_array', this.fb.array([this.formMethods.createItem(this.therapyGroup)]));
          this.therapyArray = this.disabilityGroup.get('questions').get('questionnaire').get('therapy_array') as FormArray;
          break;

        case 'sick_pay_radio':
          formQ.addControl('sick_pay_array', this.fb.array([this.formMethods.createItem(this.sickPayGroup)]));
          this.sickPayArray = this.disabilityGroup.get('questions').get('questionnaire').get('sick_pay_array') as FormArray;
          break;

        case 'analysis_radio':
          formQ.addControl('analysis_array', this.fb.array([this.formMethods.createItem(this.testGroup)]));
          this.testArray = this.disabilityGroup.get('questions').get('questionnaire').get('analysis_array') as FormArray;
          break;

        case 'other_analysis_radio':
          formQ.addControl('other_analysis_array', this.fb.array([this.formMethods.createItem(this.otherAnalysisGroup)]));
          this.otherAnalysisArray = this.disabilityGroup.get('questions').get('questionnaire').get('other_analysis_array') as FormArray;
          break;

        case 'inpatientCare_radio':
          formQ.addControl('inpatientCare_array', this.fb.array([this.formMethods.createItem(this.inpatientCareGroup)]));
          this.inpatientCareArray = this.disabilityGroup.get('questions').get('questionnaire').get('inpatientCare_array') as FormArray;
          break;

        case 'bloodSick_radio':
          formQ.addControl('bloodSick_array', this.fb.array([this.formMethods.createItem(this.bloodSickGroup)]));
          this.bloodSickArray = this.disabilityGroup.get('questions').get('questionnaire').get('bloodSick_array') as FormArray;
          break;

        case 'hospitalization_radio':
          formQ.addControl('hospitalization_array', this.fb.array([this.formMethods.createItem(this.hospitalizationGroup)]));
          this.hospitalizationArray = this.disabilityGroup.get('questions').get('questionnaire').get('hospitalization_array') as FormArray;
          break;

        case 'sicknessType_radio':
          formQ.addControl('sicknessType', this.fb.group({
            // sickness: ['', Validators.required],
            // date: ['', Validators.required],
            // duration: ['', Validators.required],
            // therapy: ['', Validators.required],
            // cureDate: ['', Validators.required],
            // secundaryEffects: ['', Validators.required],
            // additionalInfo: ['', Validators.required],
            haveHypertension: ['', Validators.required],
            haveArthritis: ['', Validators.required],
            haveCardiovascular: ['', Validators.required],
            haveRenalUrinary: ['', Validators.required],
            haveMetabolics: ['', Validators.required],
            haveMusculoSkeletal: ['', Validators.required],
            haveProstatics: ['', Validators.required],
            haveSpine: ['', Validators.required],
            haveLiver: ['', Validators.required],
            haveDigestive: ['', Validators.required],
            haveRheumatic: ['', Validators.required],
            haveLung: ['', Validators.required],
            haveGynecology: ['', Validators.required]
          }));
          break;

        case 'haveHypertension':
          questionnaires.addControl('solicitudHipertensionArterial', this.fb.group({}));
          break;

        case 'pep_radio_insured':
          console.log(this.role);

          if (formPayer) {
            if (!formPayer.get('pep')) {
              if (!formFiles.get('incomesCertified')) {
                formFiles.addControl('incomesCertified', this.fb.control(''));
              }
            }
          } else {
            if (!formFiles.get('incomesCertified')) {
              formFiles.addControl('incomesCertified', this.fb.control(''));
            }
          }

          // formInsured.addControl('pep', this.fb.group({
          //   // contractor: ['', Validators.required],
          //   payer: ['', Validators.required],
          //   // insured: ['', Validators.required],
          //   lastPosition: ['', Validators.required],
          //   time: ['', Validators.required],
          //   timeNumber: ['', [Validators.required, Validators.min(1)]]
          // }));

          // if (this.role === 'WMA') { formInsured.addControl('knowYourClient', this.fb.group({})); }
          // else if (this.role === 'WWS') { formInsured.addControl('knowYourCustomer', this.fb.group({})); }
          // if (!(this.disabilityGroup.get('files').get('documentsKnowClient'))) {
          //   formFiles.addControl('documentsKnowClient', this.fb.array([this.createFormArray('filesDocumentsKnowClient')]));
          //   this.filesDocumentsKnowClientArray = this.disabilityGroup.get('files').get('documentsKnowClient') as FormArray;
          // }
          // else if (this.disabilityGroup.get('files').get('documentsKnowClient')) {

          //   formFiles.removeControl('documentsKnowClient');
          //   formFiles.addControl('documentsKnowClient', this.fb.array([this.createFormArray('filesDocumentsKnowClient')]));
          //   this.filesDocumentsKnowClientArray = this.disabilityGroup.get('files').get('documentsKnowClient') as FormArray;
          // }
          // if (!(this.disabilityGroup.get('KnowYourCustomer'))) {
          //   this.disabilityGroup.addControl('KnowYourCustomer', this.fb.group({}));
          //   console.log('foroooooo');

          // }
          break;

        case 'pep_radio_holder':
          console.log(this.role);



          // if (this.role === 'WMA') { formHolder.addControl('knowYourClient', this.fb.group({})); }
          // else if (this.role === 'WWS') { formHolder.addControl('KnowYourCustomer', this.fb.group({})); }
          // formGeneral.addControl('knowYourCustomerContratante', this.fb.group({}));
          break;

        case 'pep_radio_payer':
          console.log(this.role);

          if (position === 'payer') {
            formPayer.addControl('pep', this.fb.group({
              // contractor: ['', Validators.required],
              // payer: ['', Validators.required],
              // insured: ['', Validators.required],
              lastPosition: ['', Validators.required],
              time: ['', Validators.required],
              timeNumber: ['', [Validators.required, Validators.min(1)]]
            }));

            formFiles.addControl('incomesCertified', this.fb.control(''));
          } else {
            formHolder.addControl('pep', this.fb.group({
              // contractor: ['', Validators.required],
              // payer: ['', Validators.required],
              // insured: ['', Validators.required],
              lastPosition: ['', Validators.required],
              time: ['', Validators.required],
              timeNumber: ['', [Validators.required, Validators.min(1)]]
            }));

            if (formPayer) {
              if (!formPayer.get('pep')) {
                if (!formFiles.get('incomesCertified')) {
                  formFiles.addControl('incomesCertified', this.fb.control(''));
                }
              }
            } else {
              if (!formFiles.get('incomesCertified')) {
                formFiles.addControl('incomesCertified', this.fb.control(''));
              }
            }
          }

          // if (this.role === 'WMA') { formHolder.addControl('knowYourClient', this.fb.group({})); }
          // else if (this.role === 'WWS') { formHolder.addControl('KnowYourCustomer', this.fb.group({})); }
          // formGeneral.addControl('knowYourCustomerContratante', this.fb.group({}));
          break;

        case 'haveArthritis':
          questionnaires.addControl('solicitudArtitris', this.fb.group({}));
          break;

        case 'haveCardiovascular':
          questionnaires.addControl('solicitudCardioVasculares', this.fb.group({}));
          break;

        case 'haveRenalUrinary':
          questionnaires.addControl('solicitudRenales', this.fb.group({}));
          break;

        case 'haveMetabolics':
          questionnaires.addControl('solicitudDiabetes', this.fb.group({}));
          break;

        case 'haveMusculoSkeletal':
          questionnaires.addControl('solicitudMusculoesqueleticos', this.fb.group({}));
          break;

        // case 'haveProstatics':
        //   questionnaires.addControl('solicitudProstatica', this.fb.group({}));
        //   break;

        case 'haveSpine':
          questionnaires.addControl('columnaVertebralColumnaVertebral', this.fb.group({}));
          break;

        case 'VIH_radio':

          formQ.addControl('VIH_array', this.fb.array([this.formMethods.createItem(this.VIHGroup)]));
          this.VIHArray = this.disabilityGroup.get('questions').get('questionnaire').get('VIH_array') as FormArray;
          break;

        case 'specialTherapy_radio':
          formQ.addControl('specialTherapy_array', this.fb.array([this.formMethods.createItem(this.specialTherapyGroup)]));
          this.specialTherapyArray = this.disabilityGroup.get('questions').get('questionnaire').get('specialTherapy_array') as FormArray;
          break;

        case 'accident_radio':
          formQ.addControl('accident_array', this.fb.array([this.formMethods.createItem(this.accidentGroup)]));
          this.accidentArray = this.disabilityGroup.get('questions').get('questionnaire').get('accident_array') as FormArray;
          break;

        case 'deny_radio':
          formQ.addControl('deny_array', this.fb.array([this.formMethods.createItem(this.denyGroup)]));
          this.denyArray = this.disabilityGroup.get('questions').get('questionnaire').get('deny_array') as FormArray;
          break;

        case 'insurance_radio':
          formQ.addControl('insurance_array', this.fb.array([this.formMethods.createItem(this.insuranceGroup)]));
          this.insuranceArray = this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array') as FormArray;
          break;

        case 'claim_radio':
          formC.addControl('claim', this.fb.group({
            explanation: ['', Validators.required],
          }));
          break;

        case 'insuredPolicyholderRadio':

          formInsured.removeControl('policyholderKnowClientRadio');
          formInsured.removeControl('mandatorySubject');
          formGeneral.removeControl('policyholder');
          formGeneral.removeControl('policyholderJuridical');
          formGeneral.removeControl('knowYourClient');
          formGeneral.removeControl('antiLaundering');

          // formInsured.addControl('mandatorySubject', this.fb.control('', Validators.required));


          // // if (this.disabilityGroup.get('files').get('documentsKnowClient')) {
          // //   formFiles.removeControl('documentsKnowClient');
          // // }

          break;

        // Si
        case 'policyholderKnowClientRadio':
          // formFiles.addControl('documentsKnowClient', this.fb.array([]));
          // this.filesDocumentsKnowClientArray = this.disabilityGroup.get('files').get('documentsKnowClient') as FormArray;

          if (this.disabilityGroup.get('policyholder')) {
            formGeneral.removeControl('policyholder');
            formGeneral.removeControl('knowYourCustomerContratante');
          }
          if (!(this.disabilityGroup.get('knowYourClient'))) {
            formGeneral.addControl('knowYourClient', this.fb.group({}));
          }
          if (!(this.disabilityGroup.get('policyholderJuridical'))) {
            formGeneral.addControl('policyholderJuridical', this.juridicalGroup());
          }
          if (this.disabilityGroup.get('files').get('copyId')) {
            formFiles.removeControl('copyId');
          }

          if (!(this.disabilityGroup.get('knowYourClient'))) {
            formGeneral.addControl('knowYourClient', this.fb.group({}));
          }

          if ((this.disabilityGroup.get('antiLaundering'))) {
            formGeneral.removeControl('antiLaundering');
          }

          formInsured.get('mandatorySubject').reset();

          break;

        case 'insuredPayerRadio':

          if (this.disabilityGroup.get('insured_data').get('payerKnowClientRadio')) {
            formInsured.removeControl('payerKnowClientRadio');
          }

          if (this.disabilityGroup.get('payer')) {
            formGeneral.removeControl('payer');
          }

          formGeneral.removeControl('knowYourClientPayer');
          formGeneral.removeControl('antiLaunderingPayer');

          if (this.disabilityGroup.get('payerJuridical')) {
            formGeneral.removeControl('payerJuridical');
          }

          if (this.disabilityGroup.get('insured_data').get('payerMandatorySubject')) {
            formInsured.removeControl('payerMandatorySubject');
          }

          // // if (this.disabilityGroup.get('files').get('documentsKnowClient')) {
          // //   formFiles.removeControl('documentsKnowClient');
          // // }

          break;

        case 'payerKnowClientRadio':
          // formFiles.addControl('documentsKnowClient', this.fb.array([]));
          // this.filesDocumentsKnowClientArray = this.disabilityGroup.get('files').get('documentsKnowClient') as FormArray;

          if (this.disabilityGroup.get('payer')) {
            formGeneral.removeControl('payer');
            formGeneral.removeControl('knowYourCustomerPagador');
          }
          if (!(this.disabilityGroup.get('knowYourClientPayer'))) {
            formGeneral.addControl('knowYourClientPayer', this.fb.group({}));
          }

          if (!(this.disabilityGroup.get('payerJuridical'))) {
            formGeneral.addControl('payerJuridical', this.juridicalGroup());
          }
          // if (this.disabilityGroup.get('files').get('copyId')) {
          //   formFiles.removeControl('copyId');
          // }

          if ((this.disabilityGroup.get('antiLaunderingPayer'))) {
            formGeneral.removeControl('antiLaunderingPayer');
          }

          formInsured.get('payerMandatorySubject').reset();

          break;

        case 'hasAnotherCoverage':
          formCB.addControl('anotherCoverages', this.fb.array([this.createFormArray('coverages')]));
          formCB.addControl('changeAnotherCoverage', this.fb.control('', Validators.required));
          this.existingCoveragesList = formCB.get('anotherCoverages') as FormArray;
          break;

        case 'changeAnotherCoverage':
          formCB.addControl('changingCoverages', this.fb.array([this.createFormArray('coverages')]));
          this.changingCoveragesList = formCB.get('changingCoverages') as FormArray;
          break;

        case 'mandatorySubject':
          // if (!(this.disabilityGroup.get('files').get('mercantile'))) {
          //   formFiles.addControl('mercantile', this.fb.array([this.createFormArray('mercantileRegister')]));
          //   this.mercantileRegisterArray = this.disabilityGroup.get('files').get('mercantile') as FormArray;
          // }
          // else if (this.disabilityGroup.get('files').get('mercantile')) {
          //   formFiles.removeControl('mercantile');
          //   formFiles.addControl('mercantile', this.fb.array([this.createFormArray('mercantileRegister')]));
          //   this.mercantileRegisterArray = this.disabilityGroup.get('files').get('mercantile') as FormArray;
          // }
          formGeneral.addControl('antiLaundering', this.fb.group({}));
          break;

        case 'payerMandatorySubject':
          // if (!(this.disabilityGroup.get('files').get('mercantilePayer'))) {
          //   formFiles.addControl('mercantilePayer', this.fb.array([this.createFormArray('mercantileRegister')]));
          //   this.mercantileRegisterArray = this.disabilityGroup.get('files').get('mercantilePayer') as FormArray;
          // }
          // else if (this.disabilityGroup.get('files').get('mercantilePayer')) {
          //   formFiles.removeControl('mercantilePayer');
          //   formFiles.addControl('mercantilePayer', this.fb.array([this.createFormArray('mercantileRegister')]));
          //   this.mercantileRegisterArray = this.disabilityGroup.get('files').get('mercantilePayer') as FormArray;
          // }
          formGeneral.addControl('antiLaunderingPayer', this.fb.group({}));
          break;

      }
    } else if (event.valor === 'NO') {
      switch (event.name) {
        case 'smoker_radio':
          form.removeControl('smoke');
          break;

        case 'alcohol_radio':
          form.removeControl('alcohol');
          break;

        case 'health_radio':
          formQ.removeControl('health');
          break;

        case 'therapy_radio':
          formQ.removeControl('therapy_array');
          break;

        case 'sick_pay_radio':
          formQ.removeControl('sick_pay_array');
          break;

        case 'analysis_radio':
          formQ.removeControl('analysis_array');
          break;

        case 'other_analysis_radio':
          formQ.removeControl('other_analysis_array');
          break;

        case 'inpatientCare_radio':
          formQ.removeControl('inpatientCare_array');
          break;

        case 'sicknessType_radio':
          formQ.removeControl('sicknessType');
          if (questionnaires) {
            if (questionnaires.get('solicitudHipertensionArterial')) {
              questionnaires.removeControl('solicitudHipertensionArterial');
            }
            if (questionnaires.get('solicitudArtitris')) {
              questionnaires.removeControl('solicitudArtitris');
            }
            if (questionnaires.get('solicitudCardioVasculares')) {
              questionnaires.removeControl('solicitudCardioVasculares');
            }
            if (questionnaires.get('solicitudRenales')) {
              questionnaires.removeControl('solicitudRenales');
            }
            if (questionnaires.get('solicitudDiabetes')) {
              questionnaires.removeControl('solicitudDiabetes');
            }
            if (questionnaires.get('solicitudMusculoesqueleticos')) {
              questionnaires.removeControl('solicitudMusculoesqueleticos');
            }
            if (questionnaires.get('columnaVertebralColumnaVertebral')) {
              questionnaires.removeControl('columnaVertebralColumnaVertebral');
            }
          }
          break;

        case 'VIH_radio':
          formQ.removeControl('VIH_array');
          break;

        case 'accident_radio':
          formQ.removeControl('accident_array');
          break;

        case 'deny_radio':
          formQ.removeControl('deny_array');
          break;

        case 'insurance_radio':
          formQ.removeControl('insurance_array');
          break;

        case 'specialTherapy_radio':
          formQ.removeControl('specialTherapy_array');
          break;

        case 'bloodSick_radio':
          formQ.removeControl('bloodSick_array');
          break;

        case 'hospitalization_radio':
          formQ.removeControl('hospitalization_array');
          break;

        case 'claim_radio':
          formC.removeControl('claim');
          break;

        case 'haveHypertension':
          questionnaires.removeControl('solicitudHipertensionArterial');
          break;

        case 'haveArthritis':
          questionnaires.removeControl('solicitudArtitris');
          break;

        case 'haveCardiovascular':
          questionnaires.removeControl('solicitudCardioVasculares');
          break;

        case 'haveRenalUrinary':
          questionnaires.removeControl('solicitudRenales');
          break;

        case 'haveMetabolics':
          questionnaires.removeControl('solicitudDiabetes');
          break;

        case 'haveMusculoSkeletal':
          questionnaires.removeControl('solicitudMusculoesqueleticos');
          break;

        // case 'haveProstatics':
        //   questionnaires.removeControl('solicitudProstatica');
        //   break;

        case 'haveSpine':
          questionnaires.removeControl('columnaVertebralColumnaVertebral');
          break;

        case 'pep_radio_insured':
          // formInsured.removeControl('pep');
          // formInsured.removeControl('knowYourClient');
          // if (!(this.disabilityGroup.get('files').get('documentsKnowClient'))) {
          //   formFiles.addControl('documentsKnowClient', this.fb.array([this.createFormArray('filesDocumentsKnowClient')]));
          //   this.filesDocumentsKnowClientArray = this.disabilityGroup.get('files').get('documentsKnowClient') as FormArray;
          // }
          // else if (this.disabilityGroup.get('files').get('documentsKnowClient')) {

          //   formFiles.addControl('documentsKnowClient', this.fb.array([this.createFormArray('filesDocumentsKnowClient')]));
          //   this.filesDocumentsKnowClientArray = this.disabilityGroup.get('files').get('documentsKnowClient') as FormArray;
          // }

          // this.disabilityGroup.removeControl('KnowYourCustomer');
          if (formPayer) {
            if (!formPayer.get('pep')) {
              formFiles.removeControl('incomesCertified');
            }
          } else {
            formFiles.removeControl('incomesCertified');
          }
          break;


        case 'pep_radio_holder':


          break;

        case 'pep_radio_payer':
          if (position === 'payer') {
            formPayer.removeControl('pep');
            formFiles.removeControl('incomesCertified');
          } else {
            formHolder.removeControl('pep');
            // formGeneral.removeControl('knowYourCustomerContratante');
            // formHolder.removeControl('knowYourClient');
            //formHolder.removeControl('KnowYourCustomer');

            if (formPayer) {
              if (!formPayer.get('pep')) {
                formFiles.removeControl('incomesCertified');
              }
            } else {
              formFiles.removeControl('incomesCertified');
            }
          }

          // formGeneral.removeControl('knowYourCustomerContratante');
          // formHolder.removeControl('knowYourClient');
          //formHolder.removeControl('KnowYourCustomer');
          break;

        case 'insuredPolicyholderRadio':
          if (this.disabilityGroup.get('files').get('copyId')) {
            formFiles.removeControl('copyId');
          }
          if ((this.disabilityGroup.get('antiLaundering'))) {
            formGeneral.removeControl('antiLaundering');
          }

          if (this.disabilityGroup.get('insured_data').get('mandatorySubject')) {
            formInsured.removeControl('mandatorySubject');
          }
          if (this.disabilityGroup.get('files').get('mercantile')) {
            formFiles.removeControl('mercantile');
          }

          // if (!this.disabilityGroup.get('policyholder')) {
          //   formGeneral.addControl('policyholder', this.fb.group(this.policyHolderGroup));
          // }

          // if (this.disabilityGroup.get('files').get('documentsKnowClient')) {
          //   formFiles.removeControl('documentsKnowClient');
          // }

          formInsured.addControl('policyholderKnowClientRadio', this.fb.control('', Validators.required));
          formInsured.addControl('mandatorySubject', this.fb.control('', Validators.required));
          break;



        case 'policyholderKnowClientRadio':
          // if (this.disabilityGroup.get('insured_data').get('knowYourClient')) {
          //   formInsured.removeControl('knowYourClient');
          // }
          // formFiles.removeControl('documentsKnowClient');
          // this.filesDocumentsArray = undefined;
          if ((this.disabilityGroup.get('knowYourClient'))) {
            formGeneral.removeControl('knowYourClient');
          }

          if (!this.disabilityGroup.get('policyholder')) {
            formGeneral.addControl('policyholder', this.fb.group(this.policyHolderGroup));
          }

          if (this.disabilityGroup.get('policyholderJuridical')) {
            formGeneral.removeControl('policyholderJuridical');
          }

          if ((this.disabilityGroup.get('antiLaundering'))) {
            formGeneral.removeControl('antiLaundering');
          }

          formInsured.get('mandatorySubject').reset();

          if (this.disabilityGroup.get('files').get('mercantile')) {
            formFiles.removeControl('mercantile');
          }

          // formFiles.addControl('copyId', this.fb.array([this.createFormArray('filesCopyId')]));
          // this.filesCopyIdArray = this.disabilityGroup.get('files').get('copyId') as FormArray;

          break;

        case 'insuredPayerRadio':
          if (this.disabilityGroup.get('files').get('copyId')) {
            formFiles.removeControl('copyId');
          }
          if ((this.disabilityGroup.get('antiLaunderingPayer'))) {
            formGeneral.removeControl('antiLaunderingPayer');
          }



          if (this.disabilityGroup.get('files').get('mercantilePayer')) {
            formFiles.removeControl('mercantilePayer');
          }

          formInsured.addControl('payerMandatorySubject', this.fb.control('', Validators.required));


          // if (!this.disabilityGroup.get('payer')) {
          //   formGeneral.addControl('payer', this.fb.group(this.policyHolderGroup));
          // }

          // if (this.disabilityGroup.get('files').get('documentsKnowClient')) {
          //   formFiles.removeControl('documentsKnowClient');
          // }

          formInsured.addControl('payerKnowClientRadio', this.fb.control('', Validators.required));
          break;

        case 'payerKnowClientRadio':
          // if (this.disabilityGroup.get('insured_data').get('knowYourClient')) {
          //   formInsured.removeControl('knowYourClient');
          // }
          // formFiles.removeControl('documentsKnowClient');
          // this.filesDocumentsArray = undefined;
          if ((this.disabilityGroup.get('knowYourClientPayer'))) {
            formGeneral.removeControl('knowYourClientPayer');
          }

          if (!this.disabilityGroup.get('payer')) {
            formGeneral.addControl('payer', this.fb.group(this.policyPayerGroup));
          }
          if ((this.disabilityGroup.get('antiLaunderingPayer'))) {
            formGeneral.removeControl('antiLaunderingPayer');
          }

          if (this.disabilityGroup.get('payerJuridical')) {
            formGeneral.removeControl('payerJuridical');
          }

          formInsured.get('payerMandatorySubject').reset();

          if (this.disabilityGroup.get('files').get('mercantilePayer')) {
            formFiles.removeControl('mercantilePayer');
          }

          // formFiles.addControl('copyId', this.fb.array([this.createFormArray('filesCopyId')]));
          // this.filesCopyIdArray = this.disabilityGroup.get('files').get('copyId') as FormArray;

          break;

        case 'hasAnotherCoverage':
          formCB.removeControl('anotherCoverages');
          this.existingCoveragesList = undefined;
          formCB.get('changeAnotherCoverage').reset();
          formCB.removeControl('changeAnotherCoverage');
          this.changingCoveragesList = undefined;
          break;

        case 'changeAnotherCoverage':
          formCB.removeControl('changingCoverages');
          this.changingCoveragesList = undefined;
          break;

        case 'mandatorySubject':
          if (this.disabilityGroup.get('files').get('mercantile')) {
            formFiles.removeControl('mercantile');
            this.mercantileRegisterArray = undefined;
          }
          if ((this.disabilityGroup.get('antiLaundering'))) {
            formGeneral.removeControl('antiLaundering');
          }

        case 'payerMandatorySubject':
          if (this.disabilityGroup.get('files').get('mercantilePayer')) {
            formFiles.removeControl('mercantilePayer');
            this.mercantileRegisterArray = undefined;
          }
          if ((this.disabilityGroup.get('antiLaunderingPayer'))) {
            formGeneral.removeControl('antiLaunderingPayer');
          }

          break;

      }
    }

    // else if (event.name === 'weightUnit') {
    //   if (event.valor == 'kilogramos'){
    //     this.massName = 'kg';
    //   }
    //   else if (event.valor == 'libras') {
    //     this.massName = 'lb';
    //   }
    // }
    // else if (event.name === 'heightUnit') {
    //   if (event.valor == 'pies'){
    //     this.heightName = 'pies';
    //   }
    //   else if (event.valor == 'centimetros') {
    //     this.heightName = 'cm';
    //   }
    // }
  }

  createFormArray(name: string) {
    // const formP = this.disabilityGroup.get('main') as FormGroup;
    // const formC = this.disabilityGroup.get('contingent') as FormGroup;
    // const formQ = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
    // const formS = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;

    // formP.addControl('main_array', this.mainProperty);
    // formC.addControl('contingent_array', this.contingentProperty);


    switch (name) {
      case 'main_array':
        return this.mainGroup;
        break;

      case 'contingent_array':
        return this.contingentGroup;
        break;

      case 'analysis_array':
        // formQ.addControl('analysis_array', this.testProperty);
        return this.testGroup;
        break;

      case 'sick_pay_array':
        // formQ.addControl('sick_pay_array', this.sickPayProperty);
        return this.sickPayGroup;
        break;

      case 'therapy_array':
        // formQ.addControl('therapy_array', this.therapyProperty);
        return this.therapyGroup;
        break;

      case 'other_analysis_array':
        // formQ.addControl('other_analysis_array', this.otherAnalysisProperty);
        return this.otherAnalysisGroup;
        break;

      case 'inpatientCare_array':
        // formQ.addControl('inpatientCare_array', this.inpatientCareProperty);
        return this.inpatientCareGroup;
        break;

      case 'hospitalization_array':
        // formQ.addControl('hospitalization_array', this.hospitalizationProperty);
        return this.hospitalizationGroup;
        break;

      case 'bloodSick_array':
        // formQ.addControl('bloodSick_array', this.bloodSickProperty);
        return this.bloodSickGroup;
        break;

      case 'VIH_array':
        // formQ.addControl('VIH_array', this.VIHProperty);
        return this.VIHGroup;
        break;

      case 'specialTherapy_array':
        // formQ.addControl('specialTherapy_array', this.specialTherapyProperty);
        return this.specialTherapyGroup;
        break;

      case 'accident_array':
        // formQ.addControl('accident_array', this.accidentProperty);
        return this.accidentGroup;
        break;

      case 'deny_array':
        // formQ.addControl('deny_array', this.denyProperty);
        return this.denyGroup;
        break;

      case 'insurance_array':
        // formQ.addControl('insurance_array', this.insuranceProperty);
        return this.insuranceGroup;
        break;

      case 'coverages':
        return this.fb.group({
          name: ['', Validators.required],
          amount: ['', Validators.required],
          policeNo: ['', [Validators.required, Validators.min(1)]],
          adbQuantity: ['', [Validators.required, Validators.min(0)]],
          date: ['', Validators.required],
        });
        break;

      case 'filesStudies':
        return this.fb.group({
          study: ['', Validators.required],
        });

      case 'filesDocumentsKnowClient':
        return this.fb.group({
          document: ['', Validators.required],
        });

      case 'filesCopyId':
        return this.fb.group({
          idId: ['', Validators.required],
        });

      case 'mercantileRegister':
        return this.fb.group({
          register: ['', Validators.required],
        });

      case 'commercialRegister':
        return this.fb.group({
          commercialRegisters: [''],
        });

      case 'legalRepresentativeId2':
        return this.fb.group({
          legalRepresentativeId2s: [''],
        });
    }
  }

  addToList(list: any, type: string) {
    console.warn('list', list);
    list.push(this.createFormArray(type));
  }

  addFormArray(array: any, name: string) {
    const increment = array.length + 1;
    array = this.formMethods.addElement(array, increment, this.createFormArray(name)).formArray;

    console.log(JSON.stringify(this.disabilityGroup.value));
    // console.log(this.mainFormArray);
    // console.log(this.mainFormArray.value);

    // array.push(this.createFormArray(name));

  }

  removeFormArray(index, array: any) {
    array.removeAt(index);
  }

  print() {

  }

  questionsLength() {
    if (this.disabilityGroup.get('questionnaires').get('id')) {
      return Object.keys(this.disabilityGroup.get('questionnaires').value).length - 1;
    }
    else {

      return Object.keys(this.disabilityGroup.get('questionnaires').value).length;
    }
  }

  isBenefitMinorThan100(group: string, subgroup: string): boolean {
    const form = this.disabilityGroup.get(group).get(subgroup) as FormGroup;

    if (this.benefitFor(form).total < 100 && this.benefitFor(form).isDirty) { return true; } else { return false; }
  }

  isBenefitMajorThan100(group: string, subgroup: string): boolean {
    const form = this.disabilityGroup.get(group).get(subgroup) as FormGroup;

    if (this.benefitFor(form).total > 100 && this.benefitFor(form).isDirty) { return true; } else { return false; }
  }

  benefitFor(form: FormGroup) {
    let total = 0;
    let isDirty = false;

    for (const dpd in form.value) {
      if (form.controls[dpd].dirty) { isDirty = true; }
      total += form.value[dpd].percentage;

    }
    return { total, isDirty };
  }

  selectChangeUrl(event) {
    switch (event) {
      case 'vida':
        this.router.navigateByUrl('dashboard/requests/new-requests/vida');
        break;

      case 'disability':
        this.router.navigateByUrl('dashboard/requests/new-requests/disability');
        break;

      case 'gastos mayores':
        this.router.navigateByUrl('dashboard/requests/new-requests/salud');
        break;

      default:
        break;
    }
  }

  arrayStudiesWatcher(i: number, type?: string, group?: string) {
    if (type === 'insured_data') {
      const formP = this.disabilityGroup.get('insured_data') as FormGroup;
      if (formP.value.id2AttachedUrl && formP.value.id2Attached !== '') { return formP.value.id2AttachedUrl; }
    } else if (type === 'policyholder') {
      const formP = this.disabilityGroup.get('policyholder') as FormGroup;
      if (formP.value.id2AttachedUrl && formP.value.id2Attached !== '') { return formP.value.id2AttachedUrl; }
    } else if (type === 'payer') {
      const formP = this.disabilityGroup.get('payer') as FormGroup;
      if (formP.value.id2AttachedUrl && formP.value.id2Attached !== '') { return formP.value.id2AttachedUrl; }
    } else if (type === 'incomesCertified') {
      const formP = this.disabilityGroup.get('files') as FormGroup;
      if (formP.value.incomesCertifiedUrl && formP.value.incomesCertified !== '') { return formP.value.incomesCertifiedUrl; }
    } else if (type === 'commercialRegister') {
      if (this.disabilityGroup.get(group).get(type).get(i.toString())) {
        if (this.disabilityGroup.get(group).get(type).get(i.toString()) && this.disabilityGroup.get(group).get(type).get(i.toString()).value[type + 's'] !== '') {
          return this.disabilityGroup.get(group).get(type).get(i.toString()).value[type + 'Url'];
        }
      }
    } else if (type === 'legalRepresentativeId2') {
      if (this.disabilityGroup.get(group).get(type).get(i.toString())) {
        if (this.disabilityGroup.get(group).get(type).get(i.toString()) && this.disabilityGroup.get(group).get(type).get(i.toString()).value[type + 's'] !== '') {
          return this.disabilityGroup.get(group).get(type).get(i.toString()).value[type + 'Url'];
        }
      }
    } else {
      if (this.arrayFilesTitles) {
        if (this.arrayFilesTitles[i] && this.disabilityGroup.get('files').get('studies').get(i.toString()).value.study !== '') {
          return this.arrayFilesTitles[i].studyUrl;
        }
      }
    }
  }

  // tslint:disable: max-line-length
  id2AttachedViewValue(i: number, group: string) {
    if (group === 'primaryBenefits') {
      if (i !== null) {
        if (this.primaryBeneficaryTitles) {
          if (this.primaryBeneficaryTitles[i] && this.disabilityGroup.get('main').get('main_array').get(i.toString()).value.id2Attached !== '') {
            return this.primaryBeneficaryTitles[i].id2AttachedUrl;
          }
        }
      } else {
        if (this.primaryAnotherTitle) {
          if (this.primaryAnotherTitle && this.disabilityGroup.get('main').value.id2Attached !== '') {
            return this.primaryAnotherTitle;
          }
        }
      }
    } else {
      if (i !== null) {
        if (this.contigentBeneficaryTitles) {
          if (this.contigentBeneficaryTitles[i] && this.disabilityGroup.get('contingent').get('contingent_array').get(i.toString()).value.id2Attached !== '') {
            return this.contigentBeneficaryTitles[i].id2AttachedUrl;
          }
        }
      } else {
        if (this.contigentAnotherTitle) {
          if (this.contigentAnotherTitle && this.disabilityGroup.get('contingent').value.id2Attached !== '') {
            return this.contigentAnotherTitle;
          }
        }
      }
    }
  }

  onBeneficiaryFileChangeOnArray(event, formName, i?: number, group?: string, subgroup?: string) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        if (i !== null) {
          this.disabilityGroup.get(group).get(subgroup).get(i.toString()).patchValue({
            [formName]: reader.result
          });
        } else {
          this.disabilityGroup.get(group).patchValue({
            [formName]: reader.result
          });
        }

        this.cd.markForCheck();
      };
    }
  }

  relationWatcher(event, realForm) {
    console.log('event: ', event.valor, 'form: ', realForm);
    const form = realForm as FormGroup;
    if (event.valor === 'OTROS') {
      form.addControl('specifyRelationship', this.fb.control('', Validators.required));
    } else {
      form.removeControl('specifyRelationship');
    }
  }

  arrayDocumentsKnowClientWatcher(i: number) {
    if (this.arrayFilesTitlesDocumentsKnowClient) {
      if (this.disabilityGroup.get('files').get('documentsKnowClient')) {
        // tslint:disable-next-line: max-line-length
        if (this.arrayFilesTitlesDocumentsKnowClient[i] && this.disabilityGroup.get('files').get('documentsKnowClient').get(i.toString()).value.document !== '') {
          return this.arrayFilesTitlesDocumentsKnowClient[i].documentUrl;
        }
      }
    }
  }

  arrayCopyIdWatcher(i: number) {
    if (this.arrayFilesTitlesCopyId) {
      if (this.disabilityGroup.get('files').get('copyId')) {
        // tslint:disable-next-line: max-line-length
        if (this.arrayFilesTitlesCopyId[i] && this.disabilityGroup.get('files').get('copyId').get(i.toString()).value.idId !== '') {
          return this.arrayFilesTitlesCopyId[i].idIdUrl;
        }
      }
    }
  }

  arrayRegisterWatcher(i: number) {
    if (this.arrayFilesTitlesMercantile) {
      if (this.disabilityGroup.get('files').get('mercantile')) {
        // tslint:disable-next-line: max-line-length
        if (this.arrayFilesTitlesMercantile[i] && this.disabilityGroup.get('files').get('mercantile').get(i.toString()).value.register !== '') {
          return this.arrayFilesTitlesMercantile[i].registerUrl;
        }
      }
    }
  }

  showAditionalRed() {
    if (this.disabilityGroup.get('questionnaires').get('solicitudHipertensionArterial')) {
      if (this.disabilityGroup.get('questionnaires').get('solicitudHipertensionArterial').invalid) {
        return true;
      }
    }

    if (this.disabilityGroup.get('questionnaires').get('solicitudDiabetes')) {
      if (this.disabilityGroup.get('questionnaires').get('solicitudDiabetes').invalid) {
        return true;
      }
    }

    if (this.disabilityGroup.get('questionnaires').get('solicitudArtitris')) {
      if (this.disabilityGroup.get('questionnaires').get('solicitudArtitris').invalid) {
        return true;
      }
    }

    if (this.disabilityGroup.get('questionnaires').get('columnaVertebralColumnaVertebral')) {
      if (this.disabilityGroup.get('questionnaires').get('columnaVertebralColumnaVertebral').invalid) {
        return true;
      }
    }

    if (this.disabilityGroup.get('questionnaires').get('solicitudMusculoesqueleticos')) {
      if (this.disabilityGroup.get('questionnaires').get('solicitudMusculoesqueleticos').invalid) {
        return true;
      }
    }

    if (this.disabilityGroup.get('questionnaires').get('solicitudCardioVasculares')) {
      if (this.disabilityGroup.get('questionnaires').get('solicitudCardioVasculares').invalid) {
        return true;
      }
    }

    if (this.disabilityGroup.get('questionnaires').get('solicitudRenales')) {
      if (this.disabilityGroup.get('questionnaires').get('solicitudRenales').invalid) {
        return true;
      }
    }

    if (this.disabilityGroup.get('questionnaires').get('solicitudProstatica')) {
      if (this.disabilityGroup.get('questionnaires').get('solicitudProstatica').invalid) {
        return true;
      }
    }

    return false;
  }

  getData(id) {
    console.log(id);
    setTimeout(() => {
      this.appComponent.showOverlay = true;
    });

    this.disabilityService.returnData(id).subscribe(data => {
      // console.log(data.data.asegurado.documentoIdentidad)
      console.log(data.data);
      if (data !== undefined && data.data !== null &&
        data.data != undefined) {
        this.ID = data.data.id;
        this.dataMappingFromApi.iterateThroughtAllObjectDisability(data.data, this.disabilityGroup);
        const formF = this.disabilityGroup.get('files') as FormGroup;
        const formI = this.disabilityGroup.get('insured_data') as FormGroup;
        const formCB = this.disabilityGroup.get('contingent') as FormGroup;
        const formM = this.disabilityGroup.get('main') as FormGroup;
        const formQ = this.disabilityGroup.get('questions') as FormGroup;
        const formQQ = this.disabilityGroup.get('questions').get('questionnaire') as FormGroup;
        const formHolder = this.disabilityGroup.get('policyholder') as FormGroup;
        const formPayer = this.disabilityGroup.get('payer') as FormGroup;
        const formFiles = this.disabilityGroup.get('files') as FormGroup;
        const formGeneral = this.disabilityGroup as FormGroup;
        const formInsured = this.disabilityGroup.get('insured_data') as FormGroup;
        const questionnaires = this.disabilityGroup.get('questionnaires') as FormGroup;
        console.log(this.disabilityGroup.value);



        this.therapyArray = this.disabilityGroup.get('questions').get('questionnaire').get('therapy_array') as FormArray;
        this.sickPayArray = this.disabilityGroup.get('questions').get('questionnaire').get('sick_pay_array') as FormArray;
        this.testArray = this.disabilityGroup.get('questions').get('questionnaire').get('analysis_array') as FormArray;
        this.otherAnalysisArray = this.disabilityGroup.get('questions').get('questionnaire').get('other_analysis_array') as FormArray;
        this.inpatientCareArray = this.disabilityGroup.get('questions').get('questionnaire').get('inpatientCare_array') as FormArray;
        this.bloodSickArray = this.disabilityGroup.get('questions').get('questionnaire').get('bloodSick_array') as FormArray;
        this.hospitalizationArray = this.disabilityGroup.get('questions').get('questionnaire').get('hospitalization_array') as FormArray;

        this.VIHArray = this.disabilityGroup.get('questions').get('questionnaire').get('VIH_array') as FormArray;
        this.specialTherapyArray = this.disabilityGroup.get('questions').get('questionnaire').get('specialTherapy_array') as FormArray;
        this.accidentArray = this.disabilityGroup.get('questions').get('questionnaire').get('accident_array') as FormArray;
        this.denyArray = this.disabilityGroup.get('questions').get('questionnaire').get('deny_array') as FormArray;
        this.insuranceArray = this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array') as FormArray;
        this.existingCoveragesList = this.disabilityGroup.get('contingent').get('anotherCoverages') as FormArray;
        this.changingCoveragesList = this.disabilityGroup.get('contingent').get('changingCoverages') as FormArray;
        this.filesStudiesArray = formF.get('studies') as FormArray;
        this.mainFormArray = this.disabilityGroup.get('main').get('main_array') as FormArray;
        this.contingentFormArray = this.disabilityGroup.get('contingent').get('contingent_array') as FormArray;

        if (this.disabilityGroup.get('files') && this.disabilityGroup.get('files').get('documentsKnowClient')) {
          this.filesDocumentsKnowClientArray = this.disabilityGroup.get('files').get('documentsKnowClient') as FormArray;
        }
        if (this.disabilityGroup.get('files') && this.disabilityGroup.get('files').get('copyId')) {
          this.filesCopyIdArray = this.disabilityGroup.get('files').get('copyId') as FormArray;
        }
        if (this.disabilityGroup.get('files') && this.disabilityGroup.get('files').get('mercantile')) {
          this.mercantileRegisterArray = this.disabilityGroup.get('files').get('mercantile') as FormArray;
        }

        if (this.disabilityGroup.get('countryRoleCode')) { this.disabilityGroup.get('countryRoleCode').setValidators(null); }

        if (formCB.get('hasAnotherCoverage').value !== 'SI') {
          formCB.removeControl('anotherCoverages');
          this.existingCoveragesList = undefined;
          formCB.get('changeAnotherCoverage').reset();
          formCB.removeControl('changeAnotherCoverage');
          this.changingCoveragesList = undefined;
        }

        if (this.disabilityGroup.get('comentary')) {
          this.disabilityGroup.get('comentary').setValidators(null);
        }


        if (formQ.get('alcohol_radio').value !== 'SI') {
          formQ.removeControl('alcohol');
        }

        if (formQ.get('smoker_radio').value !== 'SI') {
          formQ.removeControl('smoke');
        }

        if (formQ.get('heightUnit').value !== 'PIE') {
          formQ.removeControl('inches');
        }

        if (formQ.get('alcohol_radio').value !== 'SI') {
          formQ.removeControl('alcohol');
        }

        if (formQQ.get('health_radio').value !== 'SI') {
          formQQ.removeControl('health');
        }

        if (formQQ.get('sicknessType_radio').value !== 'SI') {
          formQQ.removeControl('sicknessType');
          if (questionnaires) {
            if (questionnaires.get('solicitudHipertensionArterial')) {
              questionnaires.removeControl('solicitudHipertensionArterial');
            }
            if (questionnaires.get('solicitudArtitris')) {
              questionnaires.removeControl('solicitudArtitris');
            }
            if (questionnaires.get('solicitudCardioVasculares')) {
              questionnaires.removeControl('solicitudCardioVasculares');
            }
            if (questionnaires.get('solicitudRenales')) {
              questionnaires.removeControl('solicitudRenales');
            }
            if (questionnaires.get('solicitudDiabetes')) {
              questionnaires.removeControl('solicitudDiabetes');
            }
            if (questionnaires.get('solicitudMusculoesqueleticos')) {
              questionnaires.removeControl('solicitudMusculoesqueleticos');
            }
            if (questionnaires.get('columnaVertebralColumnaVertebral')) {
              questionnaires.removeControl('columnaVertebralColumnaVertebral');
            }
          }
        }

        if (formI.get('insuredPolicyholderRadio').value !== 'SI') {
          // if (this.disabilityGroup.get('insured_data').get('policyholderKnowClientRadio')) {
          //   formInsured.removeControl('policyholderKnowClientRadio');
          // }
          // if (this.disabilityGroup.get('knowYourCustomerContratante')) {
          //   formGeneral.removeControl('knowYourCustomerContratante');
          // }
          // if (this.disabilityGroup.get('files').get('copyId')) {
          //   formFiles.removeControl('copyId');
          // }
          // if ((this.disabilityGroup.get('antiLaundering'))) {
          //   formGeneral.removeControl('antiLaundering');
          // }
          // if ((this.disabilityGroup.get('knowYourClient'))) {
          //   formGeneral.removeControl('knowYourClient');
          // }
          // if (this.disabilityGroup.get('insured_data').get('mandatorySubject')) {
          //   formInsured.removeControl('mandatorySubject');
          // }
          // if (this.disabilityGroup.get('files').get('mercantile')) {
          //   formFiles.removeControl('mercantile');
          // }
          // if (this.disabilityGroup.get('files').get('documentsKnowClient')) {
          //   formFiles.removeControl('documentsKnowClient');
          // }

          // if (this.disabilityGroup.get('policyholder')) {
          //   formGeneral.removeControl('policyholder');
          // }
          // if (this.disabilityGroup.get('insured_data').get('policyholderKnowClientRadio')) {
          //   formInsured.removeControl('policyholderKnowClientRadio');
          // }
          // if (this.disabilityGroup.get('KnowYourCustomerContratante')) {
          //   formGeneral.removeControl('KnowYourCustomerContratante');
          // }
          // if (this.disabilityGroup.get('files').get('copyId')) {
          //   formFiles.removeControl('copyId');
          // }
          // if ((this.disabilityGroup.get('antiLaundering'))) {
          //   formGeneral.removeControl('antiLaundering');
          // }
          // if ((this.disabilityGroup.get('knowYourClient'))) {
          //   formGeneral.removeControl('knowYourClient');
          // }
          // if (this.disabilityGroup.get('insured_data').get('mandatorySubject')) {
          //   formInsured.removeControl('mandatorySubject');
          // }
          // if (this.disabilityGroup.get('files').get('mercantile')) {
          //   formFiles.removeControl('mercantile');
          // }
          // if (this.disabilityGroup.get('files').get('documentsKnowClient')) {
          //   formFiles.removeControl('documentsKnowClient');
          // }
          // if (this.disabilityGroup.get('knowYourCustomerContratante')) {
          //   formGeneral.removeControl('knowYourCustomerContratante');
          // }
          // if (this.disabilityGroup.get('policyholder')) {
          //   formGeneral.removeControl('policyholder');
          // }
        }

        if (formInsured.get('insuredPolicyholderRadio').value !== 'NO') {
          formGeneral.removeControl('policyholder');
          formGeneral.removeControl('policyholderJuridical');
          formInsured.removeControl('mandatorySubject');
          formInsured.removeControl('policyholderKnowClientRadio');
        }

        if (formInsured.get('mandatorySubject')) {
          formInsured.get('mandatorySubject').setValidators(Validators.required);
          formInsured.get('mandatorySubject').updateValueAndValidity();
        }

        if (formInsured.get('insuredPayerRadio').value !== 'NO') {
          formGeneral.removeControl('payer');
          formGeneral.removeControl('payerJuridical');
          formInsured.removeControl('payerMandatorySubject');
          formInsured.removeControl('payerKnowClientRadio');
        }

        if (formInsured.get('policyholderKnowClientRadio')) {
          if (formInsured.get('policyholderKnowClientRadio').value !== 'NO') {
            formGeneral.removeControl('policyholder');
          } else if (formInsured.get('policyholderKnowClientRadio').value === 'NO') {
            formHolder.get('officeTel').setValidators(null);
            formHolder.get('fax').setValidators(null);
            formHolder.get('secondName').setValidators(null);
            formHolder.get('telephone').setValidators(null);
            formGeneral.removeControl('policyholderJuridical');
          }
        }

        if (formGeneral.get('policyholder')) {
          formGeneral.get('policyholder').get('name').setValidators(Validators.required);
          formGeneral.get('policyholder').get('name').updateValueAndValidity();
          formGeneral.get('policyholder').get('lastName').setValidators(Validators.required);
          formGeneral.get('policyholder').get('lastName').updateValueAndValidity();
          formGeneral.get('policyholder').get('marital_status').setValidators(Validators.required);
          formGeneral.get('policyholder').get('marital_status').updateValueAndValidity();
          formGeneral.get('policyholder').get('id2Attached').setValidators(Validators.required);
          formGeneral.get('policyholder').get('id2Attached').updateValueAndValidity();
        }

        if (formInsured.get('payerKnowClientRadio')) {
          if (formInsured.get('payerKnowClientRadio').value !== 'NO') {
            formGeneral.removeControl('payer');
          } else if (formInsured.get('payerKnowClientRadio').value === 'NO') {
            formPayer.get('officeTel').setValidators(null);
            formPayer.get('fax').setValidators(null);
            formPayer.get('secondName').setValidators(null);
            formPayer.get('telephone').setValidators(null);
            formGeneral.removeControl('payerJuridical');
          }
        }

        if (formGeneral.get('payer')) {
          formGeneral.get('payer').get('name').setValidators(Validators.required);
          formGeneral.get('payer').get('name').updateValueAndValidity();
          formGeneral.get('payer').get('lastName').setValidators(Validators.required);
          formGeneral.get('payer').get('lastName').updateValueAndValidity();
          formGeneral.get('payer').get('marital_status').setValidators(Validators.required);
          formGeneral.get('payer').get('marital_status').updateValueAndValidity();
          formGeneral.get('payer').get('id2Attached').setValidators(Validators.required);
          formGeneral.get('payer').get('id2Attached').updateValueAndValidity();
        }

        if (formInsured.get('heightUnit')) {
          if (formInsured.get('heightUnit').value !== 'PIE') {
            formInsured.removeControl('inches');
          }
        }

        if (this.disabilityGroup.get('insured_data').get('pep_radio_insured').value !== 'SI') {
          formI.removeControl('pep');

          if (!formPayer) {
            if (formHolder) {
              if (formHolder.get('pep_radio_payer').value !== 'SI') {
                formF.removeControl('incomesCertified');
              }
            } else {
              formF.removeControl('incomesCertified');
            }
          } else {
            if (formPayer.get('pep_radio_payer').value !== 'SI') {
              formF.removeControl('incomesCertified');
            }
          }
        }

        if (formHolder) {
          if (formHolder.get('pep_radio_payer').value !== 'SI') {
            formHolder.removeControl('pep');

            if (!formPayer) {
              if (formI.get('pep_radio_insured').value !== 'SI') {
                formF.removeControl('incomesCertified');
              }
            } else {
              if (formPayer.get('pep_radio_payer').value !== 'SI') {
                formF.removeControl('incomesCertified');
              }
            }
          } else if (formHolder.get('pep_radio_payer').value === 'SI') {
            const formPP = formHolder.get('pep') as FormGroup;
            formPP.removeControl('payer');
            formPP.removeControl('insured');
            formPP.removeControl('conctractor');
          }
        }

        if (formPayer) {
          if (formPayer.get('pep_radio_payer').value !== 'SI') {
            formPayer.removeControl('pep');
            formF.removeControl('incomesCertified');
            // formGeneral.removeControl('knowYourCustomerContratante');
          } else if (formPayer.get('pep_radio_payer').value === 'SI') {
            const formPP = formPayer.get('pep') as FormGroup;
            if (formPP) {
              formPP.removeControl('payer');
              formPP.removeControl('insured');
              formPP.removeControl('conctractor');
            }
          }
        }

        if (formF.get('incomesCertified')) {
          formF.get('incomesCertified').clearValidators();
          formF.get('incomesCertified').updateValueAndValidity();
        }

        if (this.disabilityGroup.get('questions').get('inches') &&
          this.disabilityGroup.get('questions').get('heightUnit').value === 'PIE') {
          this.disabilityGroup.get('questions').get('inches').setValidators([Validators.required, Validators.min(0), Validators.max(11)])
          this.disabilityGroup.get('questions').get('inches').updateValueAndValidity();
        }

        if (this.disabilityGroup.get('questions').get('questionnaire').get('therapy_array') &&
          this.therapyArray != null || this.therapyArray != undefined) {
          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.therapyArray.length; x++) {
            const therapyArrayGroup = this.disabilityGroup.get('questions').get('questionnaire').get('therapy_array').get(x.toString()) as FormGroup;

            therapyArrayGroup.get('diagnosis').setValidators(Validators.required);
            therapyArrayGroup.get('diagnosis').updateValueAndValidity();
          }
        }

        if (this.disabilityGroup.get('questions').get('questionnaire').get('bloodSick_array') &&
          this.bloodSickArray != null || this.bloodSickArray != undefined) {
          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.bloodSickArray.length; x++) {
            const bloodSickArrayGroup = this.disabilityGroup.get('questions').get('questionnaire').get('bloodSick_array').get(x.toString()) as FormGroup;

            bloodSickArrayGroup.get('name').setValidators(Validators.required);
            bloodSickArrayGroup.get('name').updateValueAndValidity();
          }
        }

        if (this.disabilityGroup.get('questions').get('questionnaire').get('VIH_array') &&
          this.VIHArray != null || this.VIHArray != undefined) {
          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.VIHArray.length; x++) {
            const VIHArrayGroup = this.disabilityGroup.get('questions').get('questionnaire').get('VIH_array').get(x.toString()) as FormGroup;

            VIHArrayGroup.get('name').setValidators(Validators.required);
            VIHArrayGroup.get('name').updateValueAndValidity();
          }
        }

        if (this.disabilityGroup.get('questions').get('questionnaire').get('specialTherapy_array') &&
          this.specialTherapyArray != null || this.specialTherapyArray != undefined) {
          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.specialTherapyArray.length; x++) {
            const specialTherapyArrayGroup = this.disabilityGroup.get('questions').get('questionnaire').get('specialTherapy_array').get(x.toString()) as FormGroup;

            specialTherapyArrayGroup.get('name').setValidators(Validators.required);
            specialTherapyArrayGroup.get('name').updateValueAndValidity();
          }
        }

        if (this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array') &&
          this.insuranceArray != null || this.insuranceArray != undefined) {
          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.insuranceArray.length; x++) {
            const insuranceArrayGroup = this.disabilityGroup.get('questions').get('questionnaire').get('insurance_array').get(x.toString()) as FormGroup;

            insuranceArrayGroup.get('name').setValidators(Validators.required);
            insuranceArrayGroup.get('name').updateValueAndValidity();
          }
        }

        // tslint:disable-next-line: prefer-for-of
        for (let x = 0; x < this.mainFormArray.length; x++) {
          const mainArrayGroup = this.disabilityGroup.get('main').get('main_array').get(x.toString()) as FormGroup;

          if (this.disabilityGroup.get('main').get('main_array').get(x.toString()).get('family').value != 'OTROS') {
            mainArrayGroup.removeControl('specifyRelationship');
          }
        }

        if (this.disabilityGroup.get('main').get('family').value != 'OTROS') {
          formM.removeControl('specifyRelationship');
        }

        // tslint:disable-next-line: prefer-for-of
        for (let x = 0; x < this.contingentFormArray.length; x++) {
          const mainContingentGroup = this.disabilityGroup.get('contingent').get('contingent_array').get(x.toString()) as FormGroup;

          if (this.disabilityGroup.get('contingent').get('contingent_array').get(x.toString()).get('family').value != 'OTROS') {
            mainContingentGroup.removeControl('specifyRelationship');
          }
        }

        // tslint:disable-next-line: prefer-for-of
        for (let x = 0; x < this.contingentFormArray.length; x++) {
          const mainContingentGroup = this.disabilityGroup.get('contingent').get('contingent_array').get(x.toString()) as FormGroup;

          mainContingentGroup.get('full_name').clearValidators();
          mainContingentGroup.get('full_name').updateValueAndValidity();
          mainContingentGroup.get('id2').clearValidators();
          mainContingentGroup.get('id2').updateValueAndValidity();
          mainContingentGroup.get('id2Type').clearValidators();
          mainContingentGroup.get('id2Type').updateValueAndValidity();
          mainContingentGroup.get('id2Attached').clearValidators();
          mainContingentGroup.get('id2Attached').updateValueAndValidity();
          mainContingentGroup.get('nationality').clearValidators();
          mainContingentGroup.get('nationality').updateValueAndValidity();
          mainContingentGroup.get('ocupation').clearValidators();
          mainContingentGroup.get('ocupation').updateValueAndValidity();
          mainContingentGroup.get('family').clearValidators();
          mainContingentGroup.get('family').updateValueAndValidity();
          mainContingentGroup.get('percentage').clearValidators();
          mainContingentGroup.get('percentage').updateValueAndValidity();
          // if (this.disabilityGroup.get('contingent').get('contingent_array').get(x.toString()).get('family').value == 'OTROS') {
          //   mainContingentGroup.get('specifyRelationship').clearValidators();
          //   mainContingentGroup.get('specifyRelationship').updateValueAndValidity();
          // }
        }

        if (this.disabilityGroup.get('contingent').get('anotherCoverages') &&
          this.existingCoveragesList != null || this.existingCoveragesList != undefined) {
          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.existingCoveragesList.length; x++) {
            const existingCoveragesGroup = this.disabilityGroup.get('contingent').get('anotherCoverages').get(x.toString()) as FormGroup;

            existingCoveragesGroup.get('name').setValidators(Validators.required);
            existingCoveragesGroup.get('name').updateValueAndValidity();
            existingCoveragesGroup.get('amount').setValidators(Validators.required);
            existingCoveragesGroup.get('amount').updateValueAndValidity();
            existingCoveragesGroup.get('policeNo').setValidators([Validators.required, Validators.min(1)]);
            existingCoveragesGroup.get('policeNo').updateValueAndValidity();
            existingCoveragesGroup.get('adbQuantity').setValidators([Validators.required, Validators.min(0)]);
            existingCoveragesGroup.get('adbQuantity').updateValueAndValidity();
            existingCoveragesGroup.get('date').setValidators(Validators.required);
            existingCoveragesGroup.get('date').updateValueAndValidity();

          }
        }

        if (this.disabilityGroup.get('contingent').get('changingCoverages') &&
          this.changingCoveragesList != null || this.changingCoveragesList != undefined) {
          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.changingCoveragesList.length; x++) {
            const changingCoveragesGroup = this.disabilityGroup.get('contingent').get('changingCoverages').get(x.toString()) as FormGroup;

            changingCoveragesGroup.get('name').setValidators(Validators.required);
            changingCoveragesGroup.get('name').updateValueAndValidity();
            changingCoveragesGroup.get('amount').setValidators(Validators.required);
            changingCoveragesGroup.get('amount').updateValueAndValidity();
            changingCoveragesGroup.get('policeNo').setValidators([Validators.required, Validators.min(1)]);
            changingCoveragesGroup.get('policeNo').updateValueAndValidity();
            changingCoveragesGroup.get('adbQuantity').setValidators([Validators.required, Validators.min(0)]);
            changingCoveragesGroup.get('adbQuantity').updateValueAndValidity();
            changingCoveragesGroup.get('date').setValidators(Validators.required);
            changingCoveragesGroup.get('date').updateValueAndValidity();
          }
        }

        if (this.disabilityGroup.get('contingent').get('family').value != 'OTROS') {
          formCB.removeControl('specifyRelationship');
        }

        // if (this.disabilityGroup.get('insured_data').get('policyholderKnowClientRadio')) {
        //   if (this.disabilityGroup.get('insured_data').get('policyholderKnowClientRadio').value != 'NO' ||
        //     this.disabilityGroup.get('insured_data').get('insuredPolicyholderRadio').value != 'SI') {
        //     // formGeneral.removeControl('KnowYourCustomer');
        //     // formGeneral.removeControl('KnowYourCustomer');
        //     formFiles.removeControl('copyId');
        //     if (this.disabilityGroup.get('policyholder')) {
        //       formGeneral.removeControl('policyholder');
        //     }
        //   }
        // }

        // if (this.disabilityGroup.get('insured_data').get('mandatorySubject')) {
        //   if (this.disabilityGroup.get('insured_data').get('mandatorySubject').value != 'SI') {
        //     formGeneral.removeControl('antiLaundering');
        //   }
        // }

        // if (this.disabilityGroup.get('insured_data').get('mandatorySubject')) {
        //   if (this.disabilityGroup.get('insured_data').get('mandatorySubject').value == '') {
        //     formGeneral.removeControl('knowYourClient');
        //     formFiles.removeControl('mercantile');
        //   }
        // }

        // if (this.disabilityGroup.get('insured_data').get('policyholderKnowClientRadio')) {
        //   if (this.disabilityGroup.get('insured_data').get('policyholderKnowClientRadio').value != 'SI' ||
        //     this.disabilityGroup.get('insured_data').get('insuredPolicyholderRadio').value != 'SI') {
        //     formI.removeControl('mandatorySubject');
        //     formGeneral.removeControl('knowYourClient');
        //     formFiles.removeControl('mercantile');
        //     formGeneral.removeControl('antiLaundering');
        //   }
        // }

        // if (this.disabilityGroup.get('insured_data').get('insuredPolicyholderRadio').value != 'SI') {
        //   formI.removeControl('policyholderKnowClientRadio');
        // }
        /* if (this.disabilityGroup.get('insured_data').get('insuredPolicyholderRadio').value == 'SI') {
           if (this.disabilityGroup.get('policyholder')) {
             formGeneral.removeControl('policyholder');
           }
         }*/

        if (this.disabilityGroup.get('insured_data').get('knowYourClient')) {
          formI.removeControl('knowYourClient');
        }

        if (this.disabilityGroup.get('insured_data').get('antiLaundering')) {
          formI.removeControl('antiLaundering');
        }

        if (this.disabilityGroup.get('insured_data').get('KnowYourCustomer')) {
          formI.removeControl('KnowYourCustomer');
        }

        //this.disabilityGroup['controls'].num_financial_quote.setValue(data.data.num_financial_quote)

        this.arrayFilesTitles = data.data.files.studies;
        this.contigentBeneficaryTitles = data.data.contingent.contingent_array;
        this.primaryBeneficaryTitles = data.data.main.main_array;
        this.contigentAnotherTitle = data.data.contingent.id2AttachedUrl;
        this.primaryAnotherTitle = data.data.main.id2AttachedUrl;


        // this.filesDocumentsKnowClientArray = formF.get('documentsKnowClient') as FormArray;
        this.arrayFilesTitlesDocumentsKnowClient = data.data.files.documentsKnowClient;
        this.arrayFilesTitlesCopyId = data.data.files.copyId;
        this.arrayFilesTitlesMercantile = data.data.files.mercantile;

        this.disabilityGroup.markAllAsTouched();
        this.disabilityGroup.updateValueAndValidity();
      }
      setTimeout(() => {
        this.appComponent.showOverlay = false;
      });
    });
  }

  // getDataSubForms(id, name) {
  // 	this.disabilityService.returnData(id).subscribe(data => {
  // 		// console.log(data.data.asegurado.documentoIdentidad)
  //     console.log(data);
  //     if (data !== undefined && data.data !== null &&
  //       data.data != undefined )
  //    {
  //      this.ID = data.data.id;
  //      if (name == 'solicitudMusculoesqueleticos'){
  //       this.iterateThroughtAllObject(data.data.questionnaires.solicitudMusculoesqueleticos,
  //         // tslint:disable-next-line: no-string-literal
  //         this.disabilityGroup.get('questionnaires').get('solicitudMusculoesqueleticos'));
  //      }
  //      if (name == 'solicitudRenales'){
  //       this.iterateThroughtAllObject(data.data.questionnaires.solicitudRenales,
  //         // tslint:disable-next-line: no-string-literal
  //         this.disabilityGroup.get('questionnaires').get('solicitudRenales'));
  //      }

  //     //this.disabilityGroup['controls'].num_financial_quote.setValue(data.data.num_financial_quote)
  //    }

  //   });

  // // this.disabilityService.id = null;
  // 	console.log('this.disabilityService.id es igual a ' + this.disabilityService.id);
  // }

}
