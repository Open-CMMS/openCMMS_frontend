import { Component, OnInit} from '@angular/core';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-equipment-details',
  templateUrl: './equipment-details.component.html',
  styleUrls: ['./equipment-details.component.scss']
})
export class EquipmentDetailsComponent implements OnInit {
// Local variables
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;
  loaded = false;
  updateError = false;
  name: string;
  id: number;
  files: number[];
  equipment_type: number;
  currentEquipment: Equipment = null;
  equipmentUpdateForm: FormGroup;

  /**
   * Constructor for component TeamDetailsComponent
   * @param router the service used to handle redirections
   * @param equipmentService the service to communicate with backend on Equipment objects
   * @param route the service used to analyse the current URL
   * @param formBuilder the service to handle forms
   * @param modalService the service used to handle modal windows
   * @param authenticationService the auth service
   * @param utilsService the service used for useful functions
   */
  constructor(private router: Router,
              private equipmentService: EquipmentService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private authenticationService: AuthenticationService,
              private utilsService: UtilsService) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params.id;
    });
    this.equipmentService.getEquipment(this.id)
      .subscribe(eq => {
        this.currentEquipment = eq;
        this.loaded = true;
        this.initForm();
      },
      (error) => this.router.navigate(['/four-oh-four']));
    // this.files = this.currentEquipment.files;
    this.name = this.currentEquipment.name;
    this.equipment_type = this.currentEquipment.equipment_type;
  }

  /**
   * Function to delete an Equipment
   */
  onDeleteEquipment() {
    this.equipmentService.deleteEquipment(this.currentEquipment.id).subscribe(
      (resp) => {
        this.equipmentService.getEquipments();
        this.router.navigate(['/equipments']);
      }
    );
  }

  /**
   * Function to modify a equipment
   */
  onModifyEquipment() {
    const formValues = this.equipmentUpdateForm.value;
    if (this.currentEquipment.name !== formValues.name) {
      this.currentEquipment.name = formValues.name;
    }
    if (this.currentEquipment.equipment_type !== formValues.equipment_type) {
      this.currentEquipment.equipment_type = formValues.equipment_type;
    }
    // if (this.currentEquipment.files !== formValues.files) {
    //   this.currentEquipment.files = formValues.files;
    // }
    this.equipmentService.updateEquipment(this.currentEquipment).subscribe(equipmentUpdated => {
      this.updateError = false;
      this.initForm();
      this.equipmentService.getEquipments();
    },
    (error) => {
      this.updateError = true;
    });
  }

  /**
   * Function that opens the modal to confirm a deletion
   * @param content the modal template to load
   */
  openDelete(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteEquipment();
      }
    });
  }

  /**
   * Function that opens the modal to confirm a deletion
   * @param content the modal template to load
   */
  openModify(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-modify'}).result.then((result) => {
      if (result === 'OK') {
        this.onModifyEquipment();
      }
    });
  }

  /**
   * Fonction that initialise the form with the right values
   */
  initForm() {
    this.equipmentUpdateForm = this.formBuilder.group({
      name: '',
      equipment_type: ''
      // files: '',
    });
    this.equipmentUpdateForm.setValue({
      name: this.currentEquipment.name,
      equipment_type: this.currentEquipment.equipment_type,
      // files: this.currentEquipment.files;
    });
  }

  /**
   * Function that display Modify button in navbar when current User has the correct permission
   */
  onChangeEquipmentPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'change_equipment'
      );
  }

  /**
   * Function that display Delete button in navbar when current User has the correct permission
   */
  onDeleteEquipmentPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'delete_equipment'
      );
  }
}
