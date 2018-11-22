export class CaseObject {
  public name: String;
  public type: String;
  public depth: number;
  public parent: string | null;
  public children: string[] = [];
  public analyzed: boolean;
}
