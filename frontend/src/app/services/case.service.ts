import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {AnalysisQuery} from "../classes/analysis-query";


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

  getCase(caseID){
    return this.http.get("/api/case/get/" + caseID)
      .pipe(
        catchError(this.handleError('getCase', []))
      )
  }

  getAllCases(){
    return this.http.get("/api/case/get")
      .pipe(
        catchError(this.handleError('getAllCases', []))
      );


  }

  create(data){
    return this.http
      .post<AnalysisQuery>("/api/case/upload", data)
      .pipe(
        catchError(this.handleError('getAllCases', []))
      );



  }








}
