import { Component, OnInit } from '@angular/core';
import { Equipment } from 'src/app/models/equipment';
import { Subscription } from 'rxjs';
import { EquipmentType } from 'src/app/models/equipment-type';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EquipmentTypeService } from 'src/app/services/equipment-types/equipment-type.service';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Router } from '@angular/router';

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
  }

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
    this.equipmentTypeService.createEquipmentType(new EquipmentType(id, name, [], equipments)).subscribe(
      equipment_type => {
        this.equipmentTypeService.equipment_types.push(equipment_type);
        this.equipmentTypeService.emitEquipmentTypes();
        this.equipmentTypeForm.reset();
        this.router.navigate(['/equipment-types']);
      });
  }
}
