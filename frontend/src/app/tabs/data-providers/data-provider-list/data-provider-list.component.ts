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
@Component({
  selector: 'app-data-provider-list',
  templateUrl: './data-provider-list.component.html',
  styleUrls: ['./data-provider-list.component.scss']
})
export class DataProviderListComponent implements OnInit, OnDestroy {

  // Icons
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;

  // Local variables
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
   * @param i the index of the dataProvider in the list
   */
  onViewDataProvider(i: number) {
    const dataProviderId = this.dataProviders[i].id;
    this.router.navigate(['/data-providers', dataProviderId]);
  }

  /**
   * Function that activates/deactivates a data provider.
   * @param dataProvider the dataprovider to activate or deactivate.
   */
  onActivate(dataProvider: DataProvider) {
    setTimeout( () => {
      this.dataProviderService.updateDataProvider(dataProvider.id, dataProvider, true).subscribe(
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
