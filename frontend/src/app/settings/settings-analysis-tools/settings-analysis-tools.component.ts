import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'app-settings-analysis-tools',
  templateUrl: './settings-analysis-tools.component.html',
  styleUrls: ['./settings-analysis-tools.component.scss']
})
export class SettingsAnalysisToolsComponent implements OnInit {

  toolkits = [
    /*{type: "ip", description: "8.8.8.8", services: [{service: "cyman"}]},
    {type: "domain", description: "domain.no",services: [{service: "virustotal"}]},
    {type: "url", description: "http(s)://domain.no",services: [{service: "virustotal"}]},
    {type: "sha256", description: "35A442F64...",services: [{service: "virustotal"}]},*/
  ];

  services = [
    /*{service: "virustotal"},
    {service: "cyman"},
    {service: "reversedns"},*/
  ];

  createToolkit(f){

    if(f.valid){
      f.value["services"] = [];
      this.toolkits.push(f.value);
      f.resetForm();

      this.syncAnalysisTools() // Sync with HTTP
    }
  }

  createService(f){
    if(f.valid){
      this.services.push(f.value);
      f.resetForm();

      this.syncAnalysisTools() // Sync with HTTP
    }
  }


  hasService(service, type_service){
    return type_service.some(e => e.service == service.service);
  }

  addService(type, service){

    if(this.hasService(service, type.services)){
      // Remove
      const index = type.services.findIndex(e => e.service == service.service);
      type.services.splice(index, 1);
    }else{
      type.services.push(service)
    }

    this.syncAnalysisTools() // Sync with HTTP

  }

  syncAnalysisTools(){
    this.settingsService.syncAnalysisTools({
      toolkits: this.toolkits,
      services: this.services
    }).subscribe((data) => {
      console.log(data)
    })

  }

  removeToolkit(index){
    this.toolkits.splice(index, 1);

    this.syncAnalysisTools() // Sync with HTTP
  }

  removeService(service){
    // Remove service from list of services
    const index = this.services.findIndex(e => e == service);
    this.services.splice(index, 1);

    this.syncAnalysisTools(); // Sync with HTTP

    // Clean from types
    this.toolkits.forEach(x => {
      const i = x.services.findIndex(e => e.service == service.service);
      if(i > -1) {
        x.services.splice(i, 1);
      }

    });

  }

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {

    this.settingsService.getAnalysisTools()
      .subscribe((data: any) => {
        this.toolkits = data.toolkits;
        this.services = data.services;
      })

  }

}
