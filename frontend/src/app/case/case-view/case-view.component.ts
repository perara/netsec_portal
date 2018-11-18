import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";

import {Observable} from "rxjs";

import {CaseService} from "../../services/case.service";
import {Case} from "../../classes/case";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.scss']
})
export class CaseViewComponent implements OnInit {



  case: Case;
  caseID: string;


  selectedObjectIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caseService: CaseService,

  ) { }

  ngOnInit() {
    this.caseID = this.route.snapshot.paramMap.get('id');

    this.caseService.getCase(this.caseID).subscribe((_case)=> {
        this.case = _case
    })


  }

  test(){
    console.log(":D")
  }

  scrollTable($event) {

    if($event.key == "ArrowDown") {
      this.selectedObjectIndex = Math.min(this.case.objects.length - 1, (this.selectedObjectIndex + 1))

    } else if($event.key == "ArrowUp") {
      this.selectedObjectIndex = Math.max(0, (this.selectedObjectIndex - 1))

    }

  }

  selectObject(index) {
      this.selectedObjectIndex = index;
  }

}
