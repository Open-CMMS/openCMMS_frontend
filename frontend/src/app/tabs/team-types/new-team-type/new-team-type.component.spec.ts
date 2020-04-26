import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTeamTypeComponent } from './new-team-type.component';

describe('NewTeamTypeComponent', () => {
  let component: NewTeamTypeComponent;
  let fixture: ComponentFixture<NewTeamTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTeamTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTeamTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
