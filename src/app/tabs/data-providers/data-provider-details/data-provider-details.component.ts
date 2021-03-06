import { Component, OnInit } from '@angular/core';
import { faTrash, faPen, faSave, faInfoCircle, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Field } from 'src/app/models/field';
import { DataProviderService } from '../../../services/data-provider/data-provider.service';
import { DataProvider } from 'src/app/models/data-provider';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import {Equipment} from '../../../models/equipment';
import {UrlService} from '../../../services/shared/url.service';

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
  faChevronLeft = faChevronLeft;

  // onTest variables
  tested = false;
  success = false;

  // local variables
  loaded = false;
  localDataProvider: DataProvider = null;
  fileNames: string[];
  equipments: Equipment[];
  fields: Field[];
  toModify = false;
  selectedEquipment: any;
  previousUrl = '';

  // Input enabled variables
  inputEnabled = {
    name: false,
    file_name: false,
    recurrence: false,
    ip_address: false,
    equipment: false,
    field: false,
    port: false,
  };


  /**
   * Constructor of dataProviderDetailsComponent
   * @param dataProviderService the service used to handle dataProviders
   * @param route the service used to handle route parameters
   * @param router the service used to handle routing
   * @param modalService the modal service
   * @param utilsService the utils service
   * @param authenticationService the authentication service
   * @param urlService the service to handled URL
   */
  constructor(
    private dataProviderService: DataProviderService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private authenticationService: AuthenticationService,
    private urlService: UrlService,
    ) { }

  ngOnInit(): void {
    this.urlService.previousUrl$.subscribe( (previousUrl: string) => {
      this.previousUrl = previousUrl;
    });
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
          response.port,
          response.field_object);
        this.loaded = true;
        this.selectedEquipment = this.localDataProvider.equipment;
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
        this.updateEquipmentAndField();
        this.selectedEquipment = this.localDataProvider.equipment;
        break;
      case 'ip_address':
        this.inputEnabled.ip_address = true;
        break;
      case 'port':
        this.inputEnabled.port = true;
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
        this.inputEnabled.field = true;
        this.toModify = true;
        this.updateEquipmentAndField();
        break;
      case 'ip_address':
        this.inputEnabled.ip_address = false;
        break;
      case 'port':
        this.inputEnabled.port = false;
        break;
      case 'field':
        this.inputEnabled.field = false;
        this.updateField();
        break;
      case 'is_activated':
        break;
      default:
         break;
    }
    // Ici le setTimeout sert dans le cas où l'on change le is_activated, en effet il y a un délai avant que le changement soit effectué.
    if (!this.toModify) {
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
   * Function that set the selected equipment and the select field according to the selected equipment.
   */
  updateEquipmentAndField() {
    this.equipments.forEach(
      (aEquipement) => {
        if (aEquipement.id.toString(10) === this.selectedEquipment.id.toString(10)) {
          this.localDataProvider.equipment = aEquipement;
          this.localDataProvider.equipment.id = aEquipement.id;
          this.fields = aEquipement.fields;
        }
      }
    );
  }

  /**
   * Function that set the field according to the selected field.
   */
  updateField() {
    this.fields.forEach(
      (aField) => {
        if (aField.id.toString(10) === this.localDataProvider.field_object.id.toString(10)) {
          this.localDataProvider.field_object = aField;
        }
      }
    );
  }

  /**
   * Function that test the data provider with the python file associated.
   */
  onTest() {
    this.dataProviderService.testDataProvider(this.localDataProvider, true).subscribe(
      (res) => {
        if (res.data) {
          this.tested = true;
          this.success = true;
        }
        if (res.error) {
          this.tested = true;
          this.success = false;
        }
      },
    );
  }

  /**
   * Function call to notify that a equipment field need to be selected.
   */
  onChange() {
    this.toModify = false;
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
    () => {});
  }

  /**
   * Function to return to the listing page.
   */
  onPreviousPage() {
    this.router.navigate([this.previousUrl]);
  }

}
