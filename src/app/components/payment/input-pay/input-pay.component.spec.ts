import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPayComponent } from './input-pay.component';

describe('InputPayComponent', () => {
  let component: InputPayComponent;
  let fixture: ComponentFixture<InputPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
