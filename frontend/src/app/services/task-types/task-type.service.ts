import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TaskType } from 'src/app/models/task-type';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskTypeService {

  private BASE_URL_API = environment.baseUrl;

  task_types: TaskType[] = [];
  task_types_subject = new Subject<TaskType[]>();

  constructor(private httpClient: HttpClient) {
    this.getTaskTypes();
  }

  /**
   * Function that updates the subject TaskTypeSubject
   */
  emitTaskTypes() {
    this.task_types_subject.next(this.task_types);
  }

  /**
   * Function that saves a new task type in the TaskType database
   * @param newTaskType the new taskType to be created
   */
  createTaskType(newTaskType: TaskType): Observable<any> {
    const ttJson = JSON.stringify(newTaskType);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.post<TaskType>(this.BASE_URL_API + '/api/maintenancemanagement/tasktypes/', ttJson, httpOptions);
  }

  /**
   * Function that modifies a task type in the TaskType database
   * @param updated_task_type the new taskType to be updated
   */
  updateTaskType(updated_task_type: TaskType): Observable<any> {
    const ttJson = JSON.stringify(updated_task_type);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.put<TaskType>(this.BASE_URL_API + '/api/maintenancemanagement/tasktypes/' + updated_task_type.id + '/',
                                              ttJson,
                                              httpOptions);
  }

  /**
   * Function that returns a task type in the TaskType database
   * @param task_type_id the id of the taskType to be returned
   */
  getTaskType(task_type_id: number): Observable<TaskType> {
    return this.httpClient.get<any>(this.BASE_URL_API + '/api/maintenancemanagement/tasktypes/' + task_type_id + '/');
  }

  /**
   * Function that returns all task types in the TaskType database
   */
  getTaskTypes() {
    this.httpClient
      .get<any[]>(this.BASE_URL_API + '/api/maintenancemanagement/tasktypes/')
      .subscribe(
        (response) => {
          this.task_types = [];
          response.forEach(element => {
            const tt = new TaskType(element.id, element.name, element.fields, element.tasks);
            this.task_types.push(tt);
          });
          this.emitTaskTypes();
        },
        (error) => {
          console.log('Erreur ! :' + error);
        }
      );
  }

  /**
   * Function that deletes a task type in the TaskType database
   * @param id_task_type the if of the taskType to be deleted
   */
  deleteTaskType(id_task_type: number): Observable<TaskType> {
    return this.httpClient.delete<any>(this.BASE_URL_API + '/api/maintenancemanagement/tasktypes/' + id_task_type + '/');
  }
}
