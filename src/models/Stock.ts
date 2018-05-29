import { injectable } from "inversify";

@injectable()
export class Stock {
  public sector: string;
  public company: string;
  public price: number;
  public round: number;
  public randomTrend: number;
}
