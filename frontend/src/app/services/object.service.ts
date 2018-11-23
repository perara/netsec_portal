import { Injectable } from '@angular/core';
import {Case} from "../classes/case";
import {catchError} from "rxjs/operators";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {HttpClient} from "@angular/common/http";
import {CaseObject} from "../classes/case-object";

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  private readonly handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('CustomerService');
  }

  update(data){
    return this.http
      .post<CaseObject>("/api/object/update", data)
      .pipe(
        catchError(this.handleError('updateObject', []))
      );
  }

  analyze(data){
    return this.http
      .post<CaseObject>("/api/object/analyze", data)
      .pipe(
        catchError(this.handleError('analyzeObject', []))
      );
  }

}
