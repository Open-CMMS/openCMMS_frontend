import { Component, OnInit } from '@angular/core';
import { faTrash, faPen, faSave } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Field } from 'src/app/models/field';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DataProviderService } from '../../../services/data-provider/data-provider.service';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { DataProvider } from 'src/app/models/data-provider';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-data-provider-details',
  templateUrl: './data-provider-details.component.html',
  styleUrls: ['./data-provider-details.component.scss']
})
export class DataProviderDetailsComponent implements OnInit {

  // Icons
  faTrash = faTrash;
  faPen = faPen;
  faSave = faSave;
  durationDays = 0;
  durationTime: { hour: number; minute: number; };
  taskDuration: string;
  concernedField: Field;
  localDataProvider: DataProvider = null;
  

  //
  loaded = false;

  // Recurrence
  recurrenceRegex: string;
  inputEnabled = {
    name: false,
    recurrence: false,
    equipment_ip: false,
    equipment: false
  };
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
    console.log("cc");
    this.dataProviderService.getDataProvider(id)
      .subscribe((response) => {
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
      case 'recurrence':
        this.inputEnabled.recurrence = true;
        break;
      case 'equipment':
        this.inputEnabled.equipment = true;
        break;
      case 'equipment_ip':
        this.inputEnabled.equipment_ip = true;
        break;
      default:
        break;
    }
  }

  /**
   * Function that display the modify button on Task considering user permissions
   */
  onChangeTaskPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'change_task'
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
    // this.dataProviderService.updateDataProvider(this.localDataProvider).subscribe(
    //   (response) => {
    //     this.dataProviderService.getDataProvider(this.localDataProvider.id).subscribe(
    //       (dataProvider: DataProvider) => {
    //         console.log("update");
    //         this.localDataProvider = dataProvider;
    //         // this.formatDurationStringAndInitDurationInput();
    //         // this.initDateInput();
    //       }
    //     );
    //   },
    //   (error) => {
    //     this.router.navigate(['four-oh-four']);
    // });
  }
  /**
   * Function that realizes the shaping of the duration for communication with the API
   */
  formatDurationStringAndInitDurationInput() {
    // const days_time_separator = ' ';
    // const hours_minutes_separator = ':';
    // const init_str = this.task.duration;

    // let days: string;
    // let time: string;
    // let right_part: string;
    // let left_part: string;
    // let days_str: string;

    // if (this.task.duration) {
    //   [left_part, right_part] = init_str.split(days_time_separator);
    //   if (right_part) {
    //     days = left_part;
    //     time = right_part;
    //   } else {
    //     if (left_part.indexOf(hours_minutes_separator) === -1) {
    //       days = left_part;
    //     } else {
    //       time = left_part;
    //     }
    //   }

    //   if (days) {
    //     const plurel = parseInt(days, 10) > 1 ? 's' : '';
    //     days_str = parseInt(days, 10) > 0 ? days + 'day' + plurel + ', ' : '';
    //     this.durationDays = parseInt(days, 10);
    //   } else {
    //     days_str = '';
    //   }

    //   if (time) {
    //     let hours: string;
    //     let minutes: string;
    //     let seconds: string;
    //     [hours, minutes, seconds] = time.split(hours_minutes_separator);
    //     this.durationTime = {hour: parseInt(hours, 10), minute: parseInt(minutes, 10)};
    //   }

    //   this.taskDuration = days_str + time;
    // }
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
