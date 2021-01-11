import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { Task } from 'src/app/models/task';

describe('TaskService', () => {
  let service: TaskService;
  const BASE_URL_API = environment.baseUrl;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ TaskService ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.inject(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('US5_A5 - should be created', () => {
    expect(service).toBeTruthy();
  });

  it('US5_A6 - should verify the parameters and content of the task get action', () => {
    const mockTasks = [
      {
        id: 0,
        name: 'Task 0',
        description: 'Description task 0'
      },
      {
        id: 1,
        name: 'Task 1',
        description: 'Description task 1'
      }
    ];
    service.getTasks();

    let tasks: Task[] = [];
    service.taskSubject.subscribe(
                        (tasksInService: Task[]) => {
                          tasks = tasksInService;
                          expect(tasks.length).toBe(2);
                          expect(tasks[0].id).toBe(0);
                          expect(tasks[1].id).toBe(1);
                        });

    const req = httpTestingController.match(BASE_URL_API + '/api/maintenancemanagement/tasks/');
    expect(req[0].request.method).toEqual('GET');
    req[0].flush(mockTasks);
  });

  it('US5_A7 - should verify the creation of a new task', () => {
    const mockTask = {
      id: 1,
      name: 'Task 1',
      description: 'Description task 1',
      end_date: '',
      duration: '1d',
      equipment: 1,
      equipment_type: null,
      teams: [1, 2],
      files: null,
      trigger_conditions: null,
      end_conditions: null,
    };

    service.createTask('Task 1', 'Description task 1', '', '1d', 1, null, [1, 2], null, null, null).subscribe(
      (task) => {
        expect(task.name).toBe('Task 1');
        expect(task.description).toBe('Description task 1');
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/');
    expect(req.request.method).toEqual('POST');
    req.flush(mockTask);
  });

  it('US5_A8 - should verify the update of a task in database', () => {
    const mockTask = {
      id: 1,
      name: 'Task 1',
      description: 'Description task 1'
    };

    const newTask = new Task(1,
      'Task 1',
      'Description');
    service.updateTask(newTask.id, newTask).subscribe(
      task => {
        expect(task.id).toBe(1);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/' + newTask.id + '/');
    expect(req.request.method).toEqual('PUT');
    req.flush(mockTask);
  });

  it('US5_A9 - should verify the deletion of a task in database', () => {
    service.deleteTask(1).subscribe();

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/1/');
    expect(req.request.method).toEqual('DELETE');
  });

  it('should verify the addition of  team to a task', () => {
    service.addTeamToTask(1, 1).subscribe();

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/addteamtotask');
    expect(req.request.method).toEqual('POST');
  });

  it('should verify the removal of a team from a task', () => {
    service.removeTeamFromTask(1, 1).subscribe();

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/addteamtotask');
    expect(req.request.method).toEqual('PUT');
  });
});
