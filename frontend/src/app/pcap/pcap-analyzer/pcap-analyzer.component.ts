import { Component, OnInit } from '@angular/core';
import {WSPCAPNamespace} from "../../app.ws";

@Component({
  selector: 'app-pcap-analyzer',
  templateUrl: './pcap-analyzer.component.html',
  styleUrls: ['./pcap-analyzer.component.scss']
})
export class PcapAnalyzerComponent implements OnInit {

  constructor(private ws: WSPCAPNamespace) { }

  ngOnInit() {

    this.ws.getPCAPData();


  }

}
