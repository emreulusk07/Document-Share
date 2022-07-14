import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendChangePasswordComponent } from './send-change-password.component';

describe('SendChangePasswordComponent', () => {
  let component: SendChangePasswordComponent;
  let fixture: ComponentFixture<SendChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendChangePasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
