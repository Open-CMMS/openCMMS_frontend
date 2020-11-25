import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DataProviderDetailsComponent } from './data-provider-details.component';

describe('DataProviderDetailsComponent', () => {
  let component: DataProviderDetailsComponent;
  let fixture: ComponentFixture<DataProviderDetailsComponent>;
  // let httpTestingController: HttpTestingController;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProviderDetailsComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule]
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
