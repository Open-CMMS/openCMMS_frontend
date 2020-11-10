import { Component, OnInit } from '@angular/core';
import { faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataProviderService} from "../../../services/data-provider/data-provider.service";
import {Equipment} from "../../../models/equipment";
import {Field} from "../../../models/field";
import {DataProvider} from "../../../models/data-provider";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-data-provider',
  templateUrl: './new-data-provider.component.html',
  styleUrls: ['./new-data-provider.component.scss']
})
export class NewDataProviderComponent implements OnInit {

  faInfoCircle = faInfoCircle;

  tested = false;
  success = false;

  // Form
  createForm: FormGroup;

  // fileName Select
  fileNames: string[];

  // Equipment Select
  equipments: Equipment[];

  // Field Select
  fields: Field[];

  // Recurrence
  recurrenceRegex: string;

  constructor( private formBuilder: FormBuilder,
               private dataProviderService: DataProviderService,
               private router: Router,
               ) { }

  ngOnInit(): void {
    // get pythonFiles
    this.dataProviderService.fileNamesSubject.subscribe(
      ( fileNames: string[]) => {
        this.fileNames = fileNames;
      }
    );
    this.dataProviderService.emitFileNames();

    // get Data providers
    this.dataProviderService.dataProvidersSubject.subscribe(() => {
    });
    this.dataProviderService.emitDataProviders();

    // get Equipements
    this.dataProviderService.equipmentsSubject.subscribe(
      (equipments: Equipment[]) => {
        this.equipments = equipments;
      }
    );
    this.dataProviderService.emitEquipments();
    this.initForm();
  }

  initForm() {
    this.recurrenceRegex = '^((([0-9]+)d)?\\s*(([0-9]+)h)?\\s*(([0-9]+)m)?)$';
    const regex_time = new RegExp('^((([0-9]+)d)?\\s*(([0-9]+)h)?\\s*(([0-9]+)m)?)$');

    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      fileName: ['', Validators.required],
      equipment: ['', Validators.required],
      equipment_ip: ['', Validators.required],
      field: ['', Validators.required],
      recurrence: ['', [Validators.pattern(regex_time), Validators.required]],
      activated: [true, Validators.required],
    });
  }

  onSelectField() {
    this.equipments.forEach(
      (aEquipment) => {
        if (aEquipment.id.toString() === this.createForm.value.equipment) {
          this.fields = aEquipment.fields;
        }
      }
    );
  }

  onTest() {
    const formValues = this.createForm.value;
    const newDataProvider = new DataProvider(1,
      formValues.name,
      formValues.fileName,
      formValues.recurrence ? formValues.recurrence : '1h',
      formValues.activated,
      formValues.equipment,
      formValues.equipment_ip,
      formValues.field
    );
    this.dataProviderService.testDataProvider(newDataProvider).subscribe(
      (response) => {
        this.tested = true;
        this.success = true;
        // this.success = (typeof response === 'number');
      },
    (error) => {
        this.tested = true;
        this.success = false;
    }
    );
  }

  onCreateDataProvider() {
    const formValues = this.createForm.value;
    const newDataProvider = new DataProvider(1,
      formValues.name,
      formValues.fileName,
      formValues.recurrence,
      formValues.activated,
      formValues.equipment,
      formValues.equipment_ip,
      formValues.field
      );
    this.dataProviderService.createDataProvider(newDataProvider).subscribe(
      (dataProvider) => {
        this.router.navigate(['/data-providers']);
        this.dataProviderService.getDataProviders();
      }
    );
  }

}
