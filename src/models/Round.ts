import { injectable } from "inversify";
import { Stock } from "./Stock";

@injectable()
export class Round {
  public stock: Stock[];
  public event: any;
  public roundNo: number;
  public sectorTrends: Map<string, number>;
  public marketTrend: number;
  public eventDuration: number;
}
