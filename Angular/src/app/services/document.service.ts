import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Forum } from '../models/forum';
import { FileClass } from '../models/fileClass';
import { AlertifyService } from './alertify.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  getReport() {
    throw new Error('Method not implemented.');
  }

  constructor(private httpClient:HttpClient, private alertifyService:AlertifyService, private authService:AuthService) { }

  path = "http://localhost:7623/api/";
  path2 = "https://file.io";

  getDocuments():Observable<Forum[]>{
    // gelen data'lar path'e gönderilir.
    return this.httpClient.get<Forum[]>(this.path+"forum");
  }

  getDocumentById(documentId: number):Observable<Forum>{
    // gelen data path'e gönderilir.
    console.log("adsa"+documentId);
    return this.httpClient.get<Forum>(this.path+"forum/detail/?id="+documentId)
  }

  getFiles():Observable<FileClass[]>{
    // gelen data'lar path'e gönderilir.
    return this.httpClient.get<FileClass[]>(this.path+"files");
  }

  GetFilesCount() {
    return this.httpClient.get<FileClass[]>(this.path+"files/count");
  }

  getFileById(fileId: number):Observable<FileClass>{
    // gelen data path'e gönderilir.
    console.log("adsa"+fileId);
    return this.httpClient.get<FileClass>(this.path+"files/detail/?id="+fileId)
  }

  GetFilteredFiles(userId:string):Observable<FileClass[]>{
    // gelen data'lar path'e gönderilir.
    console.log("GetFilteredFiles idd: "+userId);
    return this.httpClient.get<FileClass[]>(this.path+"files/filteredFiles/?id="+userId);
  }
/*
  addFile(file: FileClass) {
    console.log(file.name+"##-");
    console.log(file.path+"#####");
    console.log("addfile girildi..");
    this.httpClient.post(this.path+"files/add", file, {
      reportProgress: true,
      observe: 'events'
    }).subscribe((event: any) => {
      
      if(typeof (event) === 'object') {
            file.fileDescription = event.link;
            console.log("name: "+file.name+" sl2: "+file.fileDescription);
        console.log("upload progress: ")
      }
      console.log(file.name+"##");
    console.log(file.fileDescription+"#####");

      this.alertifyService.success("İhale ekleme işlemi başarılı");
      console.log("islem basarili3");
      return file.fileDescription;
      //this.router.navigateByUrl('/documentDetail/' + data);
    });
  }
*/

  upload(file:any, files:any[], category:string) {
    console.log("formdata oncesi")
    // Create form data
    const formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      console.log("dosya adet: "+files.length);
      console.log("dosya : "+files[i].name);
      formData.append("file[]", files[i]);
    }

    console.log("formdata sonrası")
    // Store form name as "file" with file data
    //console.log("1 Caption: "+ file.fileCaption +", Desc: "+ file.fileDescription);
    
    //formData.append("file", file, file.name);
    
    let headers = new HttpHeaders();
    formData.append("data", category);
    formData.append("id",this.authService.getUserID())
    console.log("userid ",this.authService.getUserID())
    //console.log("1 Caption: "+ file.fileCaption +", Desc: "+ file.fileDescription);
    console.log("append sonrası")
    //this.alertifyService.success("Dosya kaydetme işlemi başarılı.");
    
    // return this.httpClient.post(this.path2, formData);
    return this.httpClient.post(this.path+"files/add", formData);
  }

  /*
  downloadFile(id: number) {
    const REQUEST_PARAMS = new HttpParams().set('filename', data.filename);
    return this.httpClient.get(this.path+"files/download", {
      params: REQUEST_PARAMS,
      responseType: 'arraybuffer'
    })
  }
  */

  downloadFile(id: number, contentType: string) {
    // gelen data path'e gönderilir.
    console.log("file id: "+id);
    console.log("file CT: "+contentType);
    console.log("gorev tamamlanmak üzere..0");
    try {
      console.log("gorev tamamlanmak üzere..1");
      return this.httpClient.get(`http://localhost:7623/api/files/${id}`, {responseType: 'blob'}).subscribe((result: Blob) => {
        console.log("gorev tamamlanmak üzere2..");
      const blob = new Blob([result], {type: contentType});
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      this.alertifyService.success("Dosya indirme başarılı");
      console.log("gorev tamam..");
    }, err=> {
      this.alertifyService.error("Dosya indirme işlemi başarısız.---"+err);
      console.log(err)});
    } catch (error) {
      console.error(error);
      this.alertifyService.error("Dosya indirme işlemi başarısız.---"+error);
    }
    return
  }

  giveLike(id: number) {
    // gelen data path'e gönderilir.
    console.log("file id: "+id);
    return this.httpClient.get(`http://localhost:7623/api/files/like/${id}`, {responseType: 'blob'}).subscribe((result: Blob) => {
      console.log("like gorev tamam..");
    });
  }

  searchFile(text: string, category: string) {
    // gelen data path'e gönderilir.
    console.log("file search: "+text);
    console.log("cate search: "+category);
    if(category==="(Tümü)") {
      category = "";
    }
    return this.httpClient.get<FileClass[]>('http://localhost:7623/api/files/text?&text='+text+'&category='+category);
  }
  
}
