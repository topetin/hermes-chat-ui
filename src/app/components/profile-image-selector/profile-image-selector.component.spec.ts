import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImageSelectorComponent } from './profile-image-selector.component';

describe('ProfileImageSelectorComponent', () => {
  let component: ProfileImageSelectorComponent;
  let fixture: ComponentFixture<ProfileImageSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileImageSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileImageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
