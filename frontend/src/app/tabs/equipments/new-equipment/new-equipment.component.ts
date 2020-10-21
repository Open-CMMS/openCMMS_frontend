import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {FileService} from 'src/app/services/files/file.service';
import {Equipment} from 'src/app/models/equipment';
import {EquipmentService} from 'src/app/services/equipments/equipment.service';
import {Subscription, Subject} from 'rxjs';
import {EquipmentType} from 'src/app/models/equipment-type';
import {EquipmentTypeService} from 'src/app/services/equipment-types/equipment-type.service';
import {faMinusSquare, faPlusSquare, faMinusCircle, faPencilAlt, faSave} from '@fortawesome/free-solid-svg-icons';
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
  faPencilAlt = faPencilAlt;
  faSave = faSave;

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
  openField = false;
  addField = true;
  editingFieldValid = true;

  // Fields
  field = null;
  fields = [];
  initialFields = [];
  editingField = [];
  fieldTemplate = null;

  // Forms
  createForm: FormGroup;
  addFieldForm: FormGroup;

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
  }

  /**
   * Function that initialize the different forms used in the component
   */
  initForm() {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      equipmentType: ['', Validators.required],
      file: ['']
    });
    this.addFieldForm = this.formBuilder.group({
      name: [this.INIT_FIELD_NAME, [Validators.required, Validators.minLength(3)]],
      value: [this.INIT_FIELD_VALUE, [Validators.required]],
      description: [this.INIT_FIELD_DESCRIPTION]
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
      });
    this.router.navigate(['/equipments']);
    this.equipmentService.getEquipments();
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
   * Function that set openField to true and addField to false
   */
  onOpenField() {
    this.openField = true;
    this.addField = false;
  }

  /**
   * Function that set openField to false and addField to true
   */
  onCloseField() {
    this.openField = false;
    this.addField = true;
  }

  /**
   * Function to add a field with a name, a value and optionally a description
   */
  onAddField() {
    const formValues = this.addFieldForm.value;
    const field = {
      name: formValues.name,
      value: formValues.value,
      description: formValues.description
    };
    const jsonCopy = JSON.stringify(field);
    const objectCopy = JSON.parse(jsonCopy);
    this.fields.push(objectCopy);
    this.editingField.push(false);
    this.addFieldForm.controls.name.setValue(this.INIT_FIELD_NAME);
    this.addFieldForm.controls.value.setValue(this.INIT_FIELD_VALUE);
    this.addFieldForm.controls.description.setValue(this.INIT_FIELD_DESCRIPTION);
    this.openField = false;
    this.addField = true;
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
   * Function to initialize the fields of the selected equipment type
   * @param event The EquipmentType selected
   */
  initEquipmentTypeFields(event) {
    this.equipmentTypeService.getEquipmentType(Number(event))
      .subscribe(
        (response) => {
          this.equipmentType = response;
          this.equipmentTypeFields = response.field;
        }
      );
  }

  /**
   * Fonction to modify the value of the field that correspond to the selected equipment type
   * @param event the value of the field
   * @param index the index of the modified field
   */
  modifyEquipmentTypeFieldValue(event, index) {
    const field = this.equipmentTypeFields[index].id;
    const name = this.equipmentTypeFields[index].name;
    const value = ((event.id === 'field-value-text') || (event.id === 'field-value-select')) ? event.value : '';
    const description = (event.id === 'field-description') ? event.value : '';
    let alreadyInInitialFields = false;
    this.initialFields.forEach(element => {
      if (element.field === field) {
        alreadyInInitialFields = true;
        if ((event.id === 'field-value-text') || (event.id === 'field-value-select')) {
          element.value = event.value;
        } else {
          element.description = event.value;
        }
      }
    });
    if (!(alreadyInInitialFields)) {
      const jsonCopy = JSON.stringify({field, name, value, description});
      const objectCopy = JSON.parse(jsonCopy);
      this.initialFields.splice(index, 1, objectCopy);
    }
  }

  /**
   * Function to verify if the values of the fields of the equipment type are not missing
   */
  missingEquipmentTypeFieldsValue() {
    let missing_value = false;
    if ((this.equipmentTypeFields.length === this.initialFields.length)) {
      if ((this.equipmentTypeFields.length !== 0)) {
        this.initialFields.forEach(element => {
          if (!(element.value)) {
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
   * Function to delete a field in the form
   * @param i the index of the field
   */
  deleteField(i: number) {
    this.fields.splice(i, 1);
  }

  ngOnDestroy() {
    this.filesSubscription.unsubscribe();
    this.equipmentTypesSubscription.unsubscribe();
  }

  /**
   * Function to know if we are editing a specific field.
   * @param field the field
   */
  isEditingField(field) {
    const indexOf = this.fields.indexOf(field);
    return this.editingField[indexOf];
  }

  /**
   * Function to verify if the name and the value of the edited field are not empty.
   * @param field the field
   */
  isEditingFieldValid(field) {
    this.editingFieldValid = (field.name.length === 0 || field.value.length === 0);
    return this.editingFieldValid;
  }

  /**
   * Function to edit a specific field in the list of field
   * @param field the field
   */
  onEditField(field) {
    const indexOf = this.fields.indexOf(field);
    this.editingField[indexOf] = !this.editingField[indexOf];
  }

  /**
   * Function to verify if the form can be validate, in particular if one field is being editing
   */
  canValidateForm() {
    let canValidateForm = true;
    this.editingField.forEach(element => {
      if (element) {
        canValidateForm = false;
      }
    });
    return canValidateForm;
  }

  /**
   * Function call on submit addFieldForm form.
   */
  onSubmitField() {
    if (this.addFieldForm.invalid) {
      return;
    }
  }

  /**
   * Function to know if a object is empty
   * @param obj the object
   */
  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

}
