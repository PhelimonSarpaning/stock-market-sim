import { inject, injectable } from "inversify";
import { Config } from "../util/Config";
import { ProbabilityService } from "./ProbabilityService";

@injectable()
export class MarketTrendService {
  constructor(
    @inject("ProbabilityService") private probabilityService: ProbabilityService,
  ) { }

  public initializeDeck(rounds: number) {
    const weights = new Map<string, number>();
    weights.set(Config.IncrementString, Config.TrendsIncrementWeight);
    weights.set(Config.DecrementString, Config.TrendsDecrementWeight);
    weights.set(Config.ConstantString, Config.TrendsConstantWeight);
    return this.probabilityService.generateDeck(weights, rounds);
  }

  public getScore(deck: string[]) {
    const trend = this.probabilityService.pickFromDeck(deck);
    if (trend === Config.IncrementString) {
      this.probabilityService.removeFromDeck(deck, Config.IncrementString);
      return (+1) * Config.MarketTrendFluctuation;
    } else if (trend === Config.DecrementString) {
      this.probabilityService.removeFromDeck(deck, Config.DecrementString);
      return (-1) * Config.MarketTrendFluctuation;
    } else {
      this.probabilityService.removeFromDeck(deck, Config.ConstantString);
      return 0;
    }
  }
}
