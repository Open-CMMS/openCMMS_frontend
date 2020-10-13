import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services/files/file.service';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Subscription, Subject } from 'rxjs';
import { EquipmentType } from 'src/app/models/equipment-type';
import { EquipmentTypeService } from 'src/app/services/equipment-types/equipment-type.service';
import { faMinusSquare, faPlusSquare, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
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
  // Fields
  field = null;
  fields = [];
  initialFields = [];
  fieldTemplate = null;
  // Forms
  createForm: FormGroup;
  addFieldForm: FormGroup;

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
              ) { }

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
      name: ['', [Validators.required, Validators.minLength(3)]],
      value: ['', [Validators.required]],
      description: ['']
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
    this.fields.forEach(element => {
      console.log(this.initialFields);
      this.initialFields.push(element);
      console.log(this.initialFields);
    });
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
  }

  /**
   * Function to add a field in the form
   */
  addField() {
    const jsonCopy = JSON.stringify(this.fieldTemplate);
    const objectCopy = JSON.parse(jsonCopy);
    this.fields.push(objectCopy);
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

  modifyEquipmentTypeFieldValue(event, index) {
    const field = this.equipmentTypeFields[index].id;
    const name = this.equipmentTypeFields[index].name;
    const value = event;
    const jsonCopy = JSON.stringify({field, name, value});
    const objectCopy = JSON.parse(jsonCopy);
    console.log(objectCopy);
    this.initialFields.splice(index, 1, objectCopy);
    console.log('initialFields', this.initialFields);
  }

  /**
   * Function to verify if the values of the fields of the equipment type are not missing
   */
  missingEquipmentTypeFieldsValue() {
    let missing_value = false;
    if (this.initialFields.length !== 0) {
      if ((this.equipmentTypeFields.length === this.initialFields.length)) {
        this.initialFields.forEach(element => {
          if (!(element.value)) {
            missing_value = true;
          }
        });
      } else {
        missing_value = true;
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


}
