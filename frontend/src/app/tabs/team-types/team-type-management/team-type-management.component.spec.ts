import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTypeManagementComponent } from './team-type-management.component';

describe('TeamTypeManagementComponent', () => {
  let component: TeamTypeManagementComponent;
  let fixture: ComponentFixture<TeamTypeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamTypeManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
