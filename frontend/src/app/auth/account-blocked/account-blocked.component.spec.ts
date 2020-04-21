import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBlockedComponent } from './account-blocked.component';

describe('AccountBlockedComponent', () => {
  let component: AccountBlockedComponent;
  let fixture: ComponentFixture<AccountBlockedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountBlockedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBlockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
