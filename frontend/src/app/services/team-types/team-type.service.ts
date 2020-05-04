import { Injectable } from '@angular/core';
import { TeamType } from '../../models/team-type';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamTypeService {

  private BASE_URL_API = environment.baseUrl;

  team_types: TeamType[] = [];
  team_types_subject = new Subject<TeamType[]>();

  constructor(private httpClient: HttpClient) {
    this.getTeamTypes();
  }

  /**
   * Function that updates the subject teamTypeSubject
   */
  emitTeamTypes() {
    this.team_types_subject.next(this.team_types);
  }

  /**
   * Function that saves a new team type in the TeamType database
   * @param newTeamType the new teamType to be created
   */
  createTeamType(newTeamType: TeamType): Observable<any> {
    const ttJson = JSON.stringify(newTeamType);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.post<TeamType>(this.BASE_URL_API + '/api/usersmanagement/teamtypes/', ttJson, httpOptions);
  }

  /**
   * Function that modifies a team type in the TeamType database
   * @param updated_team_type the new teamType to be updated
   */
  updateTeamType(updated_team_type: TeamType): Observable<any> {
    const ttJson = JSON.stringify(updated_team_type);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.put<TeamType>(this.BASE_URL_API + '/api/usersmanagement/teamtypes/' + updated_team_type.id + '/',
                                              ttJson,
                                              httpOptions);
  }

  /**
   * Function that returns a team type in the TeamType database
   * @param team_type_id the id of the teamType to be returned
   */
  getTeamType(team_type_id: number): Observable<TeamType> {
    return this.httpClient.get<TeamType>(this.BASE_URL_API + '/api/usersmanagement/teamtypes/' + team_type_id);
  }

  /**
   * Function that returns all team types in the TeamType database
   */
  getTeamTypes() {
    this.httpClient
      .get<any[]>(this.BASE_URL_API + '/api/usersmanagement/teamtypes/')
      .subscribe(
        (response) => {
          this.team_types = [];
          response.forEach(element => {
            const gt = new TeamType(element.id, element.name, element.perms, element.team_set);
            this.team_types.push(gt);
          });
          this.emitTeamTypes();
        },
        (error) => {
          console.log('Erreur ! :' + error);
        }
      );
  }

  /**
   * Function that deletes a team type in the TeamType database
   * @param id_team_type the if of the teamType to be deleted
   */
  deleteTeamType(id_team_type: number) {
    this.httpClient
      .delete<any>(this.BASE_URL_API + '/api/usersmanagement/teamtypes/' + id_team_type + '/')
      .subscribe(
        (response) => {
          const old_team_type = this.team_types.find((value) => {
            return value.id === id_team_type;
          });
          const index = this.team_types.indexOf(old_team_type);
          this.team_types.splice(index, 1);
          this.emitTeamTypes();
          return true;
        },
        (error) => {
          console.log('Erreur ! :' + error);
        }
      );
    return false;
  }
}

