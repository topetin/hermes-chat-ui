import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeHeaderComponent } from './backoffice-header.component';

describe('BackofficeHeaderComponent', () => {
  let component: BackofficeHeaderComponent;
  let fixture: ComponentFixture<BackofficeHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
