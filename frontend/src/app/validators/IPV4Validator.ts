import {AbstractControl} from "@angular/forms";


function  isValidIP(input){

  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(input))
  {
    return true
  }

  return false

}

export function IPV4Validator(control: AbstractControl) {
  if(!isValidIP(control.value)){
    return { validIP: true};
  }
  return null;
}
