import { Component, OnInit, Input, ɵConsole } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldConfig } from '../models/field-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  optionSelected = new FormControl();
  @Input() options: FieldConfig;
  @Input() group: FormGroup;

  constructor(private router: Router) { }

  ngOnInit() {}

  changeOption(type) {
    console.log('hola');
    if (type.link) {
      this.router.navigateByUrl(type);
    }
  }

}
