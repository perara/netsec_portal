import {CaseObject} from "./case-object";


export class Case {

  public constructor(init?:Partial<Case>) {
    Object.assign(this, init);
  }


  objects: CaseObject[];
  root: CaseObject;
  identifier: string;
  status: string;
  last_update: number;
  sha256: string;
  public _id: {
    $oid: string
  };

}
