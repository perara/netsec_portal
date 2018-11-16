import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {map, switchMap} from 'rxjs/operators';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CaseService} from "../../services/case.service";

@Component({
  selector: 'app-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.scss']
})
export class CaseViewComponent implements OnInit {

  caseID: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caseService: CaseService,

  ) { }

  ngOnInit() {
    this.caseID = this.route.snapshot.paramMap.get('id');


    this.caseService.getCase(this.caseID)
      .subscribe(value => {
        console.log(value)
      })

  }

}
