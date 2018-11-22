import { Component, OnInit } from '@angular/core';
import {CaseService} from "../../services/case.service";
import {CaseObject} from "../../classes/case-object";
import {WSCaseNamespace} from "../../app.ws";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Case} from "../../classes/case";

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit {

  statusFilter = {
    open: true,
    close: false
  };

  cases: Case[];
  filteredCases: Case[];


  constructor(
    public caseService: CaseService,
    private socket: WSCaseNamespace
  ) {}

  ngOnInit() {
    this.$httpCases();

    this.socket.on("create", this.onCaseCreate)
  }

  $httpCases(){

    this.caseService.getCasesMetadata().subscribe((data: Case[]) => {
      this.cases = data.reverse();
      this.onStatusFilterChange();
    });

  }

  onCaseCreate(){
    console.log(":D")
  }

  getCases(){
    return this.cases.filter(x => this.statusFilter[x.status])
  }

  onStatusFilterChange(){
    this.filteredCases = this.getCases();
  }

}
