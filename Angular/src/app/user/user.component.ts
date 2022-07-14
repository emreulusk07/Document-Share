import { Component, OnInit } from '@angular/core';
import { RegisterUser } from '../models/registerUser';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [AuthService]
})
export class UserComponent implements OnInit {

  searchText:string="";
  currentUser: string = "";
  users: RegisterUser[]= [];

  constructor(private authService:AuthService) { 
  }

  ngOnInit(): void {
    this.authService.getUsers().subscribe((data: RegisterUser[]) => {
      this.users = data;
      console.log(data);
      console.log("controlll222");
    });
  }

  showUser(a: string){
    console.log("controllshow");
    console.log(a);
    this.currentUser = a;
  }

}
