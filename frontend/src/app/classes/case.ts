import {CaseObject} from "./case-object";


export class Case {
  objects: CaseObject[] = [];
  root: CaseObject;
  identifier: string;
  status: string;
  last_update: number;

}
