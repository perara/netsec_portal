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
import {FileDropModule} from "ngx-file-drop";
import { PcapUploaderComponent } from './pcap/pcap-uploader/pcap-uploader.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from "@angular/forms";
import { FooterComponent } from './app/footer/footer.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { PcapViewerComponent } from './pcap/pcap-viewer/pcap-viewer.component';
import {CookieService} from "ngx-cookie-service";

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
    PcapAnalyzerComponent,
    PcapUploaderComponent,
    FooterComponent,
    PcapViewerComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule,
    FileDropModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [
    HttpErrorHandler,
    WSRootNamespace,
    WSCaseNamespace,
    WSPCAPNamespace,
    CookieService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
