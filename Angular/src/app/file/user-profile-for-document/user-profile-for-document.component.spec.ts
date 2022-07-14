import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileForDocumentComponent } from './user-profile-for-document.component';

describe('UserProfileForDocumentComponent', () => {
  let component: UserProfileForDocumentComponent;
  let fixture: ComponentFixture<UserProfileForDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProfileForDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileForDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
