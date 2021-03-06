import { Component, OnInit, OnDestroy } from '@angular/core';
import { EquipmentTypeService } from 'src/app/services/equipment-types/equipment-type.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipmentType } from 'src/app/models/equipment-type';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-equipment-types-list',
  templateUrl: './equipment-types-list.component.html',
  styleUrls: ['./equipment-types-list.component.scss']
})
export class EquipmentTypesListComponent implements OnInit, OnDestroy {

  // Local variables
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  equipmentTypes: EquipmentType[] = [];
  equipmentTypesSubscription: Subscription;
  modalEquipmentTypeName = '';


  /**
   * Constructor for the EquipmentTypeListComponent
   * @param equipmentTypeService the service to communicate with backend on EquipmentType objects
   * @param router the service used to handle redirections
   * @param modalService the service to handle modal
   * @param utilsService the service used for useful methods
   * @param authenticationService the authentication service
   */
  constructor(
    private equipmentTypeService: EquipmentTypeService,
    private router: Router,
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private authenticationService: AuthenticationService) { }

  /**
   * Function that initializes the component when loaded
   */
  ngOnInit(): void {
    this.equipmentTypesSubscription = this.equipmentTypeService.equipment_types_subject.subscribe(
      (equipmentTypes: EquipmentType[]) => {
        this.equipmentTypes = equipmentTypes;
      }
    );
    this.equipmentTypeService.emitEquipmentTypes();
  }

  /**
   * Function that navigates to the EquipmentTypeDetailComponent
   * @param i the index of the equipmentType in the list
   */
  onViewEquipmentType(i: number) {
    const equipment_type_id = this.equipmentTypes[i].id;
    this.router.navigate(['/equipment-types', equipment_type_id]);
  }

  /**
   * Function that opens the delete modal
   * @param contentDelete the content to put in the modal
   * @param equipmentType the equipment type
   * @param i the index of the equipment type to delete
   */
  openDelete(contentDelete, equipmentType: EquipmentType, i: number) {
    this.modalEquipmentTypeName = equipmentType.name;
    this.modalService.open(contentDelete, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteEquipmentType(i);
      }
    });
  }

  /**
   * Function that navigates to delete a TeamType
   * @param i the index of the teamType in the list
   */
  onDeleteEquipmentType(i: number) {
    const equipment_type_id = this.equipmentTypes[i].id;
    this.equipmentTypeService.deleteEquipmentType(equipment_type_id);
  }

  /**
   * Function that navigates to delete a TeamType
   */
  onDeleteEquipmentTypePermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'delete_equipmenttype'
      );
  }

  /**
   * Function called when the component is destroyed
   */
  ngOnDestroy() {
    this.equipmentTypesSubscription.unsubscribe();
  }

}
