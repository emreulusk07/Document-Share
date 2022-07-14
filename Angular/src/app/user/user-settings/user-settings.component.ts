import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  forgotForm:FormGroup;

  constructor(private formBuilder:FormBuilder, private activatedRoute: ActivatedRoute, private authService: AuthService, private alertify: AlertifyService, private router: Router) {
    this.forgotForm = this.createForgotForm();
  }

  ngOnInit(): void {
    
  }

  createForgotForm() {
    return this.forgotForm = this.formBuilder.group({
      email: ["", Validators.required]
    }
    )
  }

  requestPassword() {
    console.log("ghklghgkj");
    var email = this.forgotForm.value.email;
    console.log("email :: "+email);
    if(email !== null || email !== "") {
      console.log("girrdi "+email);
      this.authService.forgetpassword(email).subscribe(x => {
        console.log("başarı");
      }, ex=>console.log(ex));
    }
  }

}
