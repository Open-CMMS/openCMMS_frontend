import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services/files/file.service';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Subscription, of } from 'rxjs';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-new-equipment',
  templateUrl: './new-equipment.component.html',
  styleUrls: ['./new-equipment.component.scss']
})
export class NewEquipmentComponent implements OnInit {

  // Local variables
  creationError = false;
  submitted = false;
  equipment: Equipment;
  equipmentTypes: EquipmentType[];
  equipmentTypesSubscription: Subscription;
  myFiles: string[] = [];
  files: number[] = [];
  // Forms
  createForm: FormGroup;

  /**
   * Constructor for the NewEquipmentComponent
   * @param router the service used to handle redirections
   * @param userService the service to communicate with backend on UserProfile objects
   * @param formBuilder the service to handle forms
   */
  constructor(private router: Router,
              private equipmentService: EquipmentService,
              private equipmentTypeService: EquipmentTpeService,
              private fileService: FileService,
              private formBuilder: FormBuilder
              ) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
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
   * Function that is triggered when a new User is being created (when button "Create new Equipment" is pressed)
   */
  onCreateEquipment() {
    this.submitted = true;

    if (this.createForm.invalid) {
      return;
    }

    let j = 0;
    const formData = new FormData();
    if (this.myFiles.length > 0) {
      for (j; j < this.myFiles.length; j++) {
        formData.append('file"', this.myFiles[j]);
        formData.append('is_manual', 'true' );
        this.fileService.uploadFile(formData).subscribe((file: FormData) => {
          this.files.push(Number(file.get('id')));
        });
      }
    }
    const formValues = this.createForm.value;
    this.equipmentService.createEquipment(formValues.name, formValues.equipmentType, this.files)
    .subscribe((equipment: Equipment) => {
              this.equipment = new Equipment(equipment.id,
                                             equipment.name,
                                             equipment.equipment_type,
                                             equipment.files,
                                            );
              this.equipmentService.getEquipments();
        });
    this.router.navigate(['/equipments']);
    }

    onFileChange(event) {
      let i = 0;
      for (i; i < event.target.files.length; i++) {
          this.myFiles.push(event.target.files[i]);
      }
      console.log(this.myFiles);
    }

}
