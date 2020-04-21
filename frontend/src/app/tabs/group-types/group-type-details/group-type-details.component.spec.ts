import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTypeDetailsComponent } from './group-type-details.component';

describe('GroupTypeDetailsComponent', () => {
  let component: GroupTypeDetailsComponent;
  let fixture: ComponentFixture<GroupTypeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTypeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
