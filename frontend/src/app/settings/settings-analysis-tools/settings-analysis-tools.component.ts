import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'app-settings-analysis-tools',
  templateUrl: './settings-analysis-tools.component.html',
  styleUrls: ['./settings-analysis-tools.component.scss']
})
export class SettingsAnalysisToolsComponent implements OnInit {

  object_types = [];
  services = [];

  constructor(private settingsService: SettingsService) {
  }

  addType(form_data: FormGroup){
    if(!form_data.valid)
      return false;

    let settings_type = "object_type";
    let type = form_data.value.type;
    let description = form_data.value.description;

    this.settingsService.insertSetting({
      settings_type: settings_type,
      type: type,
      description: description,
      services: []
    }).subscribe(x => {
      this.object_types.push(x)
    })


  }

  deleteType(type) {

    this.settingsService.deleteSetting(type)
      .subscribe(x => {

        this.object_types = this.object_types.filter(y => y !== type)
      })
  }

  addService(form_data){
    if(!form_data.valid)
      return false;

    let settings_type = "services";
    let type = form_data.value.service;
    let description = form_data.value.description;

    this.settingsService.insertSetting({
      settings_type: settings_type,
      type: type,
      description: description,
    }).subscribe(x => {
      this.services.push(x)
    })

  }

  toggleServiceForType(service, object_type){

    if(this.typeHasService(service, object_type)) {
      object_type.services = object_type.services.filter(x => x.$oid !== service._id.$oid);
    }else{
      object_type.services.push(service._id);
    }

    this.settingsService.insertSetting(object_type)
      .subscribe(x => {

      })


  }


  typeHasService(service, object_type){
    return object_type.services.includes(service._id);
  }

  ngOnInit() {

    this.settingsService.getSetting("object_type")
      .subscribe((x) => {

        if(Array.isArray(x)){
          this.object_types.push(... x);
          return;
        }

        this.object_types.push(x)
      });


    this.settingsService.getSetting("services")
      .subscribe((x) => {

        if(Array.isArray(x)){
          this.services.push(... x);
          return;
        }

        this.services.push(x)
      });



  }
}


