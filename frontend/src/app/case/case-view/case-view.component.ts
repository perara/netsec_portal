import {Component, Input, KeyValueChanges, KeyValueDiffer, KeyValueDiffers, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CaseService} from "../../services/case.service";
import {Case} from "../../classes/case";
import {CaseObject} from "../../classes/case-object";
import {ObjectService} from "../../services/object.service";
import {AppCommunicatorService} from "../../services/app-communicator.service";

@Component({
  selector: 'app-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.scss']
})
export class CaseViewComponent implements OnInit {

  /* Sent from the parent component, if its the case that its sent, we use this instead of param to retrieve case data */
  @Input() $selectedCase: Case;
  case: Case;
  caseID: string;

  selectedObjectIndex;
  selectedObject: CaseObject;
  modifySelectedObject: boolean;

  private caseDiffer: KeyValueDiffer<string, any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caseService: CaseService,
    private objectService: ObjectService,
    private differs: KeyValueDiffers,
    private appCommunicationService: AppCommunicatorService
  ) { }

  ngOnInit() {
    if(!this.$selectedCase){
      this.caseID = this.route.snapshot.paramMap.get('id');
    }else{
      this.caseID = this.$selectedCase.sha256;
    }


    this.caseService.getCase(this.caseID).subscribe((_case: Case)=> {

      this.case = _case;
      this.appCommunicationService.emit("/case/enter", this.case);

      this.caseDiffer = this.differs.find(this.case).create();

      // Select first object
      if(this.case.objects.length > 0){
        this.case.root = this.case.objects.find(x => x._id.$oid == this.case.root._id.$oid); // Root is the same object, but JS treats them differently overwrite root from the list
        this.selectedObjectIndex = 0;
        this.selectedObject = this.case.objects[this.selectedObjectIndex]
      }

    });

  }

  caseChanged(changes: KeyValueChanges<string, any>) {

    changes.forEachChangedItem(x => {
      console.log(x.key, x.previousValue, x.currentValue)

    })

  }

  /* https://stackoverflow.com/questions/46330070/angular-4-how-to-watch-an-object-for-changes/46330414
   Hacky way of listening for changes
   */
  ngDoCheck(): void {
    /* We need to check for existance because this is loaded via htt thus async */
    if(this.caseDiffer){
      const changes = this.caseDiffer.diff(this.case);
      if (changes) {
        /* Count number of changes, this is because a change is triggered from null => object at the start */
        let didChange = false;
        changes.forEachPreviousItem(x =>{ if(x){didChange=true}});
        if(didChange){
          this.caseChanged(changes);
        }

      }
    }
  }


  scrollTable($event) {

    if($event.key == "ArrowDown") {
      this.selectedObjectIndex = Math.min(this.case.objects.length - 1, (this.selectedObjectIndex + 1))

    } else if($event.key == "ArrowUp") {
      this.selectedObjectIndex = Math.max(0, (this.selectedObjectIndex - 1))
    }

    this.selectedObject = this.case.objects[this.selectedObjectIndex];
  }

  selectObject(obj, index) {
    this.selectedObject = obj;
    this.selectedObjectIndex = index;
  }

  deleteSelectedObject(){

    this.caseService.deleteObject({
      "id": this.case._id,
      "object_id": this.selectedObject._id
    }).subscribe((x) => {

      this.case.objects = this.case.objects.filter(x => x != this.selectedObject);
      if(this.case.objects.length > 0) {
        this.selectedObjectIndex = 0;
        this.selectedObject = this.case.objects[0];
        return false;
      }

      this.selectedObject = null;
      this.selectedObjectIndex = null;

    });



  }

  updateCaseMetadata(data: any){

    this.caseService.updateMetadata({
      "id": this.case._id,
      "metadata": data
    })
      .subscribe((value: Case) => {
        console.log("Updated case metadata")
      });

  }

  updateSelectedObject($event: any){
    if($event.key != "Enter"){
      return;
    }
    this.objectService.update(this.selectedObject)
      .subscribe((value: CaseObject) => {
        console.log("Updated caseObject")
      });
  }

  analyzeSelectedObject(){
    this.objectService.analyze(this.selectedObject)
      .subscribe((value: CaseObject) => {
        console.log("Analyzed caseObject")
      });
  }

  analyzeCase(){
    this.caseService.analyze(this.case)
      .subscribe((value: CaseObject) => {
        console.log("Analyzed case")
      });
  }



}
