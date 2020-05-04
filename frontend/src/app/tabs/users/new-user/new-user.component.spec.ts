import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserComponent } from './new-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment.prod';

describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;
  let httpTestingController: HttpTestingController;
  const BASE_URL_API = environment.baseUrl;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUserComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule]
    })
    .compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.initForm();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize a form', () => {
    expect(component.createForm.contains('firstName')).toBe(true);
    expect(component.createForm.contains('lastName')).toBe(true);
    expect(component.createForm.contains('email')).toBe(true);
    expect(component.createForm.contains('password')).toBe(true);
    expect(component.createForm.contains('confPassword')).toBe(true);
  });

});
