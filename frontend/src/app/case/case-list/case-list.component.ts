import { Component, OnInit } from '@angular/core';
import {AnalysisItem} from "../../classes/analysis-item";
import {CaseService} from "../../services/case.service";

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit {
  isCLosed: boolean = false;
  isOpen: boolean = true;

  caseList: AnalysisItem[];

  constructor(
    public caseService: CaseService,
  ) { }

  ngOnInit() {
    this.getAllCases();
  }

  getAllCases(){

    this.caseService.getAllCases().subscribe((data: AnalysisItem[]) => {
      this.caseList = data.reverse();
    });

  }

}
