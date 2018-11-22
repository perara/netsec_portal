import { Component, OnInit } from '@angular/core';
import {CaseService} from "../../services/case.service";

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {URLValidator} from "../../validators/URLValidator";
import {DomainValidator} from "../../validators/DomainValidator";
import {ValidatorService} from "../../validator.service";
import {CaseObject} from "../../classes/case-object";
import {Case} from "../../classes/case";
import {AnyTypeValidator} from "../../validators/AnyTypeValidator";
import {AppCommunicatorService} from "../../services/app-communicator.service";

@Component({
  selector: 'app-case-create',
  templateUrl: './case-create.component.html',
  styleUrls: ['./case-create.component.scss']
})



export class CaseCreateComponent implements OnInit {
  case: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validator: ValidatorService,
    private caseService: CaseService,
    private appCommunicator: AppCommunicatorService
  ) {
    this.case = fb.group({
      hash: fb.control({value: null, disabled: true}, [Validators.required, Validators.nullValidator]),
      input: fb.control("", [AnyTypeValidator]),
      root: fb.control(null, Validators.required),
      objects: fb.array([], Validators.minLength(1))
    })
  }

  ngOnInit() {

    /* Retrieve Initial (Pre Creation) hash */
   this.getCaseIdentifier();

    this.appCommunicator.listen("/pcap/create")
      .subscribe(new_pcap_upload => {
        // PCAPS Are treated as object as well
        console.log(new_pcap_upload)
        let newCaseObject = <CaseObject>{
          name: new_pcap_upload.id,
          type: "pcap",
          parent: null,
          depth: 0,
          children: [],
          status: "open",
          analyzed: false
        };

        if(this.case.controls.objects.value.filter(x => x.name == newCaseObject.name).length === 0){
          this.case.controls.objects.value.push(newCaseObject);
        }


      })

  }

  nextTab(){

  }

  getCaseIdentifier(){
    this.caseService.getHash()
      .subscribe((x: any) => {
        this.case.controls.hash.setValue(x.data)
      });
  }

  addObject(){
    if(this.case.controls.input.value == null)
      return false;

    let type = this.validator.validate(this.case.controls.input.value);
    if(!type){
      this.case.controls.input.setErrors({isValid: false});
      return false;
    }

    let caseItem = <CaseObject>{
      name: this.case.controls.input.value,
      type: type,
      depth: 0,
      parent: null,
      children: [],
      status: "open",
      analyzed: false
    };

    if(!this.case.controls.root.value) {
      this.case.controls.root.setValue(caseItem);
    }

    if(this.case.controls.objects.value.filter(x => x.name == caseItem.name).length === 0){
      this.case.controls.objects.value.push(caseItem);
    }

  }

  submitCase(){
    let caseData = this.case.controls.root.value;

    this.case.controls.objects.value
      .filter(x => x.name != caseData.name)
      .forEach(x => x.parent = caseData.name);

    this.caseService.create({
      case_identifier: this.case.controls.hash.value,
      root: this.case.controls.root.value,
      objects: this.case.controls.objects.value
    }).subscribe(data=>{

    });

    this.case.reset();
    this.getCaseIdentifier();

  }

  /*submitAnalysis(){
    this.case.status = "open";


    this.caseService.create(this.case).subscribe(data=>{
    });


    this.case = new Case();

  }

*/
}
