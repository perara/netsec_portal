import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ForensicsComponent} from "./forensics/forensics.component";
import {PagenotfoundComponent} from "./pagenotfound/pagenotfound.component";
import {CommonModule} from "@angular/common";

const routes: Routes = [
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'forensics', component: ForensicsComponent },
  { path: 'pageNotFound', component: PagenotfoundComponent, outlet: 'main' },
  { path: '**', redirectTo: 'pageNotFound', pathMatch: 'full' },


];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
