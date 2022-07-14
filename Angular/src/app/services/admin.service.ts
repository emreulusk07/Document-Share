import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileClass } from '../models/fileClass';
import { RegisterUser } from '../models/registerUser';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  path = "http://localhost:7623/api/admin";

  constructor(private httpClient:HttpClient) { }

  deleteUser(userId:string):Observable<RegisterUser[]>{
    // gelen data'lar path'e gönderilir.
    console.log("silllllll");
    return this.httpClient.get<RegisterUser[]>(this.path + "/deleteusers/?id="+userId);
  }

  getUsers():Observable<RegisterUser[]>{
    // gelen data'lar path'e gönderilir.
    return this.httpClient.get<RegisterUser[]>(this.path + "/getusers");
  }

  getFiles():Observable<FileClass[]>{
    // gelen data'lar path'e gönderilir.
    return this.httpClient.get<FileClass[]>(this.path + "/getfiles");
  }

  adminConfirmed(file:FileClass):Observable<FileClass[]>{
    // gelen data'lar path'e gönderilir.
    console.log("onayyyy");
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type","application/json");
    return this.httpClient.post<FileClass[]>(this.path + "/confirmed",file,{headers:headers});
  }

  adminDenied(file:FileClass):Observable<FileClass[]>{
    // gelen data'lar path'e gönderilir.
    console.log("redddd");
    return this.httpClient.post<FileClass[]>(this.path + "/denied",file);
  }
}
