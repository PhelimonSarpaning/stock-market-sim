import { inject, injectable } from "inversify";
import { ProbabilityService } from ".";
import { Config } from "../util/Config";

@injectable()
export class SectorTrendsService {
  constructor(
    @inject("ProbabilityService") private probabilityService: ProbabilityService,
  ) { }

  public initializeDeck(rounds: number, sectors: string[]) {
    const sectorDecks = new Map<string, string[]>();
    sectors.forEach((sector) => {
      const weights = new Map<string, number>();
      weights.set(Config.IncrementString, Config.TrendsIncrementWeight);
      weights.set(Config.DecrementString, Config.TrendsDecrementWeight);
      weights.set(Config.ConstantString, Config.TrendsConstantWeight);
      sectorDecks.set(sector, this.probabilityService.generateDeck(weights, rounds));
    });
    return sectorDecks;
  }

  public getScore(sectorDecks: Map<string, string[]>) {
    const sectorScores = new Map<string, number>();
    sectorDecks.forEach((deck, sector) => {
      const trend = this.probabilityService.pickFromDeck(deck);
      if (trend === Config.IncrementString) {
        this.probabilityService.removeFromDeck(deck, Config.IncrementString);
        sectorScores.set(sector, (+1) * Config.MarketTrendFluctuation);
      } else if (trend === Config.DecrementString) {
        this.probabilityService.removeFromDeck(deck, Config.DecrementString);
        sectorScores.set(sector, (-1) * Config.MarketTrendFluctuation);
      } else {
        this.probabilityService.removeFromDeck(deck, Config.ConstantString);
        sectorScores.set(sector, (0) * Config.MarketTrendFluctuation);
      }
    });
    return sectorScores;
  }
}
