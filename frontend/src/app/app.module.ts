import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
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
import { SettingsComponent } from './settings/settings.component';
import { SettingsAnalysisToolsComponent } from './settings/settings-analysis-tools/settings-analysis-tools.component';
import { SettingsUsersComponent } from './settings/settings-users/settings-users.component';
import {SocketIoModule, SocketIoConfig, Socket} from 'ngx-socket-io';
import { PcapAnalyzerComponent } from './pcap/pcap-analyzer/pcap-analyzer.component';
import {WSCaseNamespace, WSPCAPNamespace, WSRootNamespace} from "./app.ws";





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
    CaseViewComponent,
    SettingsComponent,
    SettingsAnalysisToolsComponent,
    SettingsUsersComponent,
    PcapAnalyzerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule
  ],
  providers: [
    HttpErrorHandler,
    WSRootNamespace,
    WSCaseNamespace,
    WSPCAPNamespace

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
