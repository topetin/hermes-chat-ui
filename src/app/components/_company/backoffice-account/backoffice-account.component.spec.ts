import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeAccountComponent } from './backoffice-account.component';

describe('BackofficeAccountComponent', () => {
  let component: BackofficeAccountComponent;
  let fixture: ComponentFixture<BackofficeAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
