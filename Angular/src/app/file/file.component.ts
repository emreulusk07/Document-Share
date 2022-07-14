import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileClass } from '../models/fileClass';
import { DocumentService } from '../services/document.service';
import { saveAs } from 'file-saver';
import { AuthService } from '../services/auth.service';
import { RegisterUser } from '../models/registerUser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommentToDocument } from '../models/commentToDocument';

const MIME_TYPES = {
  pdf: 'application/pdf',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnc.openxmlformats-officedocument.spreadsheetxml.sheet'
}

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css'],
  providers: [DocumentService]
})
export class FileComponent implements OnInit {

  sayi:number = 0;

  fileCategorys = ["(Tümü)", "Bilişim", "Elektrik", "Sağlık", "Sosyal Bilimler"];
  selectedCategory:string = "(Tümü)";
  
  files: FileClass[]= [];
  searchText:string="";
  file: FileClass;
  
  loginUser:RegisterUser;
  loginUserId:string = "";
  commentt: CommentToDocument;

  comment:FormGroup;
  path = "http://localhost:7623/api/files/comment";

  constructor(private httpClient:HttpClient, private formBuilder:FormBuilder, private fileService: DocumentService, private router:Router, private authService:AuthService) { 
    this.file = {
      name: "",
      path: ""
    } as FileClass;
    this.loginUser = {
      userName: ""
    } as RegisterUser;
    this.commentt = {
      commentMessage: ""
    } as CommentToDocument;
    this.comment = this.createComment();
  }

  ngOnInit(): void {
    this.fileService.getFiles().subscribe((data: FileClass[]) => {
      this.files = data;
      console.log(data);
      console.log("controllllllfile");
    });
  }

  createComment() {
    return this.comment = this.formBuilder.group({
      comment: ["", Validators.required]
    }
    )
  }
  
/*
  downloadMyFile(){
    console.log("download");
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.href = this.file.path;
    link.setAttribute('download', this.file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
*/

/*
  downloadMyFile(file: any) {
    console.log("girdi");
    const EXT = file.name.substr(file.name.lastIndexOf('.') + 1);
    this.fileService.downloadFile({ 'filename': file.name}).subscribe(data => {
      saveAs(new Blob([data], {type: "text/plain;charset=utf-8"}), file.name);
    })
  }*/

  getUserById(userId:string) {
    this.authService.getUserById(userId).subscribe(data => {
      console.log(data);
      console.log("xxxx"+data.id);
    })
  }

  downloadMyFile(id: number, contentType: string) {
    this.fileService.downloadFile(id, contentType);
    console.log("CT: "+contentType);
  }

  giveLike(id: number) {

    this.fileService.giveLike(id);
    console.log("like id: "+id);
  }

  searchFile(text: string, category: string) {
    this.fileService.searchFile(this.searchText, this.selectedCategory).subscribe((data: FileClass[]) => {
      this.files = data;
    });
    console.log("seacrh: "+this.searchText);
  }

  allFile() {
    this.searchText = "";
    console.log(""+this.selectedCategory);
    this.fileService.getFiles().subscribe((data: FileClass[]) => {
      this.files = data;
      console.log(data);
      console.log("controllllllfile");
    });
  }

  public get isAuthenticated() {
    return this.authService.loggedIn();
  }


  sendComment(fileId:number) {
    console.log("adwqewq")
    this.httpClient.post(this.path + "/?fileId=" + fileId, { comment: fileId })
.subscribe(data => {
  //this.authService.isLoggedIn = data.result.succeeded;
  console.log('asdsadeee', this.commentt.id, this.commentt.commentMessage);
  console.log("SSistemde yorum yapma gerçekleşti.");
  this.router.navigateByUrl('/file');
}, err=> {
  console.log(err)
});
  }

  senddComment(fileId:number) {
    console.log("asdasf"+fileId+this.comment.valid+this.commentt.commentMessage+this.comment);
    if(this.comment.valid) {
      console.log("asdasf");
      this.commentt = Object.assign({}, this.comment.value); // loginForm geçerliyse this.registerForm.value, {}'a yerleşir.
      let headers = new HttpHeaders();
    headers = headers.append("Content-Type","application/json");
    // loginUser icin kayıt yapılır. headers için headers gönderim şekli de bu şekildedir.
    // ve login olan kullanıcı için subscribe içindeki işlemler gerçekleştirilir.
    this.httpClient.post<any>(this.path + "/?fileId=" + fileId, this.commentt, {headers:headers}).subscribe(data => {
      this.commentt.id = data.id;
      //this.authService.isLoggedIn = data.result.succeeded;
      console.log('asdsadeee', this.commentt.id, this.commentt.commentMessage);
      console.log("SSistemde yorum yapma gerçekleşti.");
      this.router.navigateByUrl('/file');
    }, err=> {
      console.log(err)
    });
    }
  }

  sendddComment(fileId:number) {
    const formData = new FormData();
    let headers = new HttpHeaders();
    formData.append("comment", this.comment.value);
    //console.log("1 Caption: "+ file.fileCaption +", Desc: "+ file.fileDescription);
    console.log("append sonrası")
    //this.alertifyService.success("Dosya kaydetme işlemi başarılı.");
    
    // return this.httpClient.post(this.path2, formData);
    return this.httpClient.post(this.path + "/?fileId=" + fileId, this.commentt);
  }

}
