import { Component, OnInit } from '@angular/core';
import {AppCommunicatorService} from "../../services/app-communicator.service";
import some from 'lodash/some';
import {tryCatch} from "rxjs/internal-compatibility";
import {CookieService} from "ngx-cookie-service";
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  cases = [];

  constructor(
    private appCommunicationService: AppCommunicatorService,
    private cookieService: CookieService) {


    try{
      this.cases = JSON.parse(cookieService.get('menu-cases'));
    }catch(Exception){
      this.cases = [];
      console.log(Exception)
    }





    appCommunicationService.listen("/case/enter")
      .subscribe((the_case) => {

        let simple_repr = {
          identifier: the_case.identifier,
          sha256: the_case.sha256
        };

        console.log(this.cases, simple_repr)
        if (some(this.cases, simple_repr)){
          return;
        }

        this.cases.push(simple_repr);
        this.updateCookie();

      })

  }

  onRemoveCaseItem($event, idx){
    $event.preventDefault();

    console.log(idx)
    this.cases.splice(idx, 1);

    this.updateCookie()
  }



  updateCookie(){
    this.cookieService.set('menu-cases', JSON.stringify(this.cases), 30, "/", document.domain, false);
  }

  ngOnInit() {
  }

}
