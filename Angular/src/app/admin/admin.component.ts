import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileClass } from '../models/fileClass';
import { LoginUser } from '../models/loginUser';
import { RegisterUser } from '../models/registerUser';
import { AdminService } from '../services/admin.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styles: [
  ],
  providers: [AdminService]
})
export class AdminComponent implements OnInit {

  path = "http://localhost:7623/api/admin";
  loginForm:FormGroup;
  loginUser:LoginUser;
  files: FileClass[] = [];
  file: FileClass;
  users: RegisterUser[] = [];
  user: RegisterUser;
  invalidLogin = true;
  currentSelect: string = "userList";

  constructor(private adminService:AdminService, private formBuilder:FormBuilder, private alertifyService:AlertifyService) {
    this.loginUser = {
      userName: "",
      password: ""
    } as LoginUser;
    this.file = {
      name: "",
      path: ""
    } as FileClass;
    this.user = {
      userName: "",
    } as RegisterUser;
    this.loginForm = this.createLoginForm();
  }

  ngOnInit(): void {
  }

  showBid(a: string){
    this.currentSelect = a;
  }

  createLoginForm() {
    return this.loginForm = this.formBuilder.group({
      userName: ["", Validators.required],
      password:  ["", [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
    }
    )
  }

  /*
  adminLogin() {
    if(this.loginForm.valid) {
      this.loginUser = Object.assign({}, this.loginForm.value); // loginForm geçerliyse this.registerForm.value, {}'a yerleşir.
      let headers = new HttpHeaders();
    headers = headers.append("Content-Type","application/json");
    // loginUser icin kayıt yapılır. headers için headers gönderim şekli de bu şekildedir.
    // ve login olan kullanıcı için subscribe içindeki işlemler gerçekleştirilir.
    this.httpClient.post<any>(this.path + "/login", this.loginUser, {headers:headers}).subscribe(data => {
      this.invalidLogin = false;
      this.loginUser.id = data.id;
      console.log('asdsad', this.loginUser.id, this.loginUser.userName);
      this.authService.saveToken(data.token);
      this.authService.saveUserId(this.loginUser.id);
      this.authService.userToken = data.token;
             //this.decodeToken = this.jwtHelper.decodeToken(data.token.toString());
      //this.alertifyService.success("Sisteme giriş gerçekleşti.");
      console.log("Sisteme giriş gerçekleşti.");
      this.router.navigateByUrl('/file');
    }, err=> {
      this.invalidLogin = true;
      console.log(err)
    });
    }
    //this.authService.login(this.loginUser);
  }
  */

  deleteUser(userId:string) {
    console.log("silllllll");
    this.adminService.deleteUser(userId).subscribe((data: RegisterUser[]) => {
      this.users = data;
      console.log(data);
      console.log("admin user list");
      this.alertifyService.success(userId + " id'li kullanıcı silindi.");
    });
  }

  getUsers() {
    this.adminService.getUsers().subscribe((data: RegisterUser[]) => {
      this.users = data;
      console.log(data);
      console.log("admin user list");
    });
  }

  getFiles() {
    this.adminService.getFiles().subscribe((data: FileClass[]) => {
      this.files = data;
      console.log(data);
      console.log("admin file list");
    });
  }

  adminConfirmed(file:FileClass) {
    console.log("onayy");
    this.adminService.adminConfirmed(file).subscribe((data: FileClass[]) => {
      console.log("onayy iç");
      this.files = data;
      let data2 = JSON.parse(JSON.stringify(data));
      console.log("backend MESAJOn"+JSON.parse(JSON.stringify(data)));
      console.log("backend MESAJ"+data2);
      console.log("dataaa:"+data2);
      console.log("admin file listt");
      this.alertifyService.success("Admin dosya onaylama işlemi başarılı");
    }, err=> {
      this.alertifyService.error("Admin dosya onaylama işlemi başarısız");
      console.log(err)});
  }

  adminDenied(file:FileClass) {
    console.log("onayy");
    this.adminService.adminDenied(file).subscribe((data: FileClass[]) => {
      this.files = data;
      console.log(data.values.toString());
      console.log("data:"+data);
      console.log("admin file listt");
      this.alertifyService.success("Admin dosya reddetme işlemi başarılı");
    }, err=> {
      this.alertifyService.success("Admin dosya reddetme işlemi başarılı");
      console.log(err)});
  }

}

