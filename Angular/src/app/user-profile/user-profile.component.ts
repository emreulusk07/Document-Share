import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileClass } from '../models/fileClass';
import { RegisterUser } from '../models/registerUser';
import { AuthService } from '../services/auth.service';
import { DocumentService } from '../services/document.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [AuthService]
})
export class UserProfileComponent implements OnInit {

  searchText:string="";
  currentUser: string = "";
  users: RegisterUser[]= [];
  loginUser:RegisterUser;
  loginUserId:string = "";
  files: FileClass[]= [];
  file: FileClass;
  
  constructor(private fileService: DocumentService, private activatedRoute:ActivatedRoute, private authService:AuthService) { 
    this.loginUser = {
      userName: ""
    } as RegisterUser;
    this.file = {
      name: "",
      path: ""
    } as FileClass;
  }

  ngOnInit(): void {
    this.authService.getUsers().subscribe((data: RegisterUser[]) => {
      this.users = data;
      console.log(data);
      console.log("controlll222");
    });
    this.activatedRoute.params.subscribe(params => {
      console.log("ngOnInit "+localStorage.getItem("loginUserId"));
      this.getUserById(""+localStorage.getItem("loginUserId"));
    });
    this.fileService.GetFilteredFiles(""+localStorage.getItem("loginUserId")).subscribe((data: FileClass[]) => {
      this.files = data;
      console.log(data);
      console.log("controllllllfile");
    });
  }

  getUserById(userId:string) {
    this.authService.getUserById(userId).subscribe(data => {
      console.log(data);
      console.log("xxxx"+data.id);
      this.loginUser = data;
      if(localStorage.getItem("loginUserId") === data.id) {
        this.loginUserId = data.id;
      } 
      //this.getBidId = data.id.toString();
    })
  }

  showUser(a: string){
    console.log("controllshow");
    console.log(a);
    this.currentUser = a;
  }

  downloadMyFile(id: number, contentType: string) {
    this.fileService.downloadFile(id, contentType);
    console.log("CT: "+contentType);
  }

}
