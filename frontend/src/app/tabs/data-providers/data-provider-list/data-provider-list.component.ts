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

@Component({
  selector: 'app-data-provider-list',
  templateUrl: './data-provider-list.component.html',
  styleUrls: ['./data-provider-list.component.scss']
})
export class DataProviderListComponent implements OnInit, OnDestroy {

  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  test: any[] = ['unField'];
  test2: any = 'salut';
  unField: Field = null;
  dataProviders: DataProvider[] = [
    new DataProvider(1, 'test', 'test.py', 'tous les jours', true,
      new Equipment(1, 'test', 'equipmentTypeTest', this.test, this.test2), '192.168.101.1', this.unField)];
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



  // /**
  //  * Function that switches a Data Provider state (activated/diabled)
  //  * @param i the index of the teamType in the list
  //  */
  // onSwitchStateDataProvider(i: number) {
  //   const dataProviderId = this.dataProviders[i].id;
  //   this.dataProviderService.switchStateDataProviders(dataProviderId);
  // }

  /**
   * Function called when the component is destroyed
   */
  ngOnDestroy() {
    this.dataProviderSubscription.unsubscribe();
  }
}
