import { Component, OnInit } from '@angular/core';
import { faTrash, faPen, faSave, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Field } from 'src/app/models/field';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DataProviderService } from '../../../services/data-provider/data-provider.service';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { DataProvider } from 'src/app/models/data-provider';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import {Equipment} from '../../../models/equipment';

@Component({
  selector: 'app-data-provider-details',
  templateUrl: './data-provider-details.component.html',
  styleUrls: ['./data-provider-details.component.scss']
})
export class DataProviderDetailsComponent implements OnInit {

  // Icons
  faInfoCircle = faInfoCircle;
  faTrash = faTrash;
  faPen = faPen;
  faSave = faSave;
  durationDays = 0;
  durationTime: { hour: number; minute: number; };
  localDataProvider: DataProvider = null;

  fileNames: string[];
  equipments: Equipment[];

  //
  loaded = false;

  // Recurrence
  recurrenceRegex: string;
  inputEnabled = {
    name: false,
    file_name: false,
    recurrence: false,
    ip_address: false,
    equipment: false,
    field: false
  };
  fields: Field[];
  /**
   * Constructor of dataProviderDetailsComponent
   * @param dataProviderService the service used to handle dataProviders
   * @param route the service used to handle route parameters
   * @param equipmentService the service used to handle equipments
   * @param router the service used to handle routing
   * @param formBuilder the service used to handle forms
   */
  constructor(
    private equipmentService: EquipmentService,
    private dataProviderService: DataProviderService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private authenticationService: AuthenticationService
    ) { }

  ngOnInit(): void {
    let id: number;
    this.route.params.subscribe(params => {
      id = +params.id;
    });
    this.dataProviderService.getDataProvider(id)
      .subscribe((response) => {
        console.log('--RESPONSE--');
        console.log(response);
        this.localDataProvider = new DataProvider(response.id,
          response.name,
          response.file_name,
          response.recurrence,
          response.is_activated,
          response.equipment,
          response.ip_address,
          response.field_object);
        this.loaded = true;
      });

    this.dataProviderService.fileNamesSubject.subscribe(
      (fileNames: string[]) => {
        this.fileNames = fileNames;
      }
    );
    this.dataProviderService.emitFileNames();
    console.log('--- FILENAMES ---');
    console.log(this.fileNames);

    this.dataProviderService.equipmentsSubject.subscribe(
      (equipments: Equipment[]) => {
        this.equipments = equipments;
      }
    );
    this.dataProviderService.emitEquipments();
  }

  /**
   * Function that navigate the equipment detail page linked to this Data Provider.
   * @param idEquipment The Equipment Id.
   */
  onViewEquipment(idEquipment: number) {
    this.router.navigate(['/equipments', idEquipment]);
  }

  /**
   * Function that enables the input according to the attribute
   * @param attribute the attribute describing the input type
   */
  enableInput(attribute: string) {
    switch (attribute) {
      case 'name':
        this.inputEnabled.name = true;
        break;
      case 'file_name':
        this.inputEnabled.file_name = true;
        break;
      case 'recurrence':
        this.inputEnabled.recurrence = true;
        break;
      case 'equipment':
        this.inputEnabled.equipment = true;
        break;
      case 'ip_address':
        this.inputEnabled.ip_address = true;
        break;
      case 'field':
        this.inputEnabled.field = true;
        console.log(this.fields);
        break;
      default:
        break;
    }
  }

  /**
   * Function that display the modify button on DataProvider considering user permissions
   */
  onChangeDataProviderPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'change_dataprovider'
    );
  }

  /**
   * Function that saves the input according to its type
   * @param attribute the attribute describing the type of input
   */
  saveInput(attribute: string) {
    let updatedField: any;
    switch (attribute) {
      case 'name':
        updatedField = {name: this.localDataProvider.name};
        this.inputEnabled.name = false;
        break;
      case 'file_name':
        updatedField = {file_name: this.localDataProvider.file_name};
        this.inputEnabled.file_name = false;
        break;
      case 'recurrence':
        updatedField = {recurrence: this.localDataProvider.recurrence};
        this.inputEnabled.recurrence = false;
        break;
      case 'equipment':
        updatedField = {equipment: this.localDataProvider.equipment};
        this.inputEnabled.equipment = false;
        break;
      case 'ip_address':
        updatedField = {ip_address: this.localDataProvider.ip_address};
        this.inputEnabled.ip_address = false;
        break;
      case 'field':
        updatedField = {field: this.localDataProvider.field_object};
        this.inputEnabled.field = false;
        break;
      case 'is_activated':
        setTimeout(() => {
          updatedField = {is_activated: this.localDataProvider.is_activated};
        }, 1000);
        break;
      // case 'end_date':
      //   const date_str = this.taskService.normaliseEndDateValue(this.date);
      //   this.task.end_date = date_str;
      //   updatedField = {end_date: this.task.end_date};
      //   this.inputEnabled.date = false;
      //   break;
      // case 'duration':
      //   this.task.duration = this.durationDays + ' days, ' + this.durationTime.hour + ':' + this.durationTime.minute + ':00';
      //   this.inputEnabled.duration = false;
      //   break;
      // case 'equipment':
      //   updatedField = {equipment: this.task.equipment.id};
      //   this.inputEnabled.equipment = false;
      //   break;
      default:
         break;
    }
    console.log(updatedField);
    console.log(this.localDataProvider);
    this.dataProviderService.updateDataProvider(this.localDataProvider.id, this.localDataProvider).subscribe(
      () => {
        this.dataProviderService.getDataProvider(this.localDataProvider.id).subscribe(
          (dataProvider: DataProvider) => {
            this.localDataProvider = dataProvider;
          }
        );
      },
      () => {
        this.router.navigate(['four-oh-four']);
    });
  }
  /**
   * Function that test if a string is an input duration
   * @param stringToTest the string to test
   */
  isInputDate(stringToTest: string): boolean {
    const regex_time = new RegExp('^((([0-9]+)d)?\\s*(([0-9]+)h)?\\s*(([0-9]+)m)?)$');
    return regex_time.test(stringToTest);
  }

  onSelectField() {
    this.equipments.forEach(
      (aEquipment) => {
        if (aEquipment.id === this.localDataProvider.equipment.id) {
          this.fields = aEquipment.fields;
        }
      }
    );
    console.log('pass button');
  }

  /**
   * Function that is triggered to load the modal template for deletion
   * @param content the modal to open
   */
  openDelete(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        // this.onDeleteTask();
        console.log('delete dataprovider');
      }
    },
    (error) => {});
  }

}
