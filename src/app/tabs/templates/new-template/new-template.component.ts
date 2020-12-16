import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { faCalendar, faInfoCircle, faMinusCircle, faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subject, Subscription } from 'rxjs';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentType } from 'src/app/models/equipment-type';
import { Team } from 'src/app/models/team';
import { Template } from 'src/app/models/template';
import { EquipmentTypeService } from 'src/app/services/equipment-types/equipment-type.service';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { FileService } from 'src/app/services/files/file.service';
import { TaskService } from 'src/app/services/tasks/task.service';
import { TeamService } from 'src/app/services/teams/team.service';
import { TemplateService } from 'src/app/services/templates/template.service';

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.component.html',
  styleUrls: ['./new-template.component.scss']
})
export class NewTemplateComponent implements OnInit, OnDestroy {

  // Local variables
  equipments: Equipment[];
  equipmentTypes: EquipmentType[];
  equipmentTypesWithEquipments = [];
  teams: Team[];

  teamSubscription: Subscription;
  equipmentSubscription: Subscription;
  equipmentTypeSubscription: Subscription;
  creationError = false;

  faInfoCircle = faInfoCircle;
  faPlusSquare = faPlusSquare;
  faMinusCircle = faMinusCircle;
  faMinusSquare = faMinusSquare;
  faCalendar = faCalendar;
  model: NgbDateStruct;

  // Multiple Select
  teamsList = [];
  equipmentList = [];
  equipmentTypesList = [];
  endConditionsList = [];
  selectedEndConditions = [];
  dropdownTeamsSettings: IDropdownSettings;
  dropdownEquipmentsSettings: IDropdownSettings;
  dropdownEquipmentTypesSettings: IDropdownSettings;
  dropdownEndConditionsSettings: IDropdownSettings;

  // End Conditions
  endConditions = [];
  endConditionSelectTemplate = null;

  // Files
  filesSubject = new Subject<File[]>();
  filesSubscription: Subscription;
  myFiles: File[] = [];
  files: number[] = [];
  fileCheck: boolean;
  fileTypeCheck: boolean;

  // Forms
  createForm: FormGroup;

  creationLoader = false;
  fileUploadLoader = false;


  /**
   * Constructor for the NewTeamComponent
   * @param router the service used to handle redirections
   * @param templateService the service to communicate with backend on Template objects
   * @param teamService the service to communicate with backend on Team objects
   * @param taskService the service to communicate with backend on Task objects
   * @param equipmentService the service to communicate with backend on Equipment
   * @param equipmentTypeService the service to communicate with backend on EquipmentTYpe objects
   * @param fileService the service to communicate with backend on File
   * @param formBuilder the service to handle forms
   */
  constructor(private router: Router,
              private templateService: TemplateService,
              private taskService: TaskService,
              private teamService: TeamService,
              private equipmentService: EquipmentService,
              private equipmentTypeService: EquipmentTypeService,
              private fileService: FileService,
              private formBuilder: FormBuilder
              ) { }
  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.fileTypeCheck = true;
    this.fileCheck = true;
    this.equipmentTypeService.getEquipmentTypes();
    this.teamSubscription = this.teamService.teamSubject.subscribe(
      (teams: Team[]) => {
        this.teams = teams;
        this.initTeamsSelect();
      }
    );
    this.teamService.emitTeams();
    this.equipmentSubscription = this.equipmentService.equipmentsSubject.subscribe(
      (equipments: Equipment[]) => {
        this.equipments = equipments;
      }
    );
    this.equipmentTypeSubscription = this.equipmentTypeService.equipment_types_subject.subscribe(
      (equipmentTypes: EquipmentType[]) => {
        this.equipmentTypes = equipmentTypes;
        this.initEquipmentTypesSelect();
        this.initEquipmentSelect();
      }
    );
    this.filesSubscription = this.filesSubject.subscribe(
      (files: File[]) => {
        this.myFiles = files;
      }
    );

    this.initEndConditionsSelect();
    this.equipmentService.emitEquipments();
    this.initForm();
  }

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
   * Function to add an end condition in the form
   */
  addEndCondition() {
    const jsonCopy = JSON.stringify(this.endConditionSelectTemplate);
    const objectCopy = JSON.parse(jsonCopy);
    this.endConditions.push(objectCopy);
  }

  /**
   * Function to delete an end condition in the form
   * @param i the index of the end condition
   */
  deleteEndCondition(i: number) {
    this.endConditions.splice(i, 1);
  }

  /**
   * Function to initialize the template for end condition objects. It is used to initialize
   * the dropdown selects as well
   * @param end_conditions_types the array with the different types of end conditions
   */
  initEndConditionSelectTemplate(end_conditions_types: any[]) {
    this.endConditionSelectTemplate = {
        selectedEndCondition: [],
        endConditionsList: end_conditions_types,
        dropdownEndConditionsSettings: {
          singleSelection: true,
          idField: 'id',
          textField: 'value',
          allowSearchFilter: true
        },
        description: null
      };
  }

  /**
   * Function to get the different types of end conditions
   */
  getEndConditionsTypes() {
    const end_conditions_types = [];
    this.templateService.getConditionsTypes().subscribe(
      (conditions) => {
        for (const end_condition of conditions.end_conditions) {
          end_conditions_types.push({id: end_condition.id, value: end_condition.name});
        }
        this.initEndConditionSelectTemplate(end_conditions_types);
      }
    );
  }

  /**
   * Function to initialize the end conditions part of the form
   */
  initEndConditionsSelect() {
    this.getEndConditionsTypes();
  }

  /**
   * Function that initialize the multiselect for Teams
   */
  initTeamsSelect() {
    this.teamsList = [];
    for (const team of this.teams) {
      this.teamsList.push({id: team.id.toString(), value: team.name});
    }
    this.dropdownTeamsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'value',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
  }

  initEquipmentSelect() {
    this.equipmentTypes.forEach(element => {
      this.equipmentTypeService.getEquipmentType(element.id)
        .subscribe(
          (response) => {
            const equipments = [];
            response.equipments.forEach(equipment => {
              equipments.push({id: equipment.id, value: equipment.name});
            });
            this.equipmentTypesWithEquipments.push({id: element.id, value: equipments});
          }
        );
    });
  }

  /**
   * Function that initialize the select for the equipment
   */
  updateEquipmentsSelect(equipmentTypeId: number) {
    this.equipmentList = [];
    let equipmentTypeFound = false;
    this.equipmentTypesWithEquipments.forEach(element => {
      if (element.id === Number(equipmentTypeId) && !equipmentTypeFound) {
        element.value.forEach(equipment => {
          this.equipmentList.push(equipment);
        });
        equipmentTypeFound = true;
      }
    });
  }

  /**
   * Function that initialize the select for the equipment types
   */
  initEquipmentTypesSelect() {
    this.equipmentTypesList = [];
    for (const equipmentType of this.equipmentTypes) {
      this.equipmentTypesList.push({id: equipmentType.id.toString(), value: equipmentType.name});
    }
  }

  /**
   * Function that is triggered when a or multiple files are chosen(when button "Browse" is pressed and files are chosen)
   * Upload files if not already uploaded.
   * @param event file selection event from input of type file
   */
  onFileUpload(event) {
    this.fileUploadLoader = true;
    let formData: FormData;
    let i = 0;
    for (i; i < event.target.files.length; i++) {
      if (this.fileTypeCheck && this. fileCheck && !this.myFiles.includes(event.target.files[i])) {
        this.myFiles.push(event.target.files[i]);
        formData = new FormData();
        formData.append('file', event.target.files[i], event.target.files[i].name);
        formData.append('is_manual', 'true' );
        this.fileService.uploadFile(formData).subscribe(file => {
          this.fileUploadLoader = false;
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
    this.fileService.deleteFile(id[0]).subscribe();
  }

  /**
   * Function that initialize the fields in the form to create a new Team
   */
  initForm() {
    const regex_time = new RegExp('^((([0-9]+)d)?\\s*(([0-9]+)h)?\\s*(([0-9]+)m)?)$');
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhiteSpaceValidator]],
      description: [''],
      time: ['', Validators.pattern(regex_time)],
      equipment: [''],
      equipmentType: [''],
      teams: [''],
      file: ['']
    });
  }

  /**
   * Function that is triggered when a new Task is being created (when button "Create new task" is pressed)
   */
  onCreateTemplate() {

    const formValues = this.createForm.value;

    const teams = [];
    if (formValues.teams) {
      formValues.teams.forEach(item => {
        teams.push(item.id);
      });
    }
    const end_conditions: any[] = [];

    for (const endCondition of this.endConditions) {
      end_conditions.push(
        {
          field: endCondition.selectedEndCondition[0].id,
          name: endCondition.selectedEndCondition[0].value,
          description: endCondition.description,
          value: ''
        });
    }

    const equipment = formValues.equipment !== '' ? formValues.equipment : null;

    const end_date = formValues.end_date ? this.taskService.normaliseEndDateValue(formValues.end_date) : null;

    const time = formValues.time ? this.taskService.normaliseDurationValue(formValues.time, ['d', 'h', 'm']) : '';

    const equipment_type = formValues.equipmentType !== '' ? formValues.equipmentType : null;
    const files = this.files;

    const newTemplate = new Template(1,
                            formValues.name,
                            formValues.description,
                            end_date,
                            time,
                            equipment,
                            equipment_type,
                            teams,
                            files,
                            end_conditions);

    this.templateService.createTemplate(newTemplate).subscribe(
      (template: Template) => {
        this.router.navigate(['/template-management']);
        this.templateService.getTemplates();
        this.creationLoader = false;
      },
      (error) => {
        this.creationError = true;
        this.creationLoader = false;
      }
    );
  }

  /**
   * Function that clears subscriptions
   */
  ngOnDestroy(): void {
    this.filesSubscription.unsubscribe();
    this.teamSubscription.unsubscribe();
    this.equipmentSubscription.unsubscribe();
  }

  public noWhiteSpaceValidator(control: FormControl) {
    const isWhiteSpace = (control.value || '').trim().length === 0;
    const isValid = !isWhiteSpace;
    return isValid ? null : {whitespace: true};
  }

}
