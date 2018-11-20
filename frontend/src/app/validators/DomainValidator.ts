import {AbstractControl} from "@angular/forms";


function isValidDomain(v) {
  if (!v) return false;
  var re = /^(?!:\/\/)([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/gi;
  return re.test(v);
}

export function DomainValidator(control: AbstractControl) {
  if(!isValidDomain(control.value)){
    return { validDomain: true};
  }
  return null;
}
