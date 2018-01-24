import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'demo-checkbox',
  templateUrl: './checkbox.component.html',
})
export class CheckboxComponent {
  myValue = false;
  checked = true;
  disabled = false;
  required = true;
  indeterminate = false;
  myTheme = 'primary';
  myForm = this.formBuilder.group({
    myCheck: [
      false,
    ],
  });


  constructor(
    private formBuilder: FormBuilder,
  ) {}


  changed(e: any) {
    console.log('Input changed: ', e);
  }

  interChanged(e: any) {
    console.log('Indeterminate input changed: ', e);
  }

  submit(v: any) {
    console.log('DEMO: form submit: ', v);
  }

}