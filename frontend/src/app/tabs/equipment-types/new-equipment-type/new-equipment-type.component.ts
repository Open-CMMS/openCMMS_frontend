import { Component, OnInit } from '@angular/core';
import { EquipmentType } from 'src/app/models/equipment-type';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EquipmentTypeService } from 'src/app/services/equipment-types/equipment-type.service';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Router } from '@angular/router';
import { faPlusSquare, faMinusCircle, faPencilAlt, faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-new-equipment-type',
  templateUrl: './new-equipment-type.component.html',
  styleUrls: ['./new-equipment-type.component.scss']
})
export class NewEquipmentTypeComponent implements OnInit {

  // Local variables
  newEquipmentType: EquipmentType;
  openField = false;
  addField = true;
  fieldName: string;
  editingField = [];
  fieldList = [];

  // Forms :
  equipmentTypeForm: FormGroup;
  fieldForm: FormGroup;

  // Icons
  faPlusSquare = faPlusSquare;
  faMinusCircle = faMinusCircle;
  faPencilAlt = faPencilAlt;
  faSave = faSave;

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
    this.initFieldForm();
  }

  /**
   * Function that initialize the fields in the form to create a new EquipmentType
   */
  initGeneralForm() {
    this.equipmentTypeForm = this.formBuilder.group({
      name: [this.INIT_NAME, Validators.required]
    });
  }

  /**
   * Function that initialize the field in the field form to create a new Field
   */
  initFieldForm() {
    this.fieldForm = this.formBuilder.group({
      fieldName: [this.INIT_FIELD_NAME, Validators.required],
      fieldValue: [this.INIT_FIELD_VALUE]
    });
  }

  /**
   * Function that set openField to true and addField to false.
   */
  onOpenField() {
    this.openField = true;
    this.addField = false;
  }

  /**
   * Function that set openField to false and addField to true.
   */
  onCloseField() {
    this.openField = false;
    this.addField = true;
  }

  /**
   * Function to add a field with fieldName and fieldValue
   */
  onAddField() {
    const formValue = this.fieldForm.value;
    const fieldName = formValue.fieldName;
    const fieldValue = formValue.fieldValue;
    const fieldNameJsonCopy = JSON.stringify(fieldName);
    const fieldValueJsonCopy = JSON.stringify(fieldValue);
    const objectFieldName = JSON.parse(fieldNameJsonCopy);
    const objectFieldValue = JSON.parse(fieldValueJsonCopy);
    // Si le fieldValue === '', on ajoute uniquement le name=fieldName. Sinon on ajoute le name=fieldName et value=fieldValue
    objectFieldValue === '' ?
      this.fieldList.push({name: objectFieldName}) : this.fieldList.push({name: objectFieldName, value: objectFieldValue});
    this.editingField.push(false);
    this.fieldForm.controls.fieldName.setValue(this.INIT_FIELD_NAME);
    this.fieldForm.controls.fieldValue.setValue(this.INIT_FIELD_VALUE);
    this.openField = false;
    this.addField = true;
  }

  /**
   * Function to know if a object is empty
   * @param obj the object
   */
  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  /**
   * Function to delete a specific field in the fieldList
   * @param key the key
   */
  deleteField(key: string) {
    const indexOf = this.fieldList.indexOf(key);
    this.fieldList.splice(indexOf, 1);
  }

  /**
   * Function to edit a specific field in the fieldList
   * @param key the key
   */
  onEditField(key) {
    const indexOf = this.fieldList.indexOf(key);
    this.editingField[indexOf] = !this.editingField[indexOf];
  }

  /**
   * Function to know if we are editing a specific field.
   * @param key the key
   */
  isEditingField(key) {
    const indexOf = this.fieldList.indexOf(key);
    return this.editingField[indexOf];
  }

  /**
   * Function to verify if the name and the value of the edited field are not empty.
   * @param field the field
   */
  isEditingFieldValid(field) {
    return field[this.FIELDNAME_NAME].length === 0;
  }

  /**
   * Function to format the Field 'fields' in the payload.
   */
  formatFieldPayload() {
    this.fieldList.forEach((field) => {
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
    this.formatFieldPayload(); // format this.fieldList before send to service
    this.equipmentTypeService.createEquipmentType(new EquipmentType(id, name, this.fieldList)).subscribe(
      equipment_type => {
        this.equipmentTypeService.equipment_types.push(equipment_type);
        this.equipmentTypeService.emitEquipmentTypes();
        this.equipmentTypeForm.reset();
      });
    this.router.navigate(['/equipment-types']);

  }

  /**
   * Function to verify if the form can be validate, in particular if one field is being editing
   */
  canValidateForm() {
    let canValidateForm = true;
    this.editingField.forEach(element => {
      if (element) {
        canValidateForm = false;
      }
    });
    return canValidateForm;
  }

  /**
   * Function call on submit fieldForm form.
   */
  onSubmitField() {
    if (this.fieldForm.invalid) {
      return;
    }
  }
}
