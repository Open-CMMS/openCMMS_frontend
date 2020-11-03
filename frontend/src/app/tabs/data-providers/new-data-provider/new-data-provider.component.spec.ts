import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDataProviderComponent } from './new-data-provider.component';

describe('NewDataProviderComponent', () => {
  let component: NewDataProviderComponent;
  let fixture: ComponentFixture<NewDataProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDataProviderComponent ]
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
