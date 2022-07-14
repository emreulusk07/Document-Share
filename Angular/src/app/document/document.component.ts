import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Forum } from '../models/forum';
import { DocumentService } from '../services/document.service';
import { ActivatedRoute } from '@angular/router';
import { FileClass } from '../models/fileClass';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
  providers: [DocumentService]
})
export class DocumentComponent implements OnInit {

  constructor(private httpClient:HttpClient, private activatedRoute:ActivatedRoute, private documentService: DocumentService) { }

  forums: Forum[]= [];
  searchText:string="";

  ngOnInit(): void {
    this.documentService.getDocuments().subscribe((data: Forum[]) => {
      this.forums = data;
      console.log(data);
      console.log("controllllll");
    });
  }

}
