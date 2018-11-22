import {EventEmitter, Injectable} from '@angular/core';
import {filter, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AppCommunicatorService {
  private stream: EventEmitter<any> = new EventEmitter();

  constructor() { }

  listen(namespace){
    return this.stream
      .pipe(filter(x => x.namespace == namespace))
      .pipe(map(x => x.data))
  }

  emit(namespace, data) {
    this.stream.emit({
      namespace: namespace,
      data: data
    })
  }



}
