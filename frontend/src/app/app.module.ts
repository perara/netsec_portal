import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagenotfoundComponent } from './app/pagenotfound/pagenotfound.component';

import {HttpClientModule} from "@angular/common/http";
import { MenuComponent } from './app/menu/menu.component';
import { HeaderComponent } from './app/header/header.component';
import {CaseCreateComponent} from "./case/case-create/case-create.component";
import {CaseComponent} from "./case/case.component";
import {CaseListComponent} from "./case/case-list/case-list.component";
import { CaseViewComponent } from './case/case-view/case-view.component';
import {HttpErrorHandler} from "./services/http-error-handler.service";

@NgModule({
  declarations: [
    AppComponent,

    DashboardComponent,
    PagenotfoundComponent,
    CaseComponent,
    CaseListComponent,
    CaseCreateComponent,
    MenuComponent,
    HeaderComponent,
    CaseViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    HttpErrorHandler

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
