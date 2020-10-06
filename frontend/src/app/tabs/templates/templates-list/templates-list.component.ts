import { Component, OnInit, OnDestroy } from '@angular/core';
import { Team } from 'src/app/models/team';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { faTrash, faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { TemplateService } from 'src/app/services/templates/template.service';
import { Template } from 'src/app/models/template';

@Component({
  selector: 'app-templates-list',
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.scss']
})
/**
 * Class for the component in charge of Team list display
 */
export class TemplatesListComponent implements OnInit, OnDestroy {
  // Local Variables
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  faPlus = faPlus;

  templates: Template[] = [];
  templatesSubscription: Subscription;

  /**
   * Constructor for the TeamList component
   * @param templateService the service to communicate with backend on Team objects
   * @param router the service used to handle redirections
   * @param modalService the service to handle modal windows
   * @param utilsService the service used for useful methods
   * @param authenticationService the authentication service
   */
  constructor(private templateService: TemplateService,
              private router: Router,
              private modalService: NgbModal,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.templatesSubscription = this.templateService.templateSubject.subscribe(
      (templates: Template[]) => {
        this.templates = templates;
      }
    );
    this.templateService.emitTemplates();
  }

  /**
   * Function that opens the modal to confirm a deletion
   * @param content the modal template to load
   * @param team the team concerned by the deletion
   */
  openDelete(content, template: Template) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteTeam(template);
      }
    });
  }

  /**
   * Function to delete a team
   * @param team the team to delete
   */
  onDeleteTeam(template: Template) {
    this.templateService.deleteTemplate(template.id).subscribe(
      (resp) => {
        this.templateService.getTemplates();
        this.router.navigate(['/teams']);
      }
    );
  }

  /**
   * Function that display the delete button on Teams considering user permissions
   */
  onDeleteTeamPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'delete_task'
      );
  }

  /**
   * Function that redirect to the new Team creation page
   */
  onCreateTemplate() {
    this.router.navigate(['/new-template']);
  }

  /**
   * Function that display Create Team button in navbar when current User has the correct permission
   */
  onAddTemplatePermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'add_task'
      );
  }

  /**
   * Function called at the destruction of the component
   */
  ngOnDestroy() {
    this.templatesSubscription.unsubscribe();
  }

}
