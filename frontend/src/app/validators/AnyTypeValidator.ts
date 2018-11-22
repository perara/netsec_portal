import {AbstractControl} from "@angular/forms";
import {DomainValidator} from "./DomainValidator";
import {HashValidator} from "./HashValidator";
import {IPV4Validator} from "./IPV4Validator";
import {URLValidator} from "./URLValidator";



export function AnyTypeValidator(control: AbstractControl) {
  if(control.value == null){
    return null;
  }

  let a = DomainValidator(control);
  let b = HashValidator(control);
  let c = IPV4Validator(control);
  let d = URLValidator(control);
  return null;
}
