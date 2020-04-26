import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTypeDetailsComponent } from './team-type-details.component';

describe('TeamTypeDetailsComponent', () => {
  let component: TeamTypeDetailsComponent;
  let fixture: ComponentFixture<TeamTypeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamTypeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
