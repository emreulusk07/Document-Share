import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';
import { Forum } from 'src/app/models/forum';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css'],
  providers: [DocumentService]
})
export class DocumentDetailComponent implements OnInit {

  forum: Forum;

  constructor(private activatedRoute:ActivatedRoute, private documentService:DocumentService) { 
    this.forum = {
      id: 0
    } as Forum;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log("adsaadasfasfasf");
      this.getDocumentById(params["documentId"]);
    })
  }
  
  getDocumentById(documentId: number) {
    this.documentService.getDocumentById(documentId).subscribe(data => {
      console.log(data);
      console.log("xxxx"+data.id);
      this.forum = data;
      //this.getBidId = data.id.toString();
    })
  }

}
