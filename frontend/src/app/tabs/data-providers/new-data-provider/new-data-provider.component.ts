import { Component, OnInit } from '@angular/core';
import { faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataProviderService} from "../../../services/data-provider/data-provider.service";
import {Equipment} from "../../../models/equipment";

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
  equipmentList: Equipment[];

  // Field Select
  fieldList: string[];

  // Recurrence
  recurrenceRegex: string;

  constructor( private formBuilder: FormBuilder,
               private dataProviderService: DataProviderService,
               ) { }

  ngOnInit(): void {
    // Fake back
    this.fileNameList = ['test.py', 'emb.py'];
    // this.equipmentList = ['Test', 'Embouteilleuse'];
    this.fieldList = ['Test', 'Nb bouteilles'];
    // get Data providers
    this.dataProviderService.dataProvidersSubject.subscribe(() => {
    });
    this.dataProviderService.emitDataProviders();

    // get Equipements
    this.dataProviderService.equipmentsSubject.subscribe(
      (equipments: Equipment[]) => {
        this.equipmentList = equipments;
      }
    );
    this.dataProviderService.emitEquipments();
    // get file names
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
      activated: [true],
    });
  }

  onTest() {
    console.log('pass onTest');
  }

  test4Dev() {
    console.log('TEST');
    const formValues = this.createForm.value;
    console.log(formValues.name);
    console.log(formValues.fileName);
    console.log(formValues.equipment);
    console.log(formValues.equipment_ip);
    console.log(formValues.field);
    console.log(formValues.activated);
  }

  onCreateDataProvider() {
    const formValues = this.createForm.value;
    console.log('pass onCreateDataProvider');
  }

}
