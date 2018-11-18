import {CaseObject} from "./case-object";


export class Case {
  source: CaseObject;
  objects: CaseObject[] = [];
  status: String;
  last_update: number;
}
