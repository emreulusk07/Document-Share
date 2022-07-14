import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginUser } from '../models/loginUser';
import { RegisterUser } from '../models/registerUser';
import { AlertifyService } from './alertify.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ForgotPassword } from '../models/forgotPassword';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  path = "http://localhost:7623/api/auth";
  userToken:any;
  decodeToken:any;
  TOKEN_KEY = "token";
  ID = "";
  isLoggedIn = false;
  loginUser:LoginUser;
  code:string = "";
  registerUserId:string = "";
         //jwtHelper:JwtHelper = new JwtHelper();

  constructor(private jwtHelper:JwtHelperService, private httpClient:HttpClient, private router:Router, private alertifyService:AlertifyService) { this.loginUser = {
    userName: "",
    password: ""
  } as LoginUser;}

  login() {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type","application/json");
    // loginUser icin kayıt yapılır. headers için headers gönderim şekli de bu şekildedir.
    // ve login olan kullanıcı için subscribe içindeki işlemler gerçekleştirilir.
    this.httpClient.post<any>(this.path + "/login", this.loginUser, {headers:headers}).subscribe(data => {
      this.loginUser.id = data.id;

      console.log('asdsad*********************', this.loginUser.id, this.loginUser.userName);
      this.saveToken(data.token);
      this.saveUserId(this.loginUser.id);
      this.userToken = data.token;
             //this.decodeToken = this.jwtHelper.decodeToken(data.token.toString());
      this.alertifyService.success("Sisteme giriş gerçekleşti.");
      console.log("Sisteme giriş gerçekleştiiiiiii.");
      this.router.navigateByUrl('/file');
    }, err=> {
      this.alertifyService.error("Sisteme giriş başarısız.");
      console.log(err)});
  }

  userTokendd(temp:any) {
    this.userToken = temp;
  }

  // localStorage'a token kayıt işlemi
  saveToken(token:any) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  saveUserId(id:any) {
    console.log('Local storage userId: ', id);
    localStorage.setItem("loginUserId", id);
    this.ID = id;
  }

  getUserID() {
    return this.ID;
  }

  register(registerUser:RegisterUser) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type","application/json");
    let connection = this.httpClient.post(this.path + "/register", registerUser, {headers:headers});
    connection.subscribe(data => {
      this.router.navigateByUrl('/file');
      //this.alertifyService.success("Kullanıcı kaydı gerçekleşti.");
    });
    connection.subscribe((event: any) => {
      this.code = event.code;
      this.registerUserId = event.id;
      console.log("kullanıcı kaydı gerçekleşti.");
      this.router.navigateByUrl('/file');
      //this.alertifyService.success("Kullanıcı kaydı gerçekleşti.");
    }, err=> {
      this.alertifyService.success("Kullanıcı kaydı gerçekleşti. Mailinizi kontrol ediniz.");
      console.log(err)})
  }

  changePassword(email:string) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type","application/json");
    let connection = this.httpClient.post(this.path + "/sendchangepasswordmail", email, {headers:headers});
    connection.subscribe(data => {
      this.router.navigateByUrl('/file');
      //this.alertifyService.success("Mailinizdeki şifre değiştirme linkine tıklayınız.");
    }, err=> {
      console.log(err)});
      this.alertifyService.success("Mailinizdeki şifre değiştirme linkine tıklayınız.");
      //this.alertifyService.error("Mail gönderme işlemi başarısız.");
  }

  sendChangePassword(registerUser:RegisterUser) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type","application/json");
    let connection = this.httpClient.post(this.path + "/changepassword", registerUser, {headers:headers});
    connection.subscribe(data => {
      this.router.navigateByUrl('/file');
      this.alertifyService.success("Şifre değiştirme gerçekleşti.");
    }, err=> {
      this.alertifyService.success("Şifre değiştirme gerçekleşti.");
      console.log(err)});
  }

  logOut() {
    return this.httpClient.get(this.path + "/logout").subscribe(data => {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem("loginUserId");
      
      this.router.navigateByUrl('/file');
      this.alertifyService.error("Sistemden çıkış gerçekleşti.");
      console.log("Sistemden çıkış gerçekleşti.");
    })
  }

  // kullanıcı sistemde login durumda mı
  loggedIn() {
    if(localStorage.getItem("token") === null) {
      return false;
    } else {
      return true;
    }
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // mevcut kullanıcı
  /*getCurrenUserId() {
    return this.jwtHelper.decodeToken(this.TOKEN_KEY).nameid
  }*/

  getUsers():Observable<RegisterUser[]>{
    // gelen data'lar path'e gönderilir.
    return this.httpClient.get<RegisterUser[]>(this.path);
  }

  GetUsersCount() {
    return this.httpClient.get<RegisterUser[]>(this.path+"/count");
  }

  getUserById(userId: string):Observable<RegisterUser>{
    // gelen data path'e gönderilir.
    console.log("adsa"+userId);
    return this.httpClient.get<RegisterUser>(this.path+"/detail/?id="+userId)
  }
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem("token");

    if(token && !this.jwtHelper.isTokenExpired(token)) {
      let roles = next.data['permittedRoles'] as Array<string>;
      console.log("canActivate girdiiiii"+roles);
      if(roles) {
        if(this.roleMatch(roles)==false) {
          //console.log("true mi false mi: "+this.roleMatch(roles));
          console.log("ifff rolmatch girdiiiii"+roles);
          //this.router.navigateByUrl('/admin');
          return true;
        } else {
          //console.log("true mi false mi: "+this.roleMatch(roles));
          console.log("elseee rolmatch girdiiiii"+roles);
          this.router.navigateByUrl('/forbidden');
          return false;
        }
      }
      console.log("roles if e girdmedi"+roles);
      return true;
    }
    this.router.navigate(["login"]);
    return false;
  }

  setSession() {
    const a = localStorage.getItem("token");
    console.log(a) // is now a number
    return a;
  }

  roleMatch(allowedRoles:any): boolean {
    //const token = this.setSession;
    console.log("rolematch girdii");
    var isMatch = true;
    this.userToken = this.token;
    console.log("user token: "+this.userToken);
    var payLoad = JSON.parse(window.atob(this.userToken?.split('.')[1]));
    console.log("payload: "+payLoad.role);
    var userRole = payLoad.role;
    console.log("user role: "+userRole);
    for(let element of allowedRoles) {
      console.log("element and user role: "+element+" - "+userRole);
      if(""+userRole == ""+element) {
        console.log("ESITLER");
        isMatch = true;
        return false;
      }
      console.log("ESIT DEGILLER");
    }
    return isMatch;
  }


  confirmEmail() {
    console.log("Mail onaylama gerçekleştiiiii");
    const formData = new FormData();
    formData.append("code", this.code);
    formData.append("id", this.registerUserId);
    console.log("Mail onaylama gerçekleştiiiii"+ this.code+ this.registerUserId);
    return this.httpClient.post<any>(this.path + "/confirmemail", formData).subscribe(data => {
      console.log("Mail onaylama gerçekleşti.girdi");
      //this.router.navigateByUrl('/login');
    }, err=> {
      console.log(err)
    });
  }
  
  // Send forgot password email
  forgetpassword(email: string) {
    return this.httpClient.get(this.path + '/ForgetPassword/' + email).pipe();
  }

}
