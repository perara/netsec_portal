import { Injectable } from '@angular/core';
import {Case} from "../classes/case";
import {catchError} from "rxjs/operators";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('CustomerService');
  }

  syncAnalysisTools(data){
    return this.http
      .post("/api/settings/analysis_tools", data)
      .pipe(
        catchError(this.handleError('syncAnalysisTools', []))
      );
  }

  getAnalysisTools() {
    return this.http
      .get("/api/settings/analysis_tools")
      .pipe(
        catchError(this.handleError('getAnalysisTools', []))
      );

  }
}
