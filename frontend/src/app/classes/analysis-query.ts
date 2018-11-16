import {AnalysisItem} from "./analysis-item";


export class AnalysisQuery {
  targets: Array<AnalysisItem> = [];
  status: String;
  type: String;
  target: String;
  last_update: number;
}
