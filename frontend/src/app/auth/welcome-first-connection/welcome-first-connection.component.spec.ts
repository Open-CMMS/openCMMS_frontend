import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeFirstConnectionComponent } from './welcome-first-connection.component';

describe('WelcomeFirstConnectionComponent', () => {
  let component: WelcomeFirstConnectionComponent;
  let fixture: ComponentFixture<WelcomeFirstConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeFirstConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeFirstConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
