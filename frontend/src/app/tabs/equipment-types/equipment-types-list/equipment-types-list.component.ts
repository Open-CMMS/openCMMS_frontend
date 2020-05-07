import { Component, OnInit, OnDestroy } from '@angular/core';
import { EquipmentTypeService } from 'src/app/services/equipment-types/equipment-type.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipmentType } from 'src/app/models/equipment-type';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-equipment-types-list',
  templateUrl: './equipment-types-list.component.html',
  styleUrls: ['./equipment-types-list.component.scss']
})
export class EquipmentTypesListComponent implements OnInit, OnDestroy {

  faTrash = faTrash;
  faInfoCircle = faInfoCircle;

  equipmentTypes: EquipmentType[] = [];
  equipmentTypesSubscription: Subscription;

  /**
   * Constructor for the EquipmentTypeListComponent
   * @param equipmentTypeService the service to communicate with backend on EquipmentType objects
   * @param router the service used to handle redirections
   */
  constructor(
    private equipmentTypeService: EquipmentTypeService,
    private router: Router,
    private modalService: NgbModal) { }

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
   * @param i the index of the equipmenttype to delete
   */
  openDelete(contentDelete, i: number) {
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
   * Function called when the component is destroyed
   */
  ngOnDestroy() {
    this.equipmentTypesSubscription.unsubscribe();
  }

}
