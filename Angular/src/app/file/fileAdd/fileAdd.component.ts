import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FileClass } from 'src/app/models/fileClass';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DocumentService } from 'src/app/services/document.service';

import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-fileAdd',
  templateUrl: './fileAdd.component.html',
  styleUrls: ['./fileAdd.component.css'],
  providers: [DocumentService]
})
export class FileAddComponent implements OnInit {

  fileCategorys = ["Bilişim", "Elektrik", "Sağlık", "Sosyal Bilimler"];
  selectedCategory:string = "";
  myFiles:string [] = [];

  //file: File;
  files: FileClass[]= [];
  //fileForm:FormGroup;
  shortLink: string = "";
    loading: boolean = false; // Flag variable
    file: any;
    path2 = "https://file.io";
    path = "http://localhost:7623/api/";
    counter: number = 1;

  constructor(private httpClient:HttpClient, private fileService: DocumentService, private router:Router, private alertifyService:AlertifyService, private jwtHelper:JwtHelperService) {
    this.file = {
    } as FileClass;
    //this.fileForm = this.createFileForm();
  }

  ngOnInit(): void {
    /*this.fileService.Index().subscribe((data: File[]) => {
      this.file = data;
      console.log(data);
    });*/
    this.fileService.getFiles().subscribe((data: FileClass[]) => {
      this.files = data;
      console.log(data);
      console.log("controllllll");
    });
  }

/*
  createFileForm() {
    return this.fileForm = this.formBuilder.group({
      //path: ["", Validators.required]
    }
    )
  }

  filesMethod() {
    if(this.fileForm.valid) {
      this.file = Object.assign({}, this.fileForm.value);
      console.log("islem basarili1");
      //this.addFile(this.file);
      console.log(this.file.name+"");
      console.log("islem basarili2");
    }
  }
*/

// OnClick of button Upload
onUpload() {
  this.file.category = this.selectedCategory;
  console.log("KAYIT BASARILI");
  try {
    console.log("dosya boyut3: "+this.file.length)
    this.fileService.upload(this.file, this.files, this.selectedCategory).subscribe(
      (event: any) => {
          if (typeof (event) === 'object') {
              // Short link via api response
              this.shortLink = event.link;
              this.alertifyService.success("Dosya kaydetme işlemi başarılı.");
              console.log("dosya boyut2: "+this.file.length)
          }
      }, err=> {
        this.alertifyService.error("Dosya kaydetme işlemi başarısız.");
        console.log("dosya boyut: "+this.file.length+"  err++: "+err)
      }
  );
  } catch (error) {
    console.log("catch error: "+error)
  }
  //this.fileService.addFile(this.file);
}


onFileSelected(event:any) {
  //this.selectedFile = <File>event.target.files[0];
  console.log("BOYUT:" + event.target.files[0].length)
  this.file = <FileClass>event.target.files[0];
  console.log("asdasdas"+this.selectedCategory);
}

getFile(event:any) {
  //this.file = <FileClass>event.target.files[0];
  for (var i = 0; i < event.target.files.length; i++) {
    if (event.target.files[i].size > 5242880) {
      console.log(event.target.files[i].name);
      this.alertifyService.error(event.target.files[i].name+" dosyasının boyutu 5MB üstündedir !");
    }
    this.files.push(event.target.files[i]);
    console.log("boooooyuuuuutt: "+event.target.files[i].size)
}
}



isUserAuthenticated() {
  const token = localStorage.getItem("token");

  if(token && !this.jwtHelper.isTokenExpired(token)) {
    return true;
  }
  this.router.navigate(["login"]);
  return false;
}

}
