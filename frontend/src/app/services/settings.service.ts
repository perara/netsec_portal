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

  insertSetting(data){
    return this.http
      .post("/api/settings/insert", data)
      .pipe(
        catchError(this.handleError('/api/settings', []))
      );
  }

  deleteSetting(data){
    return this.http
      .post("/api/settings/delete", data)
      .pipe(
        catchError(this.handleError('/api/settings/delete', []))
      );
  }

  getSetting(setting_type) {
    return this.http
      .get("/api/settings/get/" + setting_type)
      .pipe(
        catchError(this.handleError('/api/settings/get', []))
      );

  }
}
