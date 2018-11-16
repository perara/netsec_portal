import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PagenotfoundComponent} from "./app/pagenotfound/pagenotfound.component";
import {CommonModule} from "@angular/common";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {CaseComponent} from "./case/case.component";
import {CaseViewComponent} from "./case/case-view/case-view.component";

const routes: Routes = [
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'case', component: CaseComponent },
  { path: 'case/:id', component: CaseViewComponent },
  { path: '**', component: PagenotfoundComponent },



];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(routes, {useHash: true})],
  exports: [FormsModule, RouterModule, CommonModule]
})
export class AppRoutingModule { }
