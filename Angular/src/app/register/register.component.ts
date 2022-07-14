import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { __assign } from 'tslib';
import { RegisterUser } from '../models/registerUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  users: RegisterUser[]= [];
  registerForm:FormGroup;
  registerUser:any={};
  constructor(private authService:AuthService, private formBuilder:FormBuilder) {
    this.registerForm = this.createRegisterForm();
  }

  ngOnInit(): void {
    this.authService.getUsers().subscribe((data: RegisterUser[]) => {
      this.users = data;
      console.log(data);
      console.log("controlll222");
    });
  }

  createRegisterForm() {
    return this.registerForm = this.formBuilder.group({
      userName: ["", Validators.required],
      password:  ["", [Validators.required, Validators.minLength(5), Validators.maxLength(12)]],
      confirmPassword: ["", Validators.required],
      email: ["", Validators.required]
    },
    {validator: this.passwordMatchValidator} // custom validation oluşturduk. böylece kendi validation kurallarımızı da belirleriz.
    )
  }

  passwordMatchValidator(g:FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : {misMatch:true}
  }

  register() {
    if(this.registerForm.valid) {
      this.registerUser = Object.assign({}, this.registerForm.value); // registerForm geçerliyse this.registerForm.value, {}'a yerleşir.
      this.authService.register(this.registerUser);
    }
  }
}
