import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PagenotfoundComponent} from "./pagenotfound/pagenotfound.component";
import {CommonModule} from "@angular/common";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {AnalysisComponent} from "./analysis/analysis.component";

const routes: Routes = [
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: 'pageNotFound', component: PagenotfoundComponent, outlet: 'main' },
  { path: '**', redirectTo: 'pageNotFound', pathMatch: 'full' },


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
