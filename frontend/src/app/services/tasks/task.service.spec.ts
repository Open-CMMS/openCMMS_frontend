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

  it('should be created', () => {
    expect(service).toBeTruthy();
    const mockTasks = [
      {
        id: 0,
        name: 'Task 0',
        description: 'Description task 0',
        end_date: '2020-05-05',
        time: '',
        is_template: true,
        equipment: 0,
        teams: [1, 2],
        task_type: 0,
        files: [1, 2],
        over: true
      },
      {
        id: 1,
        name: 'Task 1',
        description: 'Description task 1',
        end_date: '2020-05-05',
        time: '',
        is_template: true,
        equipment: 0,
        teams: [1, 2],
        task_type: 0,
        files: [1, 2],
        over: true
      }
    ];

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockTasks);
  });

  it('should verify the parameters and content of the task get action', () => {
    const mockTasks = [
      {
        id: 0,
        name: 'Task 0',
        description: 'Description task 0',
        end_date: '2020-05-05',
        time: '',
        is_template: true,
        equipment: 0,
        teams: [1, 2],
        task_type: 0,
        files: [1, 2],
        over: true
      },
      {
        id: 1,
        name: 'Task 1',
        description: 'Description task 1',
        end_date: '2020-05-05',
        time: '',
        is_template: true,
        equipment: 0,
        teams: [1, 2],
        task_type: 0,
        files: [1, 2],
        over: true
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
    expect(req[1].request.method).toEqual('GET');
    req[1].flush(mockTasks);
  });

  it('should verify the parameters and content of the task by id GET request', () => {
    const mockTeam = {
      id: 1,
      name: 'Task 1',
      description: 'Description task 1',
      end_date: '2020-05-05',
      time: '',
      is_template: true,
      equipment: 0,
      teams: [1, 2],
      task_type: 0,
      files: [1, 2],
      over: true
    };
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/');
    service.getTask(1).subscribe((task: Task) => {
      expect(task.id).toBe(1);
    });

    const req2 = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/1/');
    expect(req2.request.method).toEqual('GET');
    req2.flush(mockTeam);
  });

  it('should verify the creation of a new task', () => {
    const mockTask = {
      id: 1,
      name: 'Task 1',
      description: 'Description task 1',
      end_date: '2020-05-05',
      time: '',
      is_template: true,
      equipment: 0,
      teams: [1, 2],
      task_type: 0,
      files: [1, 2],
      over: true
    };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/');
    const newTask = new Task(1,
                            'Task 1',
                            'Description',
                            new Date(),
                            new Date(),
                            true,
                            0,
                            [1, 2],
                            0,
                            [1, 2],
                            true);
    service.createTask(newTask).subscribe(
      task => {
        expect(task.id).toBe(1);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/');
    expect(req.request.method).toEqual('POST');
    req.flush(mockTask);
  });

  it('should verify the update of a task in database', () => {
    const mockTask = {
      id: 1,
      name: 'Task 1',
      description: 'Description task 1',
      end_date: '2020-05-05',
      time: '',
      is_template: true,
      equipment: 0,
      teams: [1, 2],
      task_type: 0,
      files: [1, 2],
      over: true
    };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/');
    const newTask = new Task(1,
      'Task 1',
      'Description',
      new Date(),
      new Date(),
      true,
      0,
      [1, 2],
      0,
      [1, 2],
      true);
    service.updateTask(newTask.id, newTask).subscribe(
      task => {
        expect(task.id).toBe(1);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/' + newTask.id + '/');
    expect(req.request.method).toEqual('PUT');
    req.flush(mockTask);
  });

  it('should verify the deletion of a task in database', () => {
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/');
    service.deleteTask(1).subscribe();

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/1/');
    expect(req.request.method).toEqual('DELETE');
  });
});
