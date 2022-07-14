import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-send-change-password',
  templateUrl: './send-change-password.component.html',
  styleUrls: ['./send-change-password.component.css']
})
export class SendChangePasswordComponent implements OnInit {

  sendChangePasswordForm:FormGroup;
  registerUser:any={};

  constructor(private authService:AuthService, private formBuilder:FormBuilder) { 
    this.sendChangePasswordForm = this.createSendChangePasswordForm();
  }

  ngOnInit(): void {
  }

  createSendChangePasswordForm() {
    return this.sendChangePasswordForm = this.formBuilder.group({
      email: ["", Validators.required],
      password:  ["", [Validators.required, Validators.minLength(5), Validators.maxLength(12)]],
      confirmPassword: ["", Validators.required]
    },
    {validator: this.passwordMatchValidator} // custom validation oluşturduk. böylece kendi validation kurallarımızı da belirleriz.
    )
  }

  passwordMatchValidator(g:FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : {misMatch:true}
  }

  sendChangePassword() {
    console.log("olduuu");
    if(this.sendChangePasswordForm.valid) {
      this.registerUser = Object.assign({}, this.sendChangePasswordForm.value);
      this.authService.sendChangePassword(this.registerUser);
    }
  }

}
