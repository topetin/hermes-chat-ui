import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPayComponent } from './success-pay.component';

describe('SuccessPayComponent', () => {
  let component: SuccessPayComponent;
  let fixture: ComponentFixture<SuccessPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
