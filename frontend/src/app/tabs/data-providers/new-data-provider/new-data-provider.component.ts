import { Component, OnInit } from '@angular/core';
import { faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-data-provider',
  templateUrl: './new-data-provider.component.html',
  styleUrls: ['./new-data-provider.component.scss']
})
export class NewDataProviderComponent implements OnInit {

  faInfoCircle = faInfoCircle;

  // Form
  createForm: FormGroup;

  // fileName Select
  fileNameList: string[];

  // Equipment Select
  equipmentList: string[];

  // Field Select
  fieldList: string[];

  // Recurrence
  recurrenceRegex: string;

  constructor( private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // Fake back
    this.fileNameList = ['test.py', 'emb.py'];
    this.equipmentList = ['Test', 'Embouteilleuse'];
    this.fieldList = ['Test', 'Nb bouteilles'];

    this.initForm();
  }

  initForm() {
    this.recurrenceRegex = '^((([0-9]+)d)?\\s*(([0-9]+)h)?\\s*(([0-9]+)m)?)$';
    const regex_time = new RegExp('^((([0-9]+)d)?\\s*(([0-9]+)h)?\\s*(([0-9]+)m)?)$');

    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      fileName: [''],
      equipment: [''],
      equipment_ip: [''],
      field: [''],
      recurrence: ['', Validators.pattern(regex_time)],
    });
  }

  test4Dev() {
    console.log('TEST');
    const formValues = this.createForm.value;
    console.log(formValues.name);
    console.log(formValues.fileName);
    console.log(formValues.equipment);
    console.log(formValues.equipment_ip);
    console.log(formValues.field);
  }

  onCreateDataProvider() {
    const formValues = this.createForm.value;
    console.log('pass onCreateDataProvider');
  }

}
