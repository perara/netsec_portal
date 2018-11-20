import { Component, OnInit } from '@angular/core';
import {CaseService} from "../../services/case.service";

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {URLValidator} from "../../validators/URLValidator";
import {DomainValidator} from "../../validators/DomainValidator";
import {ValidatorService} from "../../validator.service";
import {CaseObject} from "../../classes/case-object";
import {Case} from "../../classes/case";

@Component({
  selector: 'app-case-create',
  templateUrl: './case-create.component.html',
  styleUrls: ['./case-create.component.scss']
})



export class CaseCreateComponent implements OnInit {

 // caseSourceInput: String = "";
  case: FormGroup;

  constructor(private fb: FormBuilder,  private validator: ValidatorService, public caseService: CaseService) {
    this.case = fb.group({
      input: fb.control(""),
      root: fb.control(null, Validators.required),
      objects: fb.array([], Validators.minLength(1))
    })
  }

  ngOnInit() {

  }

  addObject(){
    let type = this.validator.validate(this.case.controls.input.value);
    if(!type){
      this.case.controls.input.setErrors({isValid: false});
      return false;
    }

    let caseItem = <CaseObject>{
      name: this.case.controls.input.value,
      type: type,
      depth: 0,
      parent: null
    };

    if(!this.case.controls.root.value) {
      this.case.controls.root.setValue(caseItem);
    }

    if(this.case.controls.objects.value.filter(x => x.name == caseItem.name).length === 0){
      this.case.controls.objects.value.push(caseItem);
    }

  }

  createCase(){
    let caseData = <CaseObject>this.case.controls.root.value;
    caseData.parent = null;
    caseData.children = this.case.controls.objects.value;

  }

  /*submitAnalysis(){
    this.case.status = "open";


    this.caseService.create(this.case).subscribe(data=>{
    });


    this.case = new Case();

  }

*/
}
