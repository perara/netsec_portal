import { Component, OnInit } from '@angular/core';
import {WSPCAPNamespace} from "../../app.ws";

@Component({
  selector: 'app-pcap-analyzer',
  templateUrl: './pcap-analyzer.component.html',
  styleUrls: ['./pcap-analyzer.component.scss']
})
export class PcapAnalyzerComponent implements OnInit {

  public showPcapUploader: boolean = false;

  constructor(private ws: WSPCAPNamespace) { }

  ngOnInit() {
    this.ws.onPCAPScanFailed().subscribe(x => console.log(x));
    this.ws.onPCAPScanStarted().subscribe(x => console.log(x));
    this.ws.onPCAPScanDone().subscribe(x => console.log(x));
  }

}
