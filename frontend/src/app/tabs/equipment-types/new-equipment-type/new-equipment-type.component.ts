import { Component, OnInit } from '@angular/core';
import { Equipment } from 'src/app/models/equipment';
// import { Subscription } from 'rxjs';
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
  // equipmentsSubscription: Subscription;
  newEquipmentType: EquipmentType;
  openField = false;
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
    this.equipmentService.equipmentsSubject.subscribe((equipments: Equipment[]) => {
    });
    this.equipmentService.emitEquipments();
    this.initForm();
    this.fieldForm = this.formBuilder.group({
      fieldName: ['', Validators.required],
      fieldValue: ['']
    });
  }

  /**
   * Function that initialize the fields in the form to create a new EquipmentType
   */
  initForm() {
    this.equipmentTypeForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  /**
   * Function that set openField to true.
   */
  onOpenField() {
    this.openField = true;
  }

  /**
   * Function that set openField to false.
   */
  onCloseField() {
    this.openField = false;
  }

  onAddField() {
    const formValue = this.fieldForm.value;
    const fieldName = formValue.fieldName;
    const fieldValue = formValue.fieldValue;
    const fieldNameJsonCopy = JSON.stringify(fieldName);
    const fieldValueJsonCopy = JSON.stringify(fieldValue);
    const objectFieldName = JSON.parse(fieldNameJsonCopy);
    const objectFieldValue = JSON.parse(fieldValueJsonCopy);
    objectFieldValue === '' ?
      this.fieldList.push({name: objectFieldName}) : this.fieldList.push({name: objectFieldName, value: objectFieldValue});
    this.editingField.push(false);
    this.fieldForm.controls.fieldName.setValue('');
    this.fieldForm.controls.fieldValue.setValue('');
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  deleteField(key: string) {
    const indexOf = this.fieldList.indexOf(key);
    this.fieldList.splice(indexOf, 1);
  }

  onEditField(key) {
    const indexOf = this.fieldList.indexOf(key);
    this.editingField[indexOf] = !this.editingField[indexOf];
  }

  isEditingField(key) {
    const indexOf = this.fieldList.indexOf(key);
    return this.editingField[indexOf];
  }

  formatFieldPayload() {
    this.fieldList.forEach((field) => {
      if (field['value']) {
        field['value'] = field['value'].split(',').map(
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
    this.formatFieldPayload();
    this.equipmentTypeService.createEquipmentType(new EquipmentType(id, name, this.fieldList)).subscribe(
      equipment_type => {
        this.equipmentTypeService.equipment_types.push(equipment_type);
        this.equipmentTypeService.emitEquipmentTypes();
        this.equipmentTypeForm.reset();
      });
    this.router.navigate(['/equipment-types']);

  }

  onSubmitField() {
    if (this.fieldForm.invalid) {
      return;
    }
  }
}
