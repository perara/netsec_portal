import { Component, OnInit } from '@angular/core';
import {ValidatorService} from "../validator.service";
import {HttpClient} from "@angular/common/http";
import {AnalysisQuery} from "../analysis-query";
import {AnalysisItem} from "../analysis-item";

@Component({
  selector: 'app-analysis-create',
  templateUrl: './analysis-create.component.html',
  styleUrls: ['./analysis-create.component.scss']
})



export class AnalysisCreateComponent implements OnInit {

  analysisInputItem: String = "";
  analysisQuery: AnalysisQuery = new AnalysisQuery();
  primaryTarget: AnalysisItem;


  constructor(public validator: ValidatorService, public httpClient:HttpClient) {

  }

  ngOnInit() {

  }

  submitAnalysis(){

    this.analysisQuery.target = this.primaryTarget.data;
    this.analysisQuery.type = <String>this.primaryTarget.type;
    this.analysisQuery.status = "open";

    this.httpClient
      .post<AnalysisQuery>("/api/analysis/upload", this.analysisQuery)
      .subscribe((value: Object) => {console.log(value)})


  }

  addKnowledge(event){
    if(event instanceof KeyboardEvent && (event.key != "ArrowDown" && event.key != "Enter")) {
      return;
    }


    let type = this.validator.validate(this.analysisInputItem);
    /*if(!type){
      // Not valid
      // TODO message that validation failed
      return
    }*/

    this.analysisQuery.targets.push(<AnalysisItem>{
      data: this.analysisInputItem,
      type: type
    });

    this.analysisInputItem = ""
  }



}
