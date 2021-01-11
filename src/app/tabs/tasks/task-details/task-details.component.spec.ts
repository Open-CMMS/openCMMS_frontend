import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsComponent } from './task-details.component';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('TaskDetailsComponent', () => {
  let component: TaskDetailsComponent;
  let fixture: ComponentFixture<TaskDetailsComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskDetailsComponent ],
      imports: [ ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('US5_A3 - should create', () => {
    expect(component).toBeTruthy();
  });
});
