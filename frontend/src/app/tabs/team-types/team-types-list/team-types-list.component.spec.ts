import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTypesListComponent } from './team-types-list.component';

describe('TeamTypesListComponent', () => {
  let component: TeamTypesListComponent;
  let fixture: ComponentFixture<TeamTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamTypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
