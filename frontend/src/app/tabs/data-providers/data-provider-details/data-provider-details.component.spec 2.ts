import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProviderDetailsComponent } from './data-provider-details.component';

describe('DataProviderDetailsComponent', () => {
  let component: DataProviderDetailsComponent;
  let fixture: ComponentFixture<DataProviderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProviderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProviderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
