import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DataProviderListComponent } from './data-provider-list.component';

describe('DataProviderListComponent', () => {
  let component: DataProviderListComponent;
  let fixture: ComponentFixture<DataProviderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProviderListComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProviderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
