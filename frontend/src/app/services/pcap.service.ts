import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {Case} from "../classes/case";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class PcapService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('CustomerService');
  }

  upload(data){
    return this.http
      .post("/api/pcap/upload", data)
      .pipe(
        catchError(this.handleError('getAllCases', []))
      );



  }








}
