import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbTabset} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent implements OnInit {

  public selectedCaseEvent: Event;

  @ViewChild(NgbTabset)
  private tabset: NgbTabset;

  constructor() { }

  ngOnInit() {
  }

  /*Fires when a case is selected from the CaseListComponent (child)
  * Ref: https://medium.com/datadriveninvestor/angular-7-share-component-data-with-other-components-1b91d6f0b93f
  */
  onCaseSelected($event: Event){
    this.selectedCaseEvent = $event;
    let selectedCase = this.tabset.tabs.find(x => x.title == "Selected Case");
    selectedCase.disabled = false;
    this.tabset.select(selectedCase.id)
  }

}
