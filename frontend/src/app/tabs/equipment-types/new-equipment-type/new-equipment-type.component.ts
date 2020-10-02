import { Component, OnInit } from '@angular/core';
import { Equipment } from 'src/app/models/equipment';
import { Subscription } from 'rxjs';
import { EquipmentType } from 'src/app/models/equipment-type';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EquipmentTypeService } from 'src/app/services/equipment-types/equipment-type.service';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Router } from '@angular/router';
import { faPlusSquare, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-new-equipment-type',
  templateUrl: './new-equipment-type.component.html',
  styleUrls: ['./new-equipment-type.component.scss']
})
export class NewEquipmentTypeComponent implements OnInit {

  // Local variables
  equipments: Equipment[] = [];
  equipmentsSubscription: Subscription;
  newEquipmentType: EquipmentType;

  // variables for the dropdown selects
  equipmentsList = [];
  dropdownEquipmentsSettings: IDropdownSettings;

  // Forms :
  equipmentTypeForm: FormGroup;

  // Icons
  faPlusSquare = faPlusSquare;
  faMinusCircle = faMinusCircle;

  // Fields
  fields = [];
  fieldSelectTemplate = null;

  // Multiple select
  fieldsList = [];
  selectedField = [];
  dropdownFieldsSettings: IDropdownSettings;


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
      this.equipments = equipments;
      this.initEquipmentsSelect();
    });
    this.equipmentService.emitEquipments();
    this.initForm();

    // A supprimer, uniquement pour les tests ici
    this.fieldsList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedField = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownFieldsSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  };

  /**
   * Function that initialize the dropdown select for equipments
   */
  initEquipmentsSelect() {
    this.equipmentsList = [];
    this.equipments.forEach(equipment => {
      this.equipmentsList.push({id: equipment.id.toString(), value: equipment.name.toString()});
    });
    this.dropdownEquipmentsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'value',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
  }

  /**
   * Function that initialize the fields in the form to create a new EquipmentType
   */
  initForm() {
    this.equipmentTypeForm = this.formBuilder.group({
      name: ['', Validators.required],
      equipments: ['']
    });
  }

  /**
   * Function to initialize the template for trigger condition objects. It is used to initialize
   * the dropdown selects as well
   * @param trigger_conditions_types the array with the different types of trigger conditions
   */
  initFieldSelectTemplate(fields_types: any[]) {
    this.fieldSelectTemplate = {
      selectedField: [],
      fieldsList: fields_types,
      dropdownFieldSettings: {
        singleSelection: true,
        idField: 'id',
        textField: 'value',
        allowSearchFilter: true
      },
      value: null,
      description: null
    };
  }

  onAddField() {
    const jsonCopy = JSON.stringify(this.fieldSelectTemplate);
    const objectCopy = JSON.parse(jsonCopy);
    this.fields.push(objectCopy);
  }

  deleteField(i: number){
    this.fields.splice(i, 1);
  }

  /**
   * Function that submits the form to create a new equipment type
   */
  onSubmit() {
    const formValue = this.equipmentTypeForm.value;

    const nameStr = 'name';
    const equipmentsStr = 'equipments';

    const id = 0;
    const name = formValue[nameStr];
    const equipments = [];
    if (formValue[equipmentsStr]) {
      formValue[equipmentsStr].forEach(item => {
        equipments.push(item.id);
      });
    }
    this.equipmentTypeService.createEquipmentType(new EquipmentType(id, name, equipments)).subscribe(
      equipment_type => {
        this.equipmentTypeService.equipment_types.push(equipment_type);
        this.equipmentTypeService.emitEquipmentTypes();
        this.equipmentTypeForm.reset();
        this.router.navigate(['/equipment-types']);
      });
  }
}
