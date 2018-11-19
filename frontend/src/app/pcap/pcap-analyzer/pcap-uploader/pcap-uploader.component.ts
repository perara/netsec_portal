import { Component, OnInit } from '@angular/core';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import {HttpHeaders} from "@angular/common/http";
import {PcapService} from "../../../services/pcap.service";

@Component({
  selector: 'app-pcap-uploader',
  templateUrl: './pcap-uploader.component.html',
  styleUrls: ['./pcap-uploader.component.scss']
})
export class PcapUploaderComponent implements OnInit {


  constructor(private pcapService: PcapService) { }

  ngOnInit() {
  }



  public files: UploadFile[] = [];

  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          let fileExt = droppedFile.relativePath.split('.').pop();

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

           // You could upload it like this:
           const formData = new FormData();
           formData.append('file', file, droppedFile.relativePath);

           // Headers
           const headers = new HttpHeaders({
            'security-token': 'mytoken'
            });


          this.pcapService.upload(formData)
            .subscribe(data => {
              console.log(data)
            })


        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }

}
