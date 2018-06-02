import { injectable } from "inversify";
import { Round } from "./Round";

@injectable()
export class Game {
  public rounds: Round[];
  public name: string;
  public id: string;
  public currentRound: number;
}
