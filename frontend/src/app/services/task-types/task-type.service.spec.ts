import { TestBed } from '@angular/core/testing';

import { TaskTypeService } from './task-type.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { TaskType } from 'src/app/models/task-type';

describe('TaskTypeService', () => {
  let service: TaskTypeService;
  const BASE_URL_API = environment.baseUrl;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ TaskTypeService ],
      imports: [ HttpClientTestingModule ]});

    service = TestBed.inject(TaskTypeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    const mockTaskTypes = [
      {
        id: 0,
        name: 'TaskType 1',
        fields: [1, 3],
        tasks: [1, 2]
      },
      {
        id: 1,
        name: 'TaskType 2',
        fields: [3, 4],
        tasks: [3]
      }
    ];

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasktypes/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockTaskTypes);
  });

  it('should verify the parameters and content of the task type get action', () => {
    const mockTaskTypes = [
      {
        id: 0,
        name: 'TaskType 1',
        fields: [1, 3],
        tasks: [1, 2]
      },
      {
        id: 1,
        name: 'TaskType 2',
        fields: [3, 4],
        tasks: [3]
      }
    ];
    service.getTaskTypes();

    let taskTypes: TaskType[] = [];
    service.task_types_subject.subscribe(
                        (taskTypesInService: TaskType[]) => {
                          taskTypes = taskTypesInService;
                          expect(taskTypes.length).toBe(2);
                          expect(taskTypes[0].id).toBe(0);
                          expect(taskTypes[0].name).toBe('TaskType 1');
                          expect(taskTypes[0].fields.length).toBe(2);
                          expect(taskTypes[0].fields[0]).toBe(1);
                          expect(taskTypes[0].fields[1]).toBe(3);
                          expect(taskTypes[0].tasks.length).toBe(2);
                          expect(taskTypes[0].tasks[0]).toBe(1);
                          expect(taskTypes[0].tasks[1]).toBe(2);

                          expect(taskTypes[1].id).toBe(1);
                          expect(taskTypes[1].name).toBe('TaskType 2');
                          expect(taskTypes[1].tasks.length).toBe(1);
                        });

    const req = httpTestingController.match(BASE_URL_API + '/api/maintenancemanagement/tasktypes/');
    expect(req[0].request.method).toEqual('GET');
    expect(req[1].request.method).toEqual('GET');
    req[1].flush(mockTaskTypes);
  });

  it('should verify the parameters and content of the task type by id GET request', () => {
    const mockTaskType = {
        id: 1,
        name: 'TaskType 1',
        fields: [1, 3],
        tasks: [1, 2]
      };
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasktypes/');
    service.getTaskType(1).subscribe((taskType: TaskType) => {
      expect(taskType.name).toBe('TaskType 1');
      expect(taskType.fields.length).toBe(2);
      expect(taskType.fields[0]).toBe(1);
      expect(taskType.fields[1]).toBe(3);
      expect(taskType.tasks.length).toBe(2);
      expect(taskType.tasks[0]).toBe(1);
      expect(taskType.tasks[1]).toBe(2);
    });

    const req2 = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasktypes/1/');
    expect(req2.request.method).toEqual('GET');
    req2.flush(mockTaskType);
  });

  it('should verify the creation of a new task type', () => {
    const mockTaskType = {
        id: 1,
        name: 'TaskType 2',
        fields: [1],
        tasks: []
      };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasktypes/');
    const newTaskType = new TaskType(1, 'TaskTytpe 2', [1], []);
    service.createTaskType(newTaskType).subscribe(
      taskType => {
        expect(taskType.name).toBe('TaskType 2');
        expect(taskType.fields.length).toBe(1);
        expect(taskType.fields[0]).toBe(1);
        expect(taskType.tasks).toEqual([]);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasktypes/');
    expect(req.request.method).toEqual('POST');
    req.flush(mockTaskType);
  });

  it('should verify the update of a task type in database', () => {
    const mockTaskType = {
        id: 1,
        name: 'TaskType 2',
        fields: [2],
        tasks: []
    };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasktypes/');
    const newTaskType = new TaskType(1, 'TaskType 2', [2], []);
    service.updateTaskType(newTaskType).subscribe(
      taskType => {
        expect(taskType.name).toBe('TaskType 2');
        expect(taskType.fields.length).toBe(1);
        expect(taskType.fields[0]).toBe(2);
        expect(taskType.tasks).toEqual([]);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasktypes/' + newTaskType.id + '/');
    expect(req.request.method).toEqual('PUT');
    req.flush(mockTaskType);
  });

  it('should verify the deletion of a task type in database', () => {
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasktypes/');
    service.deleteTaskType(1).subscribe();

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasktypes/1/');
    expect(req.request.method).toEqual('DELETE');
  });
});
