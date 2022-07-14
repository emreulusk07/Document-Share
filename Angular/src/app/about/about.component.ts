import { Component, OnInit } from '@angular/core';
import { FileClass } from '../models/fileClass';
import { RegisterUser } from '../models/registerUser';
import { AuthService } from '../services/auth.service';
import { DocumentService } from '../services/document.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  files: FileClass[]= [];
  users: RegisterUser[]= [];

  constructor(private authService:AuthService, private fileService: DocumentService) { }

  ngOnInit(): void {
    this.authService.GetUsersCount().subscribe((data: RegisterUser[]) => {
      this.users = data;
      console.log(data);
      console.log("controlll222");
    });
    this.fileService.GetFilesCount().subscribe((data: FileClass[]) => {
      this.files = data;
      console.log(data);
      console.log("controllllllfile");
    });
  }

}
