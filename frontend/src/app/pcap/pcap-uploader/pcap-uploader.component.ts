import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UploadFile, FileSystemFileEntry} from 'ngx-file-drop';
import {PcapService} from "../../services/pcap.service";
import {AppCommunicatorService} from "../../services/app-communicator.service";

@Component({
  selector: 'app-pcap-uploader',
  templateUrl: './pcap-uploader.component.html',
  styleUrls: ['./pcap-uploader.component.scss']
})
export class PcapUploaderComponent implements OnInit {

  public alerts: any[] = [];
  public filteredAlerts: any[] = [];
  public uploads = [];
  public files: UploadFile[] = [];

  @ViewChild('fileInput') fileInput:ElementRef;

  constructor(
    private pcapService: PcapService,
    private appCommunicator: AppCommunicatorService
  ) { }

  ngOnInit() {
  }

  openFileBrowser(){
    let event = new MouseEvent('click', {bubbles: false});
    this.fileInput.nativeElement.dispatchEvent(event);
  }

  onFilesAdded($event) {
    const files: File[] = this.fileInput.nativeElement.files;
    for (const droppedFile of files) {
      const file: File = droppedFile;
      const fakeFileEntry: FileSystemFileEntry = {
        name: file.name,
        isDirectory: false,
        isFile: true,
        file: (callback: (filea: File) => void): void => {
          callback(file);
        }
      };
      const toUpload: UploadFile = new UploadFile(fakeFileEntry.name, fakeFileEntry);
      this.files.push(toUpload);
    }

    this.upload()
  }

  public drop($event) {
    this.files.push(...$event.files);
    this.upload()
  }

  public upload() {

      this.files.forEach((file) => {

        if(!file.fileEntry.isFile){
          return false;
        }

        const entry = file.fileEntry as FileSystemFileEntry;
        entry.file((f: File) => {
          let fileExt = file.relativePath.split('.').pop();

          const formData = new FormData();
          formData.append('file', f, file.relativePath);

          // Start actual upload
          this.pcapService.upload(formData)
            .subscribe((data: any) => {
              /*
              {
              success=X,
              data=sha256
              }
               */
              // Broadcast pcap/create with sha256
              this.uploads.unshift(data.data);
              this.appCommunicator.emit("/pcap/create", data.data);
            });


        });
      });
      this.files = [];
  }

  public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }




















  hasKey(o, key) {
    return o.hasOwnProperty(key);
  }
  filterChange() {
    this.filteredAlerts = Object.keys(this.alerts)
      .filter(key => this.alerts[key].checked)
      .reduce((obj, key) => {
        return obj.concat(this.alerts[key].items);
      }, [])
      .sort((a:any, b:any) => {
        return a.pcap_cnt - b.pcap_cnt
      })

  }


}
