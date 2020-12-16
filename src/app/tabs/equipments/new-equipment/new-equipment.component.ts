import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {FileService} from 'src/app/services/files/file.service';
import {Equipment} from 'src/app/models/equipment';
import {EquipmentService} from 'src/app/services/equipments/equipment.service';
import {Subscription, Subject} from 'rxjs';
import {EquipmentType} from 'src/app/models/equipment-type';
import {EquipmentTypeService} from 'src/app/services/equipment-types/equipment-type.service';
import {faMinusSquare, faPlusSquare, faMinusCircle, faPencilAlt, faPlusCircle, faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import {Field} from 'src/app/models/field';


@Component({
  selector: 'app-new-equipment',
  templateUrl: './new-equipment.component.html',
  styleUrls: ['./new-equipment.component.scss']
})
export class NewEquipmentComponent implements OnInit, OnDestroy {
  // Icon
  faMinusSquare = faMinusSquare;
  faPlusSquare = faPlusSquare;
  faMinusCircle = faMinusCircle;
  faPlusCircle = faPlusCircle;
  faPencilAlt = faPencilAlt;
  faCheck = faCheck;
  faTimes = faTimes;

  // Local variables
  submitted = false;
  equipment: Equipment;
  equipmentTypes: EquipmentType[];
  equipmentTypesRequirement = [];
  equipmentTypeFields: Field[] = [];
  equipmentFields: Field[] = [];
  equipmentType: EquipmentType;
  equipmentTypesSubscription: Subscription;
  filesSubject = new Subject<File[]>();
  filesSubscription: Subscription;
  myFiles: File[] = [];
  files: number[] = [];
  fileTypeCheck: boolean;
  fileCheck: boolean;

  // Fields

  initialFields = [];
  fields = [];
  fieldTemplate = null;

  // Forms
  createForm: FormGroup;

  // Constants
  INIT_FIELD_NAME  = '';
  INIT_FIELD_VALUE = '';
  INIT_FIELD_DESCRIPTION = '';


  /**
   * Constructor for the NewEquipmentComponent
   * @param router the service used to handle redirections
   * @param equipmentService the service to handle equipment
   * @param equipmentTypeService the service to handle equipment type
   * @param fileService the service to handle file
   * @param formBuilder the service to handle forms
   * @param httpClient the
   * @param modalService the service used to handle modal windows
   */
  constructor(private router: Router,
              private equipmentService: EquipmentService,
              private equipmentTypeService: EquipmentTypeService,
              private fileService: FileService,
              private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private modalService: NgbModal
  ) {
  }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.filesSubscription = this.filesSubject.subscribe(
      (files: File[]) => {
        this.myFiles = files;
      }
    );
    this.equipmentTypesSubscription = this.equipmentTypeService.equipment_types_subject.subscribe(
      (equipmentTypes: EquipmentType[]) => {
        this.equipmentTypes = equipmentTypes;
      });
    this.equipmentTypeService.emitEquipmentTypes();
    this.equipmentService.emitEquipments();
    this.initForm();
    this.initAddFieldTemplate();
    this.fileTypeCheck = true;
    this.fileCheck = true;
  }

  /**
   * Function that initialize the different forms used in the component
   */
  initForm() {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhiteSpaceValidator]],
      equipmentType: ['', Validators.required],
      file: ['']
    });
  }

  /**
   * Function that is triggered when a new Equipment is being created (when button "Create new Equipment" is pressed)
   * creates a new Equipment with the data entered in the form.
   */
  onCreateEquipment() {
    if (this.createForm.invalid) {
      return;
    }
    this.submitted = true;
    if (this.fields.length !== 0) {
      this.fields.forEach(element => {
        this.initialFields.push(element);
      });
    }
    const formValues = this.createForm.value;
    this.equipmentService.createEquipment(formValues.name, formValues.equipmentType, this.files, this.initialFields)
      .subscribe((equipment: Equipment) => {
        this.equipment = new Equipment(equipment.id,
          equipment.name,
          equipment.equipment_type,
          equipment.files,
          equipment.fields,
        );
        this.equipmentService.getEquipments();
      });
    this.router.navigate(['/equipments']);
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
      if (!this.myFiles.includes(event.target.files[i]) && this.isSizeFileOk() && this.isTypeFileOk()) {
        this.myFiles.push(event.target.files[i]);
        formData = new FormData();
        formData.append('file', event.target.files[i], event.target.files[i].name);
        formData.append('is_manual', 'false');
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
  }

  /**
   * Function to add a field to the field list: fields
   */
  onAddField() {
    const jsonCopy = JSON.stringify(this.fieldTemplate);
    const objectCopy = JSON.parse(jsonCopy);
    this.fields.push(objectCopy);
  }

  /**
   * Function to initialize the template for field objects.
   */
  initAddFieldTemplate() {
    this.fieldTemplate = {
      name: this.INIT_FIELD_NAME,
      value: this.INIT_FIELD_VALUE,
      description: this.INIT_FIELD_DESCRIPTION
    };
  }

  /**
   * Function to initialize the fields of the selected equipment type
   * @param event The EquipmentType selected
   */
  initEquipmentTypeFields(event) {
    this.initialFields = [];
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

  /**
   * Function to verify if the values of the fields of the equipment type are not missing
   */
  missingEquipmentTypeFieldsValue() {
    let missing_value = false;
    if ((this.equipmentTypeFields.length === this.initialFields.length)) {
      if ((this.equipmentTypeFields.length !== 0)) {
        this.initialFields.forEach(element => {
          if (element.value === '') {
            missing_value = true;
          }
        });
      }
    } else {
      missing_value = true;
    }
    return missing_value;
  }

  /**
   * Function to delete a field.
   * @param i the position of the field to delete.
   */
  deleteField(i: number) {
    this.fields.splice(i, 1);
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.filesSubscription.unsubscribe();
    this.equipmentTypesSubscription.unsubscribe();
  }

  /**
   * Function to check if all the fields are completed.
   */
  canValidateForm() {
    let canValidateForm = true;
    this.fields.forEach(field => {
      if (!this.fieldIsFill(field)) {
        canValidateForm = false;
      }
    });
    return canValidateForm;
  }

  public noWhiteSpaceValidator(control: FormControl) {
    const isWhiteSpace = (control.value || '').trim().length === 0;
    const isValid = !isWhiteSpace;
    return isValid ? null : {whitespace: true};
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
 * Function that initialize the fields in the form to create a new Team
 */

}
