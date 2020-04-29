import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team } from 'src/app/models/team';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private teams: Team[] = [];
  teamSubject = new Subject<Team[]>();
  private BASE_URL_API = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.getTeams();
  }

  emitTeams() {
    this.teamSubject.next(this.teams);
  }

  /**
   * Function that saves a new team in the Team database
   * @param newTeam the new team to be created
   */
  createTeam(newTeam: Team): Observable<any> {
    const teamJson = JSON.stringify(newTeam);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this.httpClient.post<Team>(this.BASE_URL_API + '/api/usersmanagement/teams/', teamJson, httpOptions);
  }

  /**
   * Getter on a team saved in the Team database
   * @param id the id of the team
   * @return the team called for
   */
  getTeam(id: number): Observable<Team> {
    return this.httpClient.get<Team>(this.BASE_URL_API + '/api/usersmanagement/teams/' + id);
  }

  /**
   * Getter on the list of all the groups in the database
   * @return the list of groups called for
   */
  getTeams() {
    this.teams = [];
    this.httpClient.get<Team[]>(this.BASE_URL_API + '/api/usersmanagement/teams/')
                   .subscribe(
                      (response) => {
                        response.forEach(element => {
                          const team = new Team(element.id, element.name, element.team_type, element.user_set);
                          this.teams.push(team);
                        });
                        this.emitTeams();
                      }
                    );
  }

  /**
   * Function that update a Team object in database
   * @param id  the id of the team
   * @param teamUpdated the new version of the team
   */
  updateTeam(id: number, teamUpdated: Team): Observable<Team> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this.httpClient.put<Team>(this.BASE_URL_API + '/api/usersmanagement/teams/' + id, teamUpdated, httpOptions);
  }

  /**
   * Function that delete a Team object in database
   * @param id  the id of the team tot delete
   */
  deleteTeam(id: number) {
    return this.httpClient.delete<Team>(this.BASE_URL_API + '/api/usersmanagement/teams/' + id);
  }

  addUserToTeam() {

  }
}
