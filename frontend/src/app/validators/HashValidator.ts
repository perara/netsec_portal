import { AbstractControl } from '@angular/forms';

function isSHA256(input){
  return input.length == 64;
}

export function HashValidator(control: AbstractControl) {
  if(!isSHA256(control.value)){
    return { validHash: true};
  }
  return null;
}
