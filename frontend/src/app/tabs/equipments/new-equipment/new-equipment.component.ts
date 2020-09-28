import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services/files/file.service';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Subscription, Subject } from 'rxjs';
import { EquipmentType } from 'src/app/models/equipment-type';
import { EquipmentTypeService } from 'src/app/services/equipment-types/equipment-type.service';
import { faMinusSquare } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'app-new-equipment',
  templateUrl: './new-equipment.component.html',
  styleUrls: ['./new-equipment.component.scss']
})
export class NewEquipmentComponent implements OnInit, OnDestroy {
  // Icon
  faMinusSquare = faMinusSquare;
  // Local variables
  creationError = false;
  submitted = false;
  equipment: Equipment;
  equipmentTypes: EquipmentType[];
  equipmentTypesSubscription: Subscription;
  filesSubject = new Subject<File[]>();
  filesSubscription: Subscription;
  myFiles: File[] = [];
  files: number[] = [];
  // Forms
  createForm: FormGroup;

  /**
   * Constructor for the NewEquipmentComponent
   * @param router the service used to handle redirections
   * @param equipmentService the service to handle equipment
   * @param equipmentTypeService the service to handle equipment type
   * @param fileService the service to handle file
   * @param formBuilder the service to handle forms
   */
  constructor(private router: Router,
              private equipmentService: EquipmentService,
              private equipmentTypeService: EquipmentTypeService,
              private fileService: FileService,
              private formBuilder: FormBuilder
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
  }

  /**
   * Function that initialize the fields in the form to create a new Team
   */
  initForm() {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
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

    const formValues = this.createForm.value;
    this.equipmentService.createEquipment(formValues.name, formValues.equipmentType, this.files)
      .subscribe((equipment: Equipment) => {
                this.equipment = new Equipment(equipment.id,
                                              equipment.name,
                                              equipment.equipment_type,
                                              equipment.files,
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

  ngOnDestroy() {
    this.filesSubscription.unsubscribe();
    this.equipmentTypesSubscription.unsubscribe();
  }


}
