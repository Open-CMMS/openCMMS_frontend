import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { NewDataProviderComponent } from './new-data-provider.component';

describe('NewDataProviderComponent', () => {
  let component: NewDataProviderComponent;
  let fixture: ComponentFixture<NewDataProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDataProviderComponent ],
      imports: [ ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDataProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
