import { Component, OnInit } from '@angular/core';
import { EquipmentType } from 'src/app/models/equipment-type';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { EquipmentTypeService } from 'src/app/services/equipment-types/equipment-type.service';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Router } from '@angular/router';
import { faPlusSquare, faMinusCircle, faPencilAlt, faPlusCircle, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-new-equipment-type',
  templateUrl: './new-equipment-type.component.html',
  styleUrls: ['./new-equipment-type.component.scss']
})
export class NewEquipmentTypeComponent implements OnInit {

  // Local variables
  newEquipmentType: EquipmentType;

  // Fields
  fields = [];
  fieldTemplate = null;

  // Forms :
  equipmentTypeForm: FormGroup;

  // Icons
  faPlusSquare = faPlusSquare;
  faMinusCircle = faMinusCircle;
  faPlusCircle = faPlusCircle;
  faPencilAlt = faPencilAlt;
  faCheck = faCheck;
  faTimes = faTimes;

  // Consts
  FIELDVALUE_NAME = 'value';
  FIELDNAME_NAME = 'name';
  INIT_NAME = '';
  INIT_FIELD_NAME = '';
  INIT_FIELD_VALUE = '';

  /**
   * Constructor for the NewEquipmentComponent
   * @param equipmentService the service to communicate with backend on Equipment objects
   * @param equipmentTypeService the service to communicate with backend on EquipmentType objects
   * @param router the service used to handle redirections
   * @param formBuilder the service to handle forms
   */
  constructor(private equipmentTypeService: EquipmentTypeService,
              private equipmentService: EquipmentService,
              private router: Router,
              private formBuilder: FormBuilder) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.equipmentService.equipmentsSubject.subscribe(() => {
    });
    this.equipmentService.emitEquipments();
    this.initGeneralForm();
    this.initAddFieldTemplate();
  }

  /**
   * Function that initialize the fields in the form to create a new EquipmentType
   */
  initGeneralForm() {
    this.equipmentTypeForm = this.formBuilder.group({
      name: [this.INIT_NAME, [Validators.required, this.noWhiteSpaceValidator]]
    });
  }

  /**
   * Function to initialize the template for field objects.
   */
  initAddFieldTemplate() {
    this.fieldTemplate = {
      name: this.INIT_FIELD_NAME,
      value: this.INIT_FIELD_VALUE,
    };
  }

  /**
   * Function to add a field to the field list: fields
   */
  onAddField() {
    const jsonCopy = JSON.stringify(this.fieldTemplate);
    const objectCopy = JSON.parse(jsonCopy);
    this.fields.push(objectCopy);
  }

  /**
   * Function to format the Field 'fields' in the payload.
   */
  formatFieldPayload() {
    this.fields.forEach((field) => {
      if (field[this.FIELDVALUE_NAME]) {
        field[this.FIELDVALUE_NAME] = field[this.FIELDVALUE_NAME].split(',').map(
          s => s.trim()
        );
      }
    });
  }

  /**
   * Function that submits the form to create a new equipment type
   */
  onSubmit() {
    if (this.equipmentTypeForm.invalid) {
      return;
    }
    const formValue = this.equipmentTypeForm.value;
    const nameStr = 'name';
    const id = 0;
    const name = formValue[nameStr];
    this.formatFieldPayload(); // format this.fields before send to service
    this.equipmentTypeService.createEquipmentType(new EquipmentType(id, name, this.fields)).subscribe(
      equipment_type => {
        this.equipmentTypeService.equipment_types.push(equipment_type);
        this.equipmentTypeService.emitEquipmentTypes();
        this.equipmentTypeForm.reset();
      });
    this.router.navigate(['/equipment-types']);
  }

  /**
   * Function to verify if every field lines are completed
   */
  canValidateForm() {
    let canValidateForm = true;
    this.fields.forEach(field => {
      if (!this.fieldIsFill(field)) {
        canValidateForm = false;
      }
    });
    return canValidateForm;
  }

  /**
   * Function to verify if a field line in completed
   * @param field the field to check
   */
  canValidateLine(field) {
    let filled = true;
    if (!this.fieldIsFill(field)) {
      filled = false;
    }
    return filled;
  }

  /**
   * Function to verify if a field is completed
   * @param field the field to check
   */
  fieldIsFill(field) {
    return (field.name !== this.INIT_FIELD_NAME);
  }

  public noWhiteSpaceValidator(control: FormControl) {
    const isWhiteSpace = (control.value || '').trim().length === 0;
    const isValid = !isWhiteSpace;
    return isValid ? null : {whitespace: true};
  }

  /**
   * Function to delete a field
   * @param i the position of the field to delete
   */
  deleteField(i: number) {
    this.fields.splice(i, 1);
  }
}
