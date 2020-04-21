import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGroupTypeComponent } from './new-group-type.component';

describe('NewGroupTypeComponent', () => {
  let component: NewGroupTypeComponent;
  let fixture: ComponentFixture<NewGroupTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGroupTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGroupTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
