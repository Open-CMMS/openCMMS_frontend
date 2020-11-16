import { Component, OnInit } from '@angular/core';
import { faTrash, faPen, faSave, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Field } from 'src/app/models/field';
import { DataProviderService } from '../../../services/data-provider/data-provider.service';
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

  // onTest variables
  tested = false;
  success = false;

  // local variables
  loaded = false;
  localDataProvider: DataProvider = null;
  fileNames: string[];
  equipments: Equipment[];
  fields: Field[];

  // Input enabled variables
  inputEnabled = {
    name: false,
    file_name: false,
    recurrence: false,
    ip_address: false,
    equipment: false,
    field: false
  };


  /**
   * Constructor of dataProviderDetailsComponent
   * @param dataProviderService the service used to handle dataProviders
   * @param route the service used to handle route parameters
   * @param router the service used to handle routing
   * @param formBuilder the service used to handle forms
   */
  constructor(
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
    this.dataProviderService.equipmentsSubject.subscribe(
      (equipments: Equipment[]) => {
        this.equipments = equipments;
      }
    );
    this.dataProviderService.emitEquipments();
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
        this.inputEnabled.field = false;
        break;
      case 'ip_address':
        this.inputEnabled.ip_address = true;
        break;
      case 'field':
        this.inputEnabled.equipment = false;
        this.inputEnabled.field = true;
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
    switch (attribute) {
      case 'name':
        this.inputEnabled.name = false;
        break;
      case 'file_name':
        this.inputEnabled.file_name = false;
        break;
      case 'recurrence':
        this.inputEnabled.recurrence = false;
        break;
      case 'equipment':
        this.inputEnabled.equipment = false;
        break;
      case 'ip_address':
        this.inputEnabled.ip_address = false;
        break;
      case 'field':
        this.inputEnabled.field = false;
        break;
      case 'is_activated':
        break;
      default:
         break;
    }
    // Ici le setTimeout sert dans le cas où l'on change le is_activated, en effet il y a un délai avant que le changement soit effectué.
    setTimeout(() => {
      this.dataProviderService.updateDataProvider(this.localDataProvider.id, this.localDataProvider, true).subscribe(
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
    }, 500);
  }
  /**
   * Function that test if a string is an input duration
   * @param stringToTest the string to test
   */
  isInputDate(stringToTest: string): boolean {
    const regex_time = new RegExp('^((([0-9]+)d)?\\s*(([0-9]+)h)?\\s*(([0-9]+)m)?)$');
    return regex_time.test(stringToTest);
  }

  /**
   * Function that set the select field according to the selected equipment.
   */
  onSelectField() {
    this.equipments.forEach(
      (aEquipment) => {
        if (aEquipment.id === this.localDataProvider.equipment.id) {
          this.fields = aEquipment.fields;
        }
      }
    );
  }

  /**
   * Function that test the data provider with the python file associated.
   */
  onTest() {
    this.dataProviderService.testDataProvider(this.localDataProvider, true).subscribe(
      (response) => {
        this.tested = true;
        this.success = true;
      },
      (error) => {
        this.tested = true;
        this.success = false;
      }
    );
  }

  /**
   * Function that is triggered to load the modal template for deletion
   * @param content the modal to open
   */
  openDelete(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        return this.dataProviderService.deleteDataProvider(this.localDataProvider.id).subscribe(
          () => {
            this.dataProviderService.getDataProviders();
            this.router.navigate(['/data-providers']);
          }
        );
      }
    },
    (error) => {});
  }

}
