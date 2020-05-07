import { Injectable } from '@angular/core';
import { Task } from 'src/app/models/task';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: Task[];
  taskSubject = new Subject<Task[]>();
  private BASE_URL_API = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.getTasks();
  }

  /**
   * Function that updates the subject taskSubject
   */
  emitTasks() {
    this.taskSubject.next(this.tasks);
  }

  /**
   * Getter on the list of all the tasks in the database
   * @return the list of tasks called for
   */
  getTasks() {
    this.tasks = [];
    this.httpClient.get<Task[]>(this.BASE_URL_API + '/api/maintenancemanagement/tasks/')
                   .subscribe(
                      (response) => {
                        response.forEach(element => {
                          const task = new Task(
                            element.id,
                            element.name,
                            element.description,
                            element.end_date,
                            element.time,
                            element.is_template,
                            element.equipment,
                            element.teams,
                            element.task_type,
                            element.files,
                            element.over);
                          this.tasks.push(task);
                        });
                        this.emitTasks();
                      }
                    );
  }

  /**
   * Function that saves a new task in the Task database
   * @param newTask the new task to be created
   */
  createTask(newTask: Task): Observable<Task> {
    const taskJson = JSON.stringify(newTask);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this.httpClient.post<Task>(this.BASE_URL_API + '/api/maintenancemanagement/tasks/', taskJson, httpOptions);
  }

  /**
   * Getter on a task saved in the Task database
   * @param id the id of the task
   * @return the task called for
   */
  getTask(id: number): Observable<Task> {
    return this.httpClient.get<Task>(this.BASE_URL_API + '/api/maintenancemanagement/tasks/' + id + '/');
  }

  /**
   * Function that update a Task object in database
   * @param id  the id of the task
   * @param taskUpdated the new version of the task
   */
  updateTask(id: number, taskUpdated: Task): Observable<Task> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this.httpClient.put<Task>(this.BASE_URL_API + '/api/maintenancemanagement/tasks/' + id + '/', taskUpdated, httpOptions);
  }

  /**
   * Function that delete a Task object in database
   * @param id  the id of the task to delete
   */
  deleteTask(id: number) {
    return this.httpClient.delete<Task>(this.BASE_URL_API + '/api/maintenancemanagement/tasks/' + id + '/');
  }

  /**
   * Function that add a team to a task
   * @param idTask  the id of the task to update
   * @param idTeam  the id of the team to add
   */
  addTeamToTask(idTask: number, idTeam: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    const reqBody = {
      id_task: idTask.toString(),
      id_team: idTeam.toString()
    };
    return this.httpClient.post<any>(this.BASE_URL_API + '/api/maintenancemanagement/addteamtotask', reqBody, httpOptions);
  }

  /**
   * Function that remove a team from a task
   * @param idTask  the id of the task to update
   * @param idTeam  the id of the teamù to remove
   */
  removeTeamFromTask(idTask: number, idTeam: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    const reqBody = {
      id_task: idTask.toString(),
      id_team: idTeam.toString()
    };
    return this.httpClient.put<any>(this.BASE_URL_API + '/api/maintenancemanagement/addteamtotask', reqBody, httpOptions);
  }

  normaliseEndDateValue(formEndDateInput: any): string {
    let end_date: string;
    if (formEndDateInput) {
      end_date = formEndDateInput.year + '-' + formEndDateInput.month + '-' + formEndDateInput.day;
    } else {
      end_date = null;
    }
    return end_date;
  }
  /**
   * Function that return the set of task of a specific user
   * @param userId the id of the user
   */
  getUserTasks(userId: number) {
    return this.httpClient.get(this.BASE_URL_API + '/api/maintenancemanagement/usertasklist/' + userId);
  }
}
