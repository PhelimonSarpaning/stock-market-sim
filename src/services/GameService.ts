import { inject, injectable } from "inversify";
import { MarketEventsService, MarketTrendsService, ProbabilityService, SectorTrendsService } from ".";
import { GameDAO } from "../db/dao/GameDAO";
import { GlobalDI } from "../inversify.config";
import { Game } from "../models/Game";
import { Round } from "../models/Round";
import { Stock } from "../models/Stock";
import { Config } from "../util/Config";
import { RandomTrendsService } from "./RandomTrendsService";

@injectable()
export class GameService {
  constructor(
    @inject("MarketEventsSevice") private marketEventsSevice: MarketEventsService,
    @inject("MarketTrendsService") private marketTrendsService: MarketTrendsService,
    @inject("SectorTrendService") private sectorTrendsService: SectorTrendsService,
    @inject("RandomTrendsService") private randomTrendsService: RandomTrendsService,
    @inject("ProbabilityService") private probabilityService: ProbabilityService,
    @inject("GameDAO") private gameDAO: GameDAO,
  ) { }

  public initializeGameSimulation() {
    const sectors = ["Technology", "Business"];
    const stocksSectorMap = new Map<string, string[]>();
    stocksSectorMap.set(sectors[0], ["99X", "Virtusa", "WSO2"]);
    stocksSectorMap.set(sectors[1], ["John Keells", "Cargills"]);
    const stocks: Stock[] = [];
    const rounds: Round[] = [];
    const marketTrendsDeck = this.marketTrendsService.initializeDeck(Config.Rounds);
    const sectorTrendsDeck = this.sectorTrendsService.initializeDeck(Config.Rounds, sectors);
    let noOfRoundsSincePreviousEvent = 10;
    let eventDuration = 0;
    for (let roundNo = 0; roundNo < Config.Rounds; roundNo++) {
      const round = GlobalDI.get<Round>("Round");
      const event = eventDuration === 0 ? this.marketEventsSevice.getEvent(noOfRoundsSincePreviousEvent) : null;
      const marketTrend = this.marketTrendsService.getScore(marketTrendsDeck);
      const sectorTrend = this.sectorTrendsService.getScore(sectorTrendsDeck);
      if (event && eventDuration === 0) {
        noOfRoundsSincePreviousEvent = 0;
        round.event = event.name;
        round.marketTrend = marketTrend;
        round.roundNo = roundNo;
        round.sectorTrends = sectorTrend;
        if (event.name === Config.Boom || event.name === Config.Bust) {
          eventDuration = Number(this.probabilityService.pickFromDeck([2, 3, 4, 5]));
        } else if (event.name === Config.ProfitWarning
          || event.name === Config.Takeover || event.name === Config.Scandal) {
            eventDuration = Number(this.probabilityService.pickFromDeck([1, 2, 3, 4, 5, 6, 7]));
          }
      } else {
        eventDuration > 0 ? eventDuration -= 1 : eventDuration = 0;
        noOfRoundsSincePreviousEvent < 10 ? noOfRoundsSincePreviousEvent += 1 : noOfRoundsSincePreviousEvent = 10;
      }
      stocksSectorMap.forEach((stockList, sector) => {
        stockList.forEach((stockName) => {
          const stock = GlobalDI.get<Stock>("Stock");
          const randomTrend = this.randomTrendsService.getScore();
          const stockPrice = event.value + marketTrend + sectorTrend.get(sector) + randomTrend;
          stock.company = stockName;
          stock.price = this.calculateStockPrice(stockPrice);
          stock.round = roundNo;
          stock.sector = sector;
          stock.randomTrend = randomTrend;
          stocks.push(stock);
        });
      });
      round.stock = stocks;
      rounds.push(round);
    }
    return rounds;
  }

  public startGame(gameName: string) {
    const game = GlobalDI.get<Game>("Game");
    game.rounds = this.initializeGameSimulation();
    game.name = gameName;
    return this.gameDAO.save(game).then((newGame) => {
      newGame.rounds.forEach((r) => {
        if (r.roundNo === 0) {
          return r;
        }
      });
    }).catch((err) => {
      return err;
    });
  }

  /**
   * @param gameId
   * @description gets the game Id and RETURNS the next Round details UPDATES the currentRound
   * @returns Round if next round exists if not returns a NULL
   * @rejects An error
   */
  public nextRound(gameId: string) {
    return this.gameDAO.getGameById(gameId).then((game) => {
      game.rounds.forEach((round) => {
        if (round.roundNo === (game.currentRound + 1)) {
          this.gameDAO.updateGameRound(game.id, game.currentRound + 1);
          return round;
        } else {
          return null;
        }
      });
    }).catch((err) => {
      return err;
    });
  }

  /**
   * @param gameId
   * @returns returns a roundNo,EventString Map containing the event details for future rounds
   */
  public getAnalystEvents(gameId: string) {
    return this.gameDAO.getGameById(gameId).then((game) => {
      const maxRounds = game.currentRound + 3;
      const analystRounds: Round[] = [];
      const roundEventsMap = new Map<number, string>();
      game.rounds.forEach((round) => {
        if (round.roundNo > game.currentRound && round.roundNo <= maxRounds) {
          analystRounds.push(round);
          roundEventsMap.set(round.roundNo, round.event);
        }
      });
      return roundEventsMap;
    }).catch((err) => {
      return err;
    });
  }

  /**
   * @param gameId
   * @returns The current round of the game.
   */
  public getGameClock(gameId: string) {
    return this.gameDAO.getGameById(gameId).then((game) => {
      return game.currentRound;
    }).catch((err) => {
      return err;
    });
  }

  /**
   * @param gameId
   * @param stockName Company/stock name for the stock that is being searched
   * @returns Number, number Map storing the round and price of the stock at each round
   */
  public getStockPriceHisory(gameId: string, stockName: string) {
    return this.gameDAO.getGameById(gameId).then((game) => {
      const roundStockMap = new Map<number, number>();
      game.rounds.forEach((round) => {
        round.stock.forEach((stock) => {
          if (stock.company === stockName) {
            roundStockMap.set(stock.round, stock.price);
          }
        });
      });
      return roundStockMap;
    }).catch((err) => {
      return err;
    });
  }

  private calculateStockPrice(price: number) {
    if (price < 0) {
      return 0;
    } else {
      return price;
    }
  }
}
