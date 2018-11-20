import {Injectable} from "@angular/core";
import {Socket} from "ngx-socket-io";
import {map} from "rxjs/operators";

@Injectable()
export class WSRootNamespace extends Socket {

  constructor() {
    super({ url: '/', options: {} });
  }

}

@Injectable()
export class WSCaseNamespace extends Socket {

  constructor() {
    super({ url: '/case', options: {} });
  }

}

@Injectable()
export class WSPCAPNamespace extends Socket {

  constructor() {
    super({ url: '/pcap', options: {} });
  }

  onPCAPScanDone() {
    return this.fromEvent("scan_done")
  }

  onPCAPScanStarted() {
    return this.fromEvent("scan_started")
  }

  onPCAPScanFailed() {
    return this.fromEvent("scan_failed")
  }



}
