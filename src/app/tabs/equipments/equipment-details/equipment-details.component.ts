import {Component, OnInit} from '@angular/core';
import {faTrash, faPencilAlt, faPlusSquare} from '@fortawesome/free-solid-svg-icons';
import {Equipment} from 'src/app/models/equipment';
import {EquipmentService} from 'src/app/services/equipments/equipment.service';
import {Router, ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormBuilder} from '@angular/forms';
import {AuthenticationService} from 'src/app/services/auth/authentication.service';
import {UtilsService} from 'src/app/services/utils/utils.service';
import {Subject} from 'rxjs/internal/Subject';
import {FileService} from 'src/app/services/files/file.service';
import {faMinusSquare, faMinusCircle, faSave, faCheck, faTimes, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {environment} from 'src/environments/environment';
import {EquipmentTypeService} from 'src/app/services/equipment-types/equipment-type.service';
import {EquipmentType} from 'src/app/models/equipment-type';
import {Subscription} from 'rxjs/internal/Subscription';
import {Field} from '../../../models/field';
import {UrlService} from '../../../services/shared/url.service';

@Component({
  selector: 'app-equipment-details',
  templateUrl: './equipment-details.component.html',
  styleUrls: ['./equipment-details.component.scss']
})
export class EquipmentDetailsComponent implements OnInit {

  // Icons
  faPlusSquare = faPlusSquare;
  faPencilAlt = faPencilAlt;
  faMinusCircle = faMinusCircle;
  faSave = faSave;
  faTrash = faTrash;
  faMinusSquare = faMinusSquare;
  faCheck = faCheck;
  faTimes = faTimes;
  faChevronLeft = faChevronLeft;

  // Local variables

  loaded = false;
  updateError = false;
  filesSubject = new Subject<File[]>();
  name: string;
  id: number;
  fields: any[] = [];
  new_fields: Field[] = [];
  files: any[];
  filesId: number[] = [];
  equipment_type: number;
  equipmentType: EquipmentType;
  equipmentTypeFields: Field[] = [];
  currentEquipmentTypeFields = [];
  newEquipmentTypeId: number = null;
  initialFields = [];
  filesAdded = false;
  filesDeleted = false;
  modifyFields = false;
  currentEquipment: Equipment = null;
  equipmentTypeName: string;
  equipmentUpdateForm: FormGroup;
  myFiles: File[] = [];
  equipmentTypesSubscription: Subscription;
  myFilesPath: string[] = [];
  private BASE_URL_API = environment.baseUrl;
  equipmentTypes: EquipmentType[];
  fieldTemplate = null;
  equipmentTypeModified = false;
  currentSelectFields: [];
  isCurrentEquipmentTypeFields = [];
  fileTypeCheck: boolean;
  fileCheck: boolean;
  previousUrl = '';

  // Constants
  INIT_FIELD_NAME  = '';
  INIT_FIELD_VALUE = '';


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
              private equipmentTypeService: EquipmentTypeService,
              private urlService: UrlService) {
  }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.fileCheck = true;
    this.fileTypeCheck = true;
    this.urlService.previousUrl$.subscribe( (previousUrl: string) => {
      this.previousUrl = previousUrl;
    });
    this.filesId = [];
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
          this.currentEquipment = new Equipment(eq.id, eq.name, eq.equipment_type, eq.files, eq.field);
          this.name = this.currentEquipment.name;
          this.equipment_type = this.currentEquipment.equipment_type;
          this.getEquipmentTypeName(this.currentEquipment.equipment_type.id);
          this.fields = this.currentEquipment.fields;
          this.files = this.currentEquipment.files;
          this.currentEquipment.files.forEach(element => {
            this.filesId.push(element.id);
          });
          this.loaded = true;
          this.initForm();
          for (i; i < this.filesId.length; i++) {
            this.fileService.getFile(this.filesId[i]).subscribe(df => {
              this.myFilesPath.push(String(df.file).slice(6));
            });
          }
          this.myFilesPath.splice(6);
        },
        (error) => this.router.navigate(['/four-oh-four']));
    this.initAddFieldTemplate();
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
      this.equipmentService.updateEquipmentName(this.currentEquipment.name, this.currentEquipment.id).subscribe(equipmentNameUpdated => {
          this.updateError = false;
          this.ngOnInit();
          this.initForm();
          this.equipmentService.getEquipments();
        },
        (error) => {
          this.updateError = true;
        });
    } else {
      if (this.filesAdded || this.filesDeleted) {
        this.currentEquipment.files = this.filesId;
        this.equipmentService.updateEquipmentFile(this.currentEquipment.files, this.currentEquipment.id).subscribe(filesUpdated => {
          this.updateError = false;
          this.ngOnInit();
          this.initForm();
          this.equipmentService.getEquipments();
          this.filesAdded = false;
          this.filesDeleted = false;
        },
          (error) => {
            this.updateError = true;
          });
      } else {
        this.currentEquipment.files = this.filesId;
        this.newEquipmentTypeId = this.currentEquipment.equipment_type.id;
        if (this.equipmentTypeModified) {
          this.currentEquipment.equipment_type = this.equipmentType.id;
          this.newEquipmentTypeId = this.currentEquipment.equipment_type;
          this.getEquipmentTypeName(this.currentEquipment.equipment_type);
        } else {
          this.currentEquipment.equipment_type = this.currentEquipment.equipment_type.id;
        }

        if (this.modifyFields) {
          this.currentEquipment.fields = this.fields;
          this.modifyFields = false;
          if (this.new_fields.length !== 0) {
            this.new_fields.forEach(element => {
              this.currentEquipment.fields.push(element);
            });
          }
          if (this.equipmentTypeModified) {
            this.currentEquipment.fields = this.initialFields;
            this.equipmentTypeModified = false;
          }
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

        if (!(this.updateError)) {
          this.fields = this.currentEquipment.fields;
          this.equipmentTypeService.getEquipmentType(this.newEquipmentTypeId)
            .subscribe(
              (response) => {
                this.currentEquipment.equipment_type = response;
              }
            );
      }
      }
    }
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
  openModifyName(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-modify'}).result.then((result) => {
      if (result === 'OK') {
        this.onModifyEquipment();
      }
    });
  }

  /**
   * Fonction that allows to modify the fields
   */
  openModifyField() {
    this.new_fields = [];
    this.modifyFields = true;
    this.equipmentTypes = this.equipmentTypeService.getEquipmentTypes();
    if (this.equipmentTypes.length === 0) {
      this.equipmentTypesSubscription = this.equipmentTypeService.equipment_types_subject.subscribe(
        (equipmentTypes: EquipmentType[]) => {
          this.equipmentTypes = equipmentTypes;
        });
    }
    this.equipmentTypeService.getEquipmentType(this.currentEquipment.equipment_type.id)
      .subscribe(
        (response) => {
          this.currentEquipmentTypeFields = response.field;
          this.isCurrentEquipmentTypeField();
        }
      );
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
        formData.append('is_manual', 'false');
        this.fileService.uploadFile(formData).subscribe(file => {
          this.filesId.push(Number(file.id));
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
    const id = this.filesId.splice(index, 1);
    this.fileService.deleteFile(id[0]);
    this.ngOnInit();
  }

  /**
   * Function that is triggered when a file is removed from the files uploaded(when button "Minus" is pressed)
   * @param filePath path of the file that need to be removed
   */
  onRemoveFilePath(filePath: string) {
    const index1: number = this.myFilesPath.indexOf(filePath);
    const fileId: number = this.filesId[index1];
    const index2: number = this.filesId.indexOf(fileId);
    if (index2 !== -1) {
      this.filesId.splice(index2, 1);
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
        this.filesDeleted = true;
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
        this.filesAdded = true;
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

  /**
   * Function to initialize the fields of the selected equipment type
   * @param event The EquipmentType selected
   */
  initEquipmentTypeFields(event) {
    this.new_fields = [];
    this.equipmentTypeModified = (this.currentEquipment.equipment_type.id !== Number(event));
    if (this.equipmentTypeModified) {
      this.equipmentTypeService.getEquipmentType(Number(event))
        .subscribe(
          (response) => {
            this.equipmentType = response;
            this.equipmentTypeFields = response.field;
            response.field.forEach(field => {
              this.initialFields.push({field: field.id, name: field.name, value: '', description: ''});
            });
          }
        );
    }
  }

  /**
   * Fonction to modify the value of the field that correspond to the selected equipment type
   * @param event the value of the field
   * @param index the index of the modified field
   */
  modifyEquipmentTypeFieldValue(event, index) {
    const field = this.fields[index].field;
    this.fields.forEach(element => {
      if (element.field === field) {
        if (event.id === 'fieldValueText') {
          element.value = event.value;
        } else {
          if (event.id === 'fieldValueSelect') {
            element.field_value.value = event.value;
          }
        }
      }
    });
  }

  /**
   * Function to see if fields are empty or no
   */
  fieldsIsEmpty() {
    return this.fields.length === 0;
  }

  /**
   * Function to get the different possible values of the values of a field related to an equipment type
   * @param id the id of the equipment type
   */
  getFieldsEquipmentTypes(id: number) {
    this.currentEquipmentTypeFields.forEach(element => {
      if (element.id === id) {
        this.currentSelectFields = element.value;
      }
    });
  }

  /**
   * Function to add a field in the form
   */
  addField() {
    const jsonCopy = JSON.stringify(this.fieldTemplate);
    const objectCopy = JSON.parse(jsonCopy);
    this.new_fields.push(objectCopy);
  }

  /**
   * Function to initialize the template for field objects.
   */
  initAddFieldTemplate() {
    this.fieldTemplate = {
      name: '',
      value: '',
      description: ''
    };
  }

  /**
   * Function to verify if the values of the fields of the equipment type are not missing
   */
  missingEquipmentTypeFieldsValue() {
    let missing_value = false;
    if (this.equipmentTypeModified) {
      if ((this.equipmentTypeFields.length === this.initialFields.length)) {
        if ((this.equipmentTypeFields.length !== 0)) {
          this.initialFields.forEach(element => {
            if ((element.value === '')) {
              missing_value = true;
            }
          });
        }
      } else {
        missing_value = true;
      }
    } else {
      this.fields.forEach(element => {
        if ((element.value.length === 0) && !(element.field_value)) {
          missing_value = true;
        }
      });
    }
    if (this.new_fields.length !== 0) {
      this.new_fields.forEach(element => {
        if ((element.name === '') || (element.value.length === 0)) {
          missing_value = true;
        }
      });
    }
    return missing_value;
  }

  /**
   * Function to delete a new field in the form
   * @param i the index of the field
   */
  deleteField(i: number) {
    this.new_fields.splice(i, 1);
  }

  /**
   * Function to delete a current field of the Equipment
   * @param field the field
   * @param i the index of the field
   */
  deleteCurrentField(field, i: number) {
    this.fields.splice(i, 1);
    this.equipmentService.deleteFieldEquipment(this.currentEquipment.id, field.id).subscribe(
        (resp) => {
          console.log('resp', resp);
        }
    );
  }

  /**
   * Function to know if a current field is related to the equipment type
   */
  isCurrentEquipmentTypeField() {
    let isCurrentEquipmentTypeField = false;
    this.fields.forEach(field => {
      this.currentEquipmentTypeFields.forEach(element => {
        if (element.id === field.field) {
          isCurrentEquipmentTypeField = true;
        }
      });
      this.isCurrentEquipmentTypeFields.push({id: field.field, isEquipmentTypeField: isCurrentEquipmentTypeField});
      isCurrentEquipmentTypeField = false;
    });
  }

  /**
   * Function to know if a field can be delete
   * @param field the field
   */
  canDeleteField(field) {
    let canDelete = false;
    this.isCurrentEquipmentTypeFields.forEach(element => {
      if (element.id === field.field) {
        canDelete = !(element.isEquipmentTypeField);
      }
    });
    return canDelete;
  }

  /**
   * Function to save the modification of the values of the fields
   */
  saveFields() {
    if (this.equipmentTypeModified) {
      this.new_fields.forEach(element => {
        this.initialFields.push(element);
      });
    }
    this.onModifyEquipment();
  }

  /**
   * Function to check if a field line is completed.
   * @param field the field to check
   */
  canValidateLine(field) {
    let filled = true;
    if (!this.fieldIsFill(field)) {
      filled = false;
    }
    return filled;
  }

  /**
   * Function to check if a field is completed
   * @param field the field to check
   */
  fieldIsFill(field) {
    return (field.name !== this.INIT_FIELD_NAME && field.value !== this.INIT_FIELD_VALUE);
  }

  /**
   * Function to return to the listing page.
   */
  onPreviousPage() {
    this.router.navigate([this.previousUrl]);
  }

  /**
   * Function that get the size of the file the user want to upload.
   * @param content the modal to open
   */
  getFileInfo(content) {
    if (content.target.files[0].type === 'image/png'
        || content.target.files[0].type === 'image/jpeg'
        || content.target.files[0].type === 'application/pdf') {
          this.fileTypeCheck = true;
    } else {
      this.fileTypeCheck = false;
    }
    if (content.target.files[0].size / 1000000 <= 10) {
    this.fileCheck = true;
    } else {
      this.fileCheck = false;
    }
  }
  /**
   * Provide a boolean which allow us to know if the size of the file is correct.
   */
  isSizeFileOk(): boolean {
    return this.fileCheck;
  }
  /**
   * Provide a boolean which allow us to know if the type of the file is correct.
   */
  isTypeFileOk(): boolean {
    return this.fileTypeCheck;
  }
  /**
   * Function that is triggered to load the modal template for team addition
   * @param content the modal to open
   */
}
