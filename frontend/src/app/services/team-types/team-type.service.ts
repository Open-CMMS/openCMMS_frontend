import { Injectable } from '@angular/core';
import { TeamType } from '../../models/team-type';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamTypeService {

  // • createTeamType(teamType) : Boolean
  // • updateTeamType(updatedTeamType) : Boolean
  // • deleteTeamType(teamTypeId) : Boolean
  // • getTeamTypes() : List<TeamType>

  private BASE_URL_API = environment.baseUrl;

  team_types: TeamType[] = [];
  team_types_subject = new Subject<TeamType[]>();

  constructor(private httpClient: HttpClient) {
    this.getTeamTypes();
  }

  emitTeamTypes() {
    this.team_types_subject.next(this.team_types);
  }

  saveTeamTypes() {

  }

  createTeamType(newTeamType: TeamType): Observable<any> {
    const gtJson = JSON.stringify(newTeamType);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    const obs = this.httpClient.post<TeamType>(this.BASE_URL_API + '/api/usersmanagement/teamtypes/', gtJson, httpOptions);
    obs.subscribe(
      team_type => {
        this.team_types.push(team_type);
        this.emitTeamTypes();
      });
    return obs;
  }

  updateTeamType(updated_team_type: TeamType): Observable<any> {
    const ttJson = JSON.stringify(updated_team_type);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    const obs = this.httpClient.put<TeamType>(this.BASE_URL_API + '/api/usersmanagement/teamtypes/' + updated_team_type.getId(),
                                              ttJson,
                                              httpOptions);
    obs.subscribe(
      team_type => {
        const old_team_type = this.team_types.find((value) => {
          return value.getId() === team_type.id;
        });
        const index = this.team_types.indexOf(old_team_type);
        this.team_types[index] = updated_team_type;

        this.emitTeamTypes();
      });
    return obs;
  }

  getTeamType(team_type_id: number): Observable<TeamType> {
    return this.httpClient.get<any>(this.BASE_URL_API + '/api/usersmanagement/teamtypes/' + team_type_id);
  }

  getTeamTypes() {
    this.httpClient
      .get<any[]>(this.BASE_URL_API + '/api/usersmanagement/teamtypes/')
      .subscribe(
        (response) => {
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

  getTeamTypePermissions() {
    this.httpClient
      .get<any[]>(this.BASE_URL_API + '/api/usersmanagement/teamtypes/')
      .subscribe(
        (response) => {
          response.forEach(element => {
              const gt = new TeamType(element.id, element.name, element.perms, element.groups);
              this.team_types.push(gt);
          });
          this.emitTeamTypes();
        },
        (error) => {
          console.log('Erreur ! :' + error);
        }
      );
  }

  deleteTeamType(id_team_type: number) {
    let ret = false;
    this.httpClient
      .delete<any>(this.BASE_URL_API + '/api/usersmanagement/teamtypes/' + id_team_type)
      .subscribe(
        (response) => {
          if (response === true) {
            const old_team_type = this.team_types.find((value) => {
              return value.getId() === id_team_type;
            });
            const index = this.team_types.indexOf(old_team_type);
            this.team_types.splice(index, 1);
            ret = response;
          }
        },
        (error) => {
          console.log('Erreur ! :' + error);
        }
      );
    return ret;
  }
}

