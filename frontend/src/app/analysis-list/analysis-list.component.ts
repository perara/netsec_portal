import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AnalysisQuery} from "../analysis-query";
import {AnalysisItem} from "../analysis-item";

@Component({
  selector: 'app-analysis-list',
  templateUrl: './analysis-list.component.html',
  styleUrls: ['./analysis-list.component.scss']
})
export class AnalysisListComponent implements OnInit {
  isCLosed: boolean = false;
  isOpen: boolean = true;

  analysisList: AnalysisItem[];

  constructor(public httpClient: HttpClient) { }

  ngOnInit() {
    this.getAllAnalysis();
  }

  getAllAnalysis(){

    this.httpClient
      .get("/api/analysis/get")
      .subscribe((data: AnalysisItem[]) => {
        this.analysisList = data.reverse();
      });


  }

}
