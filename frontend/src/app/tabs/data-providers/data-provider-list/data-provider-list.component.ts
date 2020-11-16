import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataProvider } from 'src/app/models/data-provider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { DataProviderService } from 'src/app/services/data-provider/data-provider.service';
import { Equipment } from 'src/app/models/equipment';
import { Field } from 'src/app/models/field';
import set = Reflect.set;

@Component({
  selector: 'app-data-provider-list',
  templateUrl: './data-provider-list.component.html',
  styleUrls: ['./data-provider-list.component.scss']
})
export class DataProviderListComponent implements OnInit, OnDestroy {

  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  dataProviders: DataProvider[] = [];
  dataProviderSubscription: Subscription;

  /**
   * Constructor for the EquipmentTypeListComponent
   * @param router the service used to handle redirections
   * @param utilsService the service used for useful methods
   * @param authenticationService the authentication service
   */
  constructor(
    private dataProviderService: DataProviderService,
    private router: Router,
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private authenticationService: AuthenticationService) { }

  /**
   * Function that initializes the component when loaded
   */
  ngOnInit(): void {
    this.dataProviderSubscription = this.dataProviderService.dataProvidersSubject.subscribe(
      (dataProviders: DataProvider[]) => {
        this.dataProviders = dataProviders;
      }
    );
    this.dataProviderService.emitDataProviders();
  }

  /**
   * Function that navigates to the DataProviderDetailComponent
   * @param i the index of the equipmentType in the list
   */
  onViewDataProvider(i: number) {
    const dataProviderId = this.dataProviders[i].id;
    this.router.navigate(['/data-providers', dataProviderId]);
  }

  onActivate(i: number, dataProvider: DataProvider) {
    setTimeout( () => {
      this.dataProviderService.updateDataProvider(i, dataProvider, true).subscribe(
        () => {}
        );
    }, 500);
  }

  /**
   * Function called when the component is destroyed
   */
  ngOnDestroy() {
    this.dataProviderSubscription.unsubscribe();
  }
}
