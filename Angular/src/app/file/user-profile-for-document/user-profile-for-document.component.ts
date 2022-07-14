import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileClass } from 'src/app/models/fileClass';
import { RegisterUser } from 'src/app/models/registerUser';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-user-profile-for-document',
  templateUrl: './user-profile-for-document.component.html',
  styleUrls: ['./user-profile-for-document.component.css']
})
export class UserProfileForDocumentComponent implements OnInit {

  files: FileClass[]= [];
  loginUser:RegisterUser;
  loginUserId:string = "";
  userId:string = "";

  constructor(private fileService: DocumentService, private activatedRoute:ActivatedRoute, private authService:AuthService) { 
    this.loginUser = {
      userName: ""
    } as RegisterUser;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params["userId"];
      console.log("adsaadasfasfasf");
      this.getUserById(params["userId"]);
    })
    this.fileService.GetFilteredFiles(""+this.userId).subscribe((data: FileClass[]) => {
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
    })
  }

}
