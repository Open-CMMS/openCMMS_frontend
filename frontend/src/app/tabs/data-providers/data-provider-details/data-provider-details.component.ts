import { Component, OnInit } from '@angular/core';
import { faTrash, faPen, faSave } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Field } from 'src/app/models/field';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DataProviderService } from '../../../services/data-provider/data-provider.service';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';

@Component({
  selector: 'app-data-provider-details',
  templateUrl: './data-provider-details.component.html',
  styleUrls: ['./data-provider-details.component.scss']
})
export class DataProviderDetailsComponent implements OnInit {

  // Form
  updateForm: FormGroup;

  // Icons
  faTrash = faTrash;
  faPen = faPen;
  faSave = faSave;
  task: any;
  durationDays = 0;
  durationTime: { hour: number; minute: number; };
  taskDuration: string;
  concernedField: Field;

  // Recurrence
  recurrenceRegex: string;

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
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
    let id: number;
    this.route.params.subscribe(params => {
      id = +params.id;
    });
    this.dataProviderService.getDataProvider(id);
    this.initForm();
  }

  initForm() {
    this.recurrenceRegex = '^((([0-9]+)d)?\\s*(([0-9]+)h)?\\s*(([0-9]+)m)?)$';
    const regex_time = new RegExp('^((([0-9]+)d)?\\s*(([0-9]+)h)?\\s*(([0-9]+)m)?)$');

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      fileName: [''],
      equipment: [''],
      equipment_ip: [''],
      field: [''],
      recurrence: ['', Validators.pattern(regex_time)],
      activated: [true],
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
   * Function that realizes the shaping of the duration for communication with the API
   */
  formatDurationStringAndInitDurationInput() {
    const days_time_separator = ' ';
    const hours_minutes_separator = ':';
    const init_str = this.task.duration;

    let days: string;
    let time: string;
    let right_part: string;
    let left_part: string;
    let days_str: string;

    if (this.task.duration) {
      [left_part, right_part] = init_str.split(days_time_separator);
      if (right_part) {
        days = left_part;
        time = right_part;
      } else {
        if (left_part.indexOf(hours_minutes_separator) === -1) {
          days = left_part;
        } else {
          time = left_part;
        }
      }

      if (days) {
        const plurel = parseInt(days, 10) > 1 ? 's' : '';
        days_str = parseInt(days, 10) > 0 ? days + 'day' + plurel + ', ' : '';
        this.durationDays = parseInt(days, 10);
      } else {
        days_str = '';
      }

      if (time) {
        let hours: string;
        let minutes: string;
        let seconds: string;
        [hours, minutes, seconds] = time.split(hours_minutes_separator);
        this.durationTime = {hour: parseInt(hours, 10), minute: parseInt(minutes, 10)};
      }

      this.taskDuration = days_str + time;
    }
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
