import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PagenotfoundComponent} from "./app/pagenotfound/pagenotfound.component";
import {CommonModule} from "@angular/common";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CaseComponent} from "./case/case.component";
import {CaseViewComponent} from "./case/case-view/case-view.component";
import {SettingsComponent} from "./settings/settings.component";
import {PcapAnalyzerComponent} from "./pcap/pcap-analyzer/pcap-analyzer.component";

const routes: Routes = [
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'case', component: CaseComponent },
  { path: 'pcap', component: PcapAnalyzerComponent },
  { path: 'case/:id', component: CaseViewComponent },
  { path: 'settings', component: SettingsComponent},
  { path: '**', component: PagenotfoundComponent },



];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forRoot(routes, {useHash: true})],
  exports: [FormsModule, RouterModule, CommonModule]
})
export class AppRoutingModule { }
