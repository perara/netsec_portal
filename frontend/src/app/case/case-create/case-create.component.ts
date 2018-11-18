import { Component, OnInit } from '@angular/core';
import {ValidatorService} from "../../validator.service";
import {CaseService} from "../../services/case.service";
import {Case} from "../../classes/case";
import {CaseObject} from "../../classes/case-object";

@Component({
  selector: 'app-case-create',
  templateUrl: './case-create.component.html',
  styleUrls: ['./case-create.component.scss']
})



export class CaseCreateComponent implements OnInit {

  caseSourceInput: String = "";
  case: Case = new Case();


  constructor(public validator: ValidatorService,  public caseService: CaseService) {

  }

  ngOnInit() {

  }

  submitAnalysis(){
    this.case.status = "open";


    this.caseService.create(this.case).subscribe(data=>{
      console.log(data)
    });


    this.case = new Case();

  }

  addKnowledge(event){
    if(event instanceof KeyboardEvent && (event.key != "ArrowDown" && event.key != "Enter")) {
      return;
    }


    let type = this.validator.validate(this.caseSourceInput);
    if(!type){
      // Not valid
      // TODO message that validation failed
      return
    }

    let caseItem = <CaseObject>{
      name: this.caseSourceInput,
      type: type
    };

    if(!this.case.source) {
      this.case.source = caseItem;
    }

    this.case.objects.push(caseItem);


    this.caseSourceInput = ""
  }



}
