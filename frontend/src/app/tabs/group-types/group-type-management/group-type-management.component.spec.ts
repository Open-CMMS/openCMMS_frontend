import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTypeManagementComponent } from './group-type-management.component';

describe('GroupTypeManagementComponent', () => {
  let component: GroupTypeManagementComponent;
  let fixture: ComponentFixture<GroupTypeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTypeManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
