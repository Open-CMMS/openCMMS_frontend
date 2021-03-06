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

  fieldObjectSubject = new Subject<any[]>();

  private BASE_URL_API = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
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
                        for (const element of response) {
                          const task = new Task(
                            element.id,
                            element.name,
                            element.description,
                            element.end_date,
                            element.duration,
                            element.is_template,
                            element.equipment,
                            element.teams,
                            element.files,
                            element.over,
                            element.trigger_conditions,
                            element.end_conditions);
                          this.tasks.push(task);
                        }
                        this.emitTasks();
                      }
                    );
  }

  /**
   * Function that saves a new task in the Task database
   * @param name name of the task
   * @param description description of the task
   * @param end_date end_date of the task
   * @param duration duration of the task
   * @param equipment equipment assigned to the task
   * @param equipment_type equipment type assigned to the task
   * @param teams teams assigned to the task
   * @param files files associated to the task
   * @param trigger_conditions trigger conditions of the task
   * @param end_conditions end conditions of the task
   */
  createTask(
      name: string,
      description: string,
      end_date: string,
      duration: string,
      equipment: number,
      equipment_type: number,
      teams: number[],
      files: number[],
      trigger_conditions: any[],
      end_conditions: any[]): Observable<any> {
    const taskJson = JSON.stringify({
      name,
      description,
      end_date,
      duration,
      equipment,
      equipment_type,
      teams,
      files,
      trigger_conditions,
      end_conditions
    });

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
   * @param idTeam  the id of the team to remove
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


  /**
   * Function to normalise the value of DatePicker inputs into a string with the correct format
   * @param formEndDateInput value of the DatePicker input
   */
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
   * Function to normalise the value of duration inputs into a string with the correct format
   * @param formDurationInput value of the duration input
   */
  normaliseDurationValue(formDurationInput: string, separators: any[]): string {
    const str_time = formDurationInput.trim();
    let part1 = '';
    let part2 = '';
    let part3 = '';
    let pos_0_start: number;
    let pos_0_end: number;
    let pos_1_start: number;
    let pos_1_end: number;
    let pos_2_start: number;
    let pos_2_end: number;

    pos_0_start = 0;
    pos_0_end = str_time.indexOf(separators[0]) !== -1 ? str_time.indexOf(separators[0]) : 0;

    if (str_time.indexOf(separators[1]) === -1) {
      pos_1_start = 0;
      pos_1_end = 0;
    } else if (pos_0_end === 0) {
      pos_1_start = 0;
      pos_1_end = str_time.indexOf(separators[1]);
    } else {
      pos_1_start = pos_0_end + 1;
      pos_1_end = str_time.indexOf(separators[1]);
    }

    if (str_time.indexOf(separators[2]) === -1) {
      pos_2_start = 0;
      pos_2_end = 0;
    } else if (pos_1_end === 0) {
      if (pos_0_end === 0) {
        pos_2_start = 0;
      } else {
        pos_2_start = pos_0_end + 1;
      }
      pos_2_end = str_time.indexOf(separators[2]);
    } else {
      pos_2_start = pos_1_end + 1;
      pos_2_end = str_time.indexOf(separators[2]);
    }

    part1 = str_time.substring(pos_0_start, pos_0_end) === '' ? '0' : str_time.substring(pos_0_start, pos_0_end);
    part2 = str_time.substring(pos_1_start, pos_1_end) === '' ? '0' : str_time.substring(pos_1_start, pos_1_end);
    part3 = str_time.substring(pos_2_start, pos_2_end) === '' ? '0' : str_time.substring(pos_2_start, pos_2_end);


    if (separators[0] === 'd') {
      return part1.trim() + ' days, ' + part2.trim() + ':' + part3.trim() + ':0';
    } else if (separators[0] === 'y') {
      return part1.trim() + ' years, ' + part2.trim() + ' months, ' + part3.trim() + ' days';
    } else {
      return part1.trim() + ', ' + part2.trim() + ', ' + part3.trim();
    }
  }

  /**
   * Function that return the set of task of a specific user
   * @param userId the id of the user
   */
  getUserTasks(userId: number) {
    return this.httpClient.get(this.BASE_URL_API + '/api/maintenancemanagement/usertasklist/' + userId);
  }

  /**
   * Function that triggers a request to get the data required to create a new Task
   */
  getTaskCreationRequirements(): Observable<any> {
    return this.httpClient.get(this.BASE_URL_API + '/api/maintenancemanagement/tasks/requirements');
  }

}
