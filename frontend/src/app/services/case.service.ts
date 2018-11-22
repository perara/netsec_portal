import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {Case} from "../classes/case";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class CaseService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('CustomerService');
  }

  getCase(caseID): Observable<Case>{
    return <Observable<Case>>this.http.get("/api/case/" + caseID)
      .pipe(
        catchError(this.handleError('getCase', []))
      )
  }

  getCasesMetadata(){
    return this.http.get("/api/case/metadata")
      .pipe(
        catchError(this.handleError('getCasesMetadata', []))
      );


  }

  getHash(){
    return this.http.get("/api/case/hash")
      .pipe(
        catchError(this.handleError('getAllCases', []))
      );

  }

  create(data){
    return this.http
      .post<Case>("/api/case/upload", data)
      .pipe(
        catchError(this.handleError('getAllCases', []))
      );



  }








}
