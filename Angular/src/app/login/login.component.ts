import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUser } from '../models/loginUser';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;
  loginUser:LoginUser;
  path = "http://localhost:7623/api/auth";
  invalidLogin = true;
  constructor(private alertifyService:AlertifyService, private authService:AuthService, private formBuilder:FormBuilder, private httpClient:HttpClient, private router:Router) {
    this.loginUser = {
      userName: "",
      password: ""
    } as LoginUser;
    this.loginForm = this.createLoginForm();
  }

  ngOnInit(): void {
  }

  createLoginForm() {
    return this.loginForm = this.formBuilder.group({
      userName: ["", Validators.required],
      password:  ["", [Validators.required, Validators.minLength(5), Validators.maxLength(12)]],
    }
    )
  }

  login() {
    if(this.loginForm.valid) {
      this.loginUser = Object.assign({}, this.loginForm.value); // loginForm geçerliyse this.registerForm.value, {}'a yerleşir.
      let headers = new HttpHeaders();
    headers = headers.append("Content-Type","application/json");
    // loginUser icin kayıt yapılır. headers için headers gönderim şekli de bu şekildedir.
    // ve login olan kullanıcı için subscribe içindeki işlemler gerçekleştirilir.
    this.httpClient.post<any>(this.path + "/login", this.loginUser, {headers:headers}).subscribe(data => {
      this.invalidLogin = false;
      this.loginUser.id = data.id;
      //this.authService.isLoggedIn = data.result.succeeded;
      console.log('asdsadeee', this.loginUser.id, this.loginUser.userName);
      this.authService.saveToken(data.token);
      this.authService.saveUserId(this.loginUser.id);
      this.authService.userTokendd(data.token);//this.authService.userToken = data.token;
      
             //this.decodeToken = this.jwtHelper.decodeToken(data.token.toString());
      this.alertifyService.success("Sisteme giriş gerçekleşti.");
      
      this.router.navigateByUrl('/file');
      console.log("Sisteme giriş gerçekleşti.");
    }, err=> {
      this.invalidLogin = true;
      this.alertifyService.error("Sisteme giriş başarısız.");
      console.log(err)
    });
    }
    //this.authService.login(this.loginUser);
  }

  logOut() {
    this.authService.logOut();
  }

  get isAuthenticated() {
    return this.authService.loggedIn();
  }

  confirmEmail() {
    console.log("Mail onaylama gerçekleşti.11");
    this.authService.confirmEmail();
    console.log("Mail onaylama gerçekleşti22.");
  }

}
