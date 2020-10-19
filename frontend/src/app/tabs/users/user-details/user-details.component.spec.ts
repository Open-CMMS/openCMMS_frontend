import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsComponent } from './user-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserProfile } from 'src/app/models/user-profile';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let httpTestingController: HttpTestingController;
  const BASE_URL_API = environment.baseUrl;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailsComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule]
    })
    .compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    router.initialNavigation();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should delete the user', () => {
    component.user = new UserProfile(6, 'test', 'test', 'test', 'test', 'test', 0, false);
    component.onDeleteUser();

    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/users/undefined/');
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/users/6/');
    expect(req.request.method).toBe('DELETE');
    httpTestingController.verify();
  });

  it('should update the user', () => {
    component.user = new UserProfile(6, 'test', 'test', 'test', 'test', 'test', 0, false);
    component.initForm();
    component.onModifyUser();

    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/users/undefined/');
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/users/6/');
    expect(req.request.method).toBe('PUT');
    httpTestingController.verify();
  });

  it('should init the forms', () => {
    component.user = new UserProfile(6, 'test', 'test', 'test', 'test', 'test', 0, false);
    component.initForm();
    expect(component.userUpdateForm.contains('email')).toBe(true);
    expect(component.userUpdateForm.contains('lastName')).toBe(true);
    expect(component.userUpdateForm.contains('firstName')).toBe(true);


    expect(component.userUpdateForm.value.email).toBe(component.user.email);
    expect(component.userUpdateForm.value.firstName).toBe(component.user.first_name);
    expect(component.userUpdateForm.value.lastName).toBe(component.user.last_name);
  });

});
