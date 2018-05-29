import { inject, injectable } from "inversify";
import { ProbabilityService } from ".";
import { Config } from "../util/Config";

@injectable()
export class MarketEventsService {
  constructor(
    @inject("ProbabilityService") private probabilityService: ProbabilityService,
  ) { }

  // Probability here depends on each turn i.e. 0.33 and 0.67 every turn as probaility for event itself
  // is given (i.e. increases by 0.1 each turn )
  // In Trends the probability is calculated over the entire game i.e. 0.25 0.25 0.5 will be the average for entire game
  public getEvent(noOfRoundsSincePreviousEvent: number) {
    const eventDeck = this.initializeEventDeck(noOfRoundsSincePreviousEvent);
    const typeOfEventDeck = this.initializeTypeOfEventDeck();
    const event = this.probabilityService.pickFromDeck(eventDeck);
    if (event === Config.EventString) {
      //
      const eventType = this.probabilityService.pickFromDeck(typeOfEventDeck);
      if (eventType === Config.SectorString) {
        this.probabilityService.removeFromDeck(typeOfEventDeck, Config.SectorString);
        const sectorEventDeck = this.initializeSectorEventDeck();
        const sectorEvent = this.probabilityService.pickFromDeck(sectorEventDeck);
        if (sectorEvent === Config.Boom) {
          return {
            name: Config.Boom,
            value: (+1) * Number(this.probabilityService.pickFromDeck([1, 2, 3, 4, 5])),
          };
        } else if (sectorEvent === Config.Bust) {
          return {
            name: Config.Bust,
            value: (-1) * Number(this.probabilityService.pickFromDeck([1, 2, 3, 4, 5])),
          };
        }
        // return (+1) * Config.MarketTrendFluctuation;
      } else if (eventType === Config.StockString) {
        this.probabilityService.removeFromDeck(typeOfEventDeck, Config.StockString);
        const stockEventDeck = this.initializeStockEventDeck();
        const stockEvent = this.probabilityService.pickFromDeck(stockEventDeck);
        if (stockEvent === Config.ProfitWarning) {
          return {
            name: Config.ProfitWarning,
            value: (+1) * Number(this.probabilityService.pickFromDeck([2, 3])),
          };
        } else if (stockEvent === Config.Takeover) {
          return {
            name: Config.Takeover,
            value: (-1) * Number(this.probabilityService.pickFromDeck([1, 2, 3, 4, 5])),
          };
        } else if (stockEvent === Config.Scandal) {
          return {
            name: Config.Scandal,
            value: (-1) * Number(this.probabilityService.pickFromDeck([3, 4, 5, 6])),
          };
        }
      }
    } else if (event === Config.NoEventString) {
      return null;
    }
  }

  private initializeEventDeck(noOfRoundsSincePreviousEvent: number) {
    const weights = new Map<string, number>();
    weights.set(Config.EventString, noOfRoundsSincePreviousEvent);
    weights.set(Config.NoEventString, (10 - noOfRoundsSincePreviousEvent));
    return this.probabilityService.generateDeck(weights, 10);
  }

  private initializeTypeOfEventDeck() {
    const weights = new Map<string, number>();
    weights.set(Config.SectorString, Config.EventsSectorWeight);
    weights.set(Config.StockString, Config.EventsStockWeight);
    return this.probabilityService.generateDeck(weights, 100);
  }

  private initializeSectorEventDeck() {
    const weights = new Map<string, number>();
    weights.set(Config.Boom, Config.EventsSectorBoomWeight);
    weights.set(Config.Bust, Config.EventsSectorBustWeight);
    return this.probabilityService.generateDeck(weights, 10);
  }

  private initializeStockEventDeck() {
    const weights = new Map<string, number>();
    weights.set(Config.ProfitWarning, Config.EventsStockProfitWarningWeight);
    weights.set(Config.Takeover, Config.EventsStockTakeoverWeight);
    weights.set(Config.Scandal, Config.EventsStockScandalWeight);
    return this.probabilityService.generateDeck(weights, 10);
  }
}
