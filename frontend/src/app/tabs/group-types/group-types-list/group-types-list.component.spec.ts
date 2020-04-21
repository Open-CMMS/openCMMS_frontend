import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTypesListComponent } from './group-types-list.component';

describe('GroupTypesListComponent', () => {
  let component: GroupTypesListComponent;
  let fixture: ComponentFixture<GroupTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
