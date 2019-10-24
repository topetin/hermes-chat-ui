import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoMainComponent } from './bo-main.component';

describe('BoMainComponent', () => {
  let component: BoMainComponent;
  let fixture: ComponentFixture<BoMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
