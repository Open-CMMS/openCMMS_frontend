import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksListComponent } from './tasks-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FilterPipe } from './utils/search-filter.pipe';

describe('TasksListComponent', () => {
  let component: TasksListComponent;
  let fixture: ComponentFixture<TasksListComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasksListComponent, FilterPipe ],
      imports: [ RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
