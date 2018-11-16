import { Component, OnInit } from '@angular/core';
import {ValidatorService} from "../../validator.service";
import {HttpClient} from "@angular/common/http";
import {AnalysisQuery} from "../../classes/analysis-query";
import {AnalysisItem} from "../../classes/analysis-item";
import {CaseService} from "../../services/case.service";

@Component({
  selector: 'app-case-create',
  templateUrl: './case-create.component.html',
  styleUrls: ['./case-create.component.scss']
})



export class CaseCreateComponent implements OnInit {

  analysisInputItem: String = "";
  analysisQuery: AnalysisQuery = new AnalysisQuery();
  primaryTarget: AnalysisItem;


  constructor(public validator: ValidatorService,  public caseService: CaseService) {

  }

  ngOnInit() {

  }

  submitAnalysis(){

    this.analysisQuery.target = this.primaryTarget.data;
    this.analysisQuery.type = <String>this.primaryTarget.type;
    this.analysisQuery.status = "open";



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

    this.caseService.create(this.analysisQuery).subscribe(data=>{
      console.log(data)
    });

    this.analysisInputItem = ""
  }



}
