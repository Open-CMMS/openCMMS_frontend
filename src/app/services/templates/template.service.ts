import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team } from 'src/app/models/team';
import { Observable, Subject } from 'rxjs';
import { Template } from 'src/app/models/template';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private templates: Template[] = [];
  templateSubject = new Subject<Template[]>();
  private BASE_URL_API = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.getTemplates();
  }

  /**
   * Function that updates the subject templateSubject
   */
  emitTemplates() {
    this.templateSubject.next(this.templates);
  }

  getTemplates() {
      this.templates = [];
      this.httpClient.get<Template[]>(this.BASE_URL_API + '/api/maintenancemanagement/tasks/?template=true')
                    .subscribe((templates) => {
                        for (const template of templates) {
                            const temp = new Template(
                                template.id,
                                template.name,
                                template.description,
                                template.end_date,
                                template.duration,
                                template.equipment,
                                template.teams,
                                template.files
                                );
                            this.templates.push(temp);
                        }
                        this.emitTemplates();
                    });
  }


  /**
   * Function that delete a Template object in database
   * @param id  the id of the template to delete
   */
  deleteTemplate(id: number) {
    return this.httpClient.delete<Template>(this.BASE_URL_API + '/api/maintenancemanagement/tasks/' + id + '/');
  }

  /**
   * Function that saves a new team in the Team database
   * @param newTeam the new team to be created
   */
  createTemplate(newTemplate: Template): Observable<any> {
    const templateJson = JSON.stringify(newTemplate);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this.httpClient.post<Template>(this.BASE_URL_API + '/api/maintenancemanagement/tasks/', templateJson, httpOptions);
  }

  getConditionsTypes() {
      return this.httpClient.get<any>(this.BASE_URL_API + '/api/maintenancemanagement/tasks/requirements');
  }
}
