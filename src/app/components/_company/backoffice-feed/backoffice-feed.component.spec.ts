import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeFeedComponent } from './backoffice-feed.component';

describe('BackofficeFeedComponent', () => {
  let component: BackofficeFeedComponent;
  let fixture: ComponentFixture<BackofficeFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
