import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm:FormGroup;
  email:any={};

  constructor(private authService:AuthService, private formBuilder:FormBuilder) { 
    this.changePasswordForm = this.createChangePasswordForm();
  }

  ngOnInit(): void {
  }

  createChangePasswordForm() {
    return this.changePasswordForm = this.formBuilder.group({
      email: ["", Validators.required]
    }
    )
  }

  changePassword() {
    if(this.changePasswordForm.valid) {
      this.email = Object.assign({}, this.changePasswordForm.value); // registerForm geçerliyse this.registerForm.value, {}'a yerleşir.
      this.authService.changePassword(this.email);
    }
  }

}
