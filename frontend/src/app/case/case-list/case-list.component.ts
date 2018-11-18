import { Component, OnInit } from '@angular/core';
import {CaseService} from "../../services/case.service";
import {CaseObject} from "../../classes/case-object";

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit {
  isCLosed: boolean = false;
  isOpen: boolean = true;

  caseList: CaseObject[];

  constructor(
    public caseService: CaseService,
  ) { }

  ngOnInit() {
    this.getAllCases();
  }

  getAllCases(){

    this.caseService.getAllCases().subscribe((data: CaseObject[]) => {
      this.caseList = data.reverse();
    });

  }

}
