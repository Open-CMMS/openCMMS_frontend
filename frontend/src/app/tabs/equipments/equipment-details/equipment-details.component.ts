import { Component, OnInit} from '@angular/core';
import { faTrash, faPencilAlt, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Subject } from 'rxjs/internal/Subject';
import { FileService } from 'src/app/services/files/file.service';
import { faMinusSquare } from '@fortawesome/free-regular-svg-icons';
import { environment } from 'src/environments/environment';
import { EquipmentTypeService } from 'src/app/services/equipment-types/equipment-type.service';
import { EquipmentType } from 'src/app/models/equipment-type';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-equipment-details',
  templateUrl: './equipment-details.component.html',
  styleUrls: ['./equipment-details.component.scss']
})
export class EquipmentDetailsComponent implements OnInit {
// Local variables
  faPlusSquare = faPlusSquare;
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;
  faMinusSquare = faMinusSquare;
  loaded = false;
  updateError = false;
  filesSubject = new Subject<File[]>();
  name: string;
  id: number;
  files: number[];
  equipment_type: number;
  currentEquipment: Equipment = null;
  equipmentTypeName: string;
  equipmentUpdateForm: FormGroup;
  myFiles: File[] = [];
  equipmentTypesSubscription: Subscription;
  myFilesPath: string[] = [];
  private BASE_URL_API = environment.baseUrl;
  equipmentTypes: EquipmentType[];

  /**
   * Constructor for component TeamDetailsComponent
   * @param router the service used to handle redirections
   * @param equipmentService the service to communicate with backend on Equipment objects
   * @param route the service used to analyse the current URL
   * @param formBuilder the service to handle forms
   * @param modalService the service used to handle modal windows
   * @param authenticationService the auth service
   * @param utilsService the service used for useful functions
   * @param fileService the file service
   * @param equipmentTypeService the equipment Type service
   */
  constructor(private router: Router,
              private equipmentService: EquipmentService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private authenticationService: AuthenticationService,
              private utilsService: UtilsService,
              private fileService: FileService,
              private equipmentTypeService: EquipmentTypeService) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.myFiles = [];
    this.myFilesPath = [];
    let i = 0;
    this.route.params.subscribe(params => {
      this.id = +params.id;
    });
    this.equipmentTypesSubscription = this.equipmentTypeService.equipment_types_subject.subscribe(
      (equipmentTypes: EquipmentType[]) => {
        this.equipmentTypes = equipmentTypes;
    });
    this.equipmentService.getEquipment(this.id)
      .subscribe(eq => {
        this.currentEquipment = eq;
        this.name = this.currentEquipment.name;
        this.equipment_type = this.currentEquipment.equipment_type;
        this.getEquipmentTypeName(this.currentEquipment.equipment_type.id);
        // Erreur Property 'id' does not exist on type 'number' mais si on ne le met pas erreur dans la requête Get equipmentType
        // Incohérence entre le get et le post d'un equipment type, le premier renvoie un EquipmentType mais le deuxième créer
          // un equipment en envoyé juste l'id de l'equipment type pas un type Equipment type
        this.files = this.currentEquipment.files;
        this.loaded = true;
        this.initForm();
        for (i; i < this.files.length; i++) {
          this.fileService.getFile(this.files[i]).subscribe(df => {
            this.myFilesPath.push(String(df.file).slice(6));
          });
        }
        this.myFilesPath.splice(6);
      },
      (error) => this.router.navigate(['/four-oh-four']));
  }

  /**
   * Function to delete an Equipment
   */
  onDeleteEquipment() {
    this.equipmentService.deleteEquipment(this.currentEquipment.id).subscribe(
      (resp) => {
        this.router.navigate(['/equipments']);
        this.equipmentService.getEquipments();
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
      this.getEquipmentTypeName(this.currentEquipment.equipment_type.id);
    }
    if (this.currentEquipment.files !== formValues.files) {
      this.currentEquipment.files = formValues.files;
    }
    this.equipmentService.updateEquipment(this.currentEquipment).subscribe(equipmentUpdated => {
      this.updateError = false;
      this.ngOnInit();
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
      equipment_type: '',
      files: '',
    });
    this.equipmentUpdateForm.setValue({
      name: this.currentEquipment.name,
      equipment_type: this.currentEquipment.equipment_type,
      files: this.currentEquipment.files
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
  /**
   * Function that is triggered when a or multiple files are chosen(when button "Browse" is pressed and files are chosen)
   * Upload files if not already uploaded.
   * @param event file selection event from input of type file
   */
  onFileUpload(event) {
    let formData: FormData;
    let i = 0;
    for (i; i < event.target.files.length; i++) {
      if (!this.myFiles.includes(event.target.files[i])) {
        this.myFiles.push(event.target.files[i]);
        formData = new FormData();
        formData.append('file', event.target.files[i], event.target.files[i].name);
        formData.append('is_manual', 'false' );
        this.fileService.uploadFile(formData).subscribe(file => {
          this.files.push(Number(file.id));
        });
      }
    }
    this.filesSubject.next(this.myFiles);
  }

  /**
   * Function that is triggered when a file is removed from the files uploaded(when button "Minus" is pressed)
   * @param file file that need to be removed
   * Here we only need the index of the file from the local variable myFiles which is the same then in the variable files
   * from file we then can get the id of the file in the database to remove it.
   */
  onRemoveFile(file: File) {
    const index = this.myFiles.indexOf(file);
    this.myFiles.splice(index, 1);
    const id = this.files.splice(index, 1);
    this.fileService.deleteFile(id[0]);
    this.ngOnInit();
  }

  /**
   * Function that is triggered when a file is removed from the files uploaded(when button "Minus" is pressed)
   * @param filePath path of the file that need to be removed
   */
  onRemoveFilePath(filePath: string) {
    const index1: number = this.myFilesPath.indexOf(filePath);
    const fileId: number = this.files[index1];
    const index2: number = this.files.indexOf(fileId);
    if (index2 !== -1) {
        this.files.splice(index2, 1);
    }
    this.fileService.deleteFile(fileId);
  }

  /**
   * Function that opens the modal to confirm a deletion of a File.
   * @param content the modal template to load
   * @param filePath the filePath of the file we want to remove
   */
  openDeleteFile(filePath: string, content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-deleteFile'}).result.then((result) => {
      if (result === 'OK') {
        this.onRemoveFilePath(filePath);
        this.onModifyEquipment();
      }
    });
  }
  /**
   * Function that opens the modal to handle a file upload.
   * @param content the modal template to load
   */
  openUploadFile(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-addFile'}).result.then((result) => {
      if (result === 'OK') {
        this.onModifyEquipment();
      }
    });
  }
  /**
   * Function that create the array of files links.
   * @param filePath the filePath of the file we want to remove
   */
  createDownloadLink(filePath: string) {
    return this.BASE_URL_API + '/media/' + filePath;
  }

  getEquipmentTypeName(id: number) {
    this.equipmentTypeService.getEquipmentType(id).subscribe(eqType => {
      this.equipmentTypeName = eqType.name;
    }

    );
  }
}
