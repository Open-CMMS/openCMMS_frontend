import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProviderManagementComponent } from './data-provider-management.component';

describe('DataProviderManagementComponent', () => {
  let component: DataProviderManagementComponent;
  let fixture: ComponentFixture<DataProviderManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProviderManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProviderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
