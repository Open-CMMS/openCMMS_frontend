import { Component, OnInit, OnDestroy } from '@angular/core';
import { faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Equipment } from 'src/app/models/equipment';
import { Router } from '@angular/router';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/internal/Subscription';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-equipments-list',
  templateUrl: './equipments-list.component.html',
  styleUrls: ['./equipments-list.component.scss']
})
export class EquipmentsListComponent implements OnInit, OnDestroy {
  // local Variables
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  equipments: Equipment[] = [];
  equipmentsSubscription: Subscription = null;

  /**
   * Constructor for the equipmentList component
   * @param equipmentService The service to communicate with backend on Equipment objects
   * @param router The service used to handle redirections
   * @param utilsService the service used for useful methods
   * @param authenticationService the authentication service
   */
  constructor(
    private equipmentService: EquipmentService,
    private router: Router,
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private authenticationService: AuthenticationService
  ) { }

  /**
   * Function that initialize the component when loaded
   * The component is initialized by getting all the saved equipments
   * on the backend database and saving them in a local variable.
   */
  ngOnInit(): void {
    this.equipmentsSubscription = null;
    this.equipments = [];
    this.equipmentsSubscription = this.equipmentService.equipmentsSubject.subscribe(
      (eqs: Equipment[]) => {
        this.equipments = eqs;
      }
    );
    this.equipmentService.emitEquipments();
  }
  /**
   * Function that redirect to a precise equipment details page
   * @param equipment The Equipment to display
   */
  onViewEquipment(equipment: Equipment) {
    this.router.navigate(['/equipments', equipment.id]);
  }
  /**
   * Function that opens the modal to confirm a deletion
   * @param content the modal template to load
   * @param equipment the equipment concerned by the deletion
   */
  openDelete(content, equipment: Equipment) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteEquipment(equipment);
      }
    });
  }
  /**
   * Function to delete a equipment
   * @param equipment the equipment to delete
   */
  onDeleteEquipment(equipment: Equipment) {
    this.equipmentService.deleteEquipment(equipment.id).subscribe(
      (resp) => {
        this.router.navigate(['/users']);
        this.equipmentService.getEquipments();
      }
    );
  }

  /**
   * Function that display Delete button when having permission
   */
  onDeleteEquipmentPermission() {
    return this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'delete_equipment'
        );
  }

  /**
   * Function to delete a equipment
   * @param equipment the equipment to delete
   */
  ngOnDestroy() {
    this.equipmentsSubscription.unsubscribe();
  }
}
