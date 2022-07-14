import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileClass } from 'src/app/models/fileClass';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.css'],
  providers: [DocumentService]
})
export class FileDetailComponent implements OnInit {

  file: FileClass;

  constructor(private activatedRoute:ActivatedRoute, private fileService:DocumentService) { 
    this.file = {
      id: 0
    } as FileClass;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log("adsaadasfasfasf");
      this.getFileById(params["fileId"]);
    })
  }
  
  getFileById(fileId: number) {
    this.fileService.getFileById(fileId).subscribe(data => {
      console.log(data);
      console.log("xxxx"+data.id);
      this.file = data;
      //this.getBidId = data.id.toString();
    })
  }

}
