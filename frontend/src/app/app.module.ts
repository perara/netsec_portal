import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { AnalysisListComponent } from './analysis-list/analysis-list.component';
import { AnalysisCreateComponent } from './analysis-create/analysis-create.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    AnalysisComponent,
    DashboardComponent,
    PagenotfoundComponent,
    AnalysisComponent,
    AnalysisListComponent,
    AnalysisCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
