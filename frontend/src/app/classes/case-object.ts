export class CaseObject {

  public constructor(init?:Partial<CaseObject>) {
    Object.assign(this, init);
  }

  public name: String;
  public type: String;
  public depth: number;
  public parent: string | null;
  public children: string[] = [];
  public analyzed: boolean;
  public sha256: string;
  public results: {};

  public _id: {
    $oid: string
  };



}
