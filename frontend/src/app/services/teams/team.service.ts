import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Team } from 'src/app/models/team';
import { catchError } from 'rxjs/operators';
import { throwError, Observable, Subject, observable } from 'rxjs';

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

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        'Backend returned code ${error.status}, ');
    }
    return throwError(
      'Something bad happened; please try again later.');
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

    const obs = this.httpClient.post<Team>(this.BASE_URL_API + '/api/teams/', teamJson, httpOptions);
    obs.subscribe(
      team => {
        this.teams.push(team);
        this.emitTeams();
      }
    );

    return obs;
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
  updateTeam(id: number, teamUpdated: Team) {
    this.httpClient.put<Team>(this.BASE_URL_API + '/api/usersmanagement/teams/' + id + '/', teamUpdated)
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Function that delete a Team object in database
   * @param id  the id of the team tot delete
   */
  deleteTeam(id: number) {
    return this.httpClient.delete<Team>(this.BASE_URL_API + '/api/usersmanagement/teams/' + id + '/');
  }

  addUserToTeam() {

  }
}
