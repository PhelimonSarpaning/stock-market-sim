import { Round } from "./Round";

export interface IGame {
  name: string;
  rounds: Round[];
  currentRound: number;
  sectorsCompanyMap: any;
}
