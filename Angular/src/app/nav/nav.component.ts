import { Component, OnInit } from '@angular/core';
import { LoginUser } from '../models/loginUser';
import { RegisterUser } from '../models/registerUser';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [AuthService]
})
export class NavComponent implements OnInit {

  loginUser:LoginUser;
  users: RegisterUser[]= [];
  searchText:string="";
  currentUser: string = "continueBid";

  constructor(private authService:AuthService) { 
    this.loginUser = {
      userName: "",
      password: ""
    } as LoginUser;
  }

  ngOnInit(): void {
    this.authService.getUsers().subscribe((data: RegisterUser[]) => {
      this.users = data;
      console.log(data);
      console.log("controlll222");
    });
  }

  login() {
    this.authService.login();
  }

  logOut() {
    this.authService.logOut();
  }

  public get isAuthenticated() {
    return this.authService.loggedIn();
  }

  showUser(a: string){
    this.currentUser = a;

  }

}
