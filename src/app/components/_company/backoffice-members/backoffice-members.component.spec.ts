import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeMembersComponent } from './backoffice-members.component';

describe('BackofficeMembersComponent', () => {
  let component: BackofficeMembersComponent;
  let fixture: ComponentFixture<BackofficeMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
