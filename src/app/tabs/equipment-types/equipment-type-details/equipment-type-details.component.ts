import { Component, OnInit } from '@angular/core';
import { faInfoCircle, faPencilAlt, faSave, faPlusSquare, faTrash, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentType } from 'src/app/models/equipment-type';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EquipmentTypeService } from 'src/app/services/equipment-types/equipment-type.service';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-equipment-type-details',
  templateUrl: './equipment-type-details.component.html',
  styleUrls: ['./equipment-type-details.component.scss']
})
export class EquipmentTypeDetailsComponent implements OnInit {

  faInfoCircle = faInfoCircle;
  faPencilAlt = faPencilAlt;
  faSave = faSave;
  faPlusSquare = faPlusSquare;
  faTrash = faTrash;
  faChevronLeft = faChevronLeft;

  // Local variables
  id: number;
  name: string;
  equipments: Equipment[];
  all_equipments: Equipment[] = [];
  fields = [];
  equipment_type: EquipmentType;
  modifyFields = false;
  newFieldsValues = [];

  // the Forms
  equipmentTypeForm: FormGroup;

  /**
   * Constructor for the NewEquipmentComponent
   * @param router the service used to handle redirections
   * @param equipmentTypeService the service to communicate with backend on EquipmentType objects
   * @param equipmentService the service to communicate with backend on Equipment objects
   * @param route the service to get the id of the equipmentType in the url
   * @param modalService the service to create popups
   * @param formBuilder the service to handle forms
   * @param utilsService the service used for useful methods
   * @param authenticationService the authentication service
   */
  constructor(private router: Router,
              private equipmentTypeService: EquipmentTypeService,
              private equipmentService: EquipmentService,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.initFields();
    this.equipmentService.equipmentsSubject.subscribe((equipments: Equipment[]) => {
      this.all_equipments = equipments;
    });
    this.equipmentService.emitEquipments();
    this.initForm();
  }

  /**
   * Function that initialize the equipment type fields when the component is loaded
   */
  initFields() {
    this.route.params.subscribe(params => {
      this.id = +params.id;
    });
    this.equipmentTypeService.getEquipmentType(this.id).subscribe((equipment_type: EquipmentType) => {
      this.name = equipment_type.name;
      this.equipments = equipment_type.equipments;
      this.fields = equipment_type.field;
    });
  }

  /**
   * Function that navigates to the EquipmentDetailComponent
   * @param equipment the equipment to navigate to
   */
  onViewEquipment(equipment) {
    this.router.navigate(['/equipments', equipment.id]);
  }

  /**
   * Function that opens the modify modal
   * @param contentModify the content to put in the modal
   */
  openModify(contentModify) {
    this.modalService.open(contentModify, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  /**
   * Function that opens the delete modal
   * @param contentDelete the content to put in the modal
   */
  openDelete(contentDelete) {
    this.modalService.open(contentDelete, {ariaLabelledBy: 'modal-basic-title'});
  }

  /**
   * Function that deletes the equipmentType and navigates back to the EquipmentTypeListComponent
   */
  onDelete() {
    this.equipmentTypeService.deleteEquipmentType(this.id);
    this.router.navigate(['/equipment-types']);
    this.modalService.dismissAll();
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
   * Function that submits the form to modify the equipmentType
   */
  modifyEquipmentType() {
    const formValue = this.equipmentTypeForm.value;
    const nameStr = 'name';
    const id = this.id;
    const name = formValue[nameStr] !== '' ? formValue[nameStr] : this.name;
    const field = this.fields;
    this.equipmentTypeService.updateEquipmentType(new EquipmentType(id, name, field)).subscribe(
        equipment_type => {
          const old_equipment_type = this.equipmentTypeService.equipment_types.find((value) => {
            return value.id === equipment_type.id;
          });
          const index = this.equipmentTypeService.equipment_types.indexOf(old_equipment_type);
          this.equipmentTypeService.equipment_types[index] = equipment_type;

          this.equipmentTypeService.emitEquipmentTypes();

          this.initFields();
        });
    this.modalService.dismissAll();
  }

  /**
   * Function that displays the Modify button when having permission
   */
  onChangeEquipmentTypePermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'delete_equipmenttype'
      );
  }

  /**
   * Function that displays the Delete button when having permission
   */
  onDeleteEquipmentTypePermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'delete_equipmenttype'
      );
  }

  /**
   * Function that allows to modify the fields
   */
  openModifyField() {
    this.modifyFields = true;
    this.newFieldsValues = [];
  }

  /**
   * Function to save the modification of the values
   */
  saveFields() {
    this.modifyFields = false;
    this.newFieldsValues.forEach((element, index) => {
      if (element !== '') {
        element.split(',').map(s => {
          this.fields[index].value.push(String(s).replace(/\s/g, ''));
        });
      }
    });
    this.modifyEquipmentType();
  }

  /**
   * Function to return to the listing page.
   */
  onViewListing() {
    this.router.navigate(['equipment-types/']);
  }
}
