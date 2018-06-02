import { inject, injectable } from "inversify";
import { MarketEventsService, MarketTrendsService, ProbabilityService, SectorTrendsService } from ".";
import { GameDAO } from "../db/dao/GameDAO";
import { GlobalDI } from "../inversify.config";
import { Game } from "../models/Game";
import { IEvent } from "../models/IEvent";
import { Round } from "../models/Round";
import { Stock } from "../models/Stock";
import { Config } from "../util/Config";
import { RandomTrendsService } from "./RandomTrendsService";

@injectable()
export class GameService {
  constructor(
    @inject("MarketEventsService") private marketEventsSevice: MarketEventsService,
    @inject("MarketTrendsService") private marketTrendsService: MarketTrendsService,
    @inject("SectorTrendsService") private sectorTrendsService: SectorTrendsService,
    @inject("RandomTrendsService") private randomTrendsService: RandomTrendsService,
    @inject("ProbabilityService") private probabilityService: ProbabilityService,
    @inject("GameDAO") private gameDAO: GameDAO,
  ) { }

  public startGame(gameName: string): Promise<any> {
    const game = GlobalDI.get<Game>("Game");
    game.rounds = this.initializeGameSimulation();
    game.name = gameName;
    return this.gameDAO.save(game).then((newGame) => {
      let resObj = null;
      newGame.rounds.forEach((r) => {
        if (r.roundNo === 0) {
          resObj = {
            currentRound: newGame.currentRound,
            gameId: newGame.id,
            name: newGame.name,
            round: {
              event: r.event,
              roundNo: r.roundNo,
              stocks: r.stock,
            },
          };
          if (resObj.round.event) { delete resObj.round.event.value; }
        }
      });
      return resObj;
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
  public nextRound(gameId: string): Promise<Round> {
    return this.gameDAO.getGameById(gameId).then((game) => {
      let newRound: Round = null;
      game.rounds.forEach((round) => {
        if (round.roundNo === (game.currentRound + 1)) {
          newRound = round;
        }
      });
      return this.gameDAO.updateGameRound(game.id, game.currentRound + 1).then((roundUpdated) => {
        return newRound;
      }).catch((err) => {
        return err;
      });
    }).catch((err) => {
      return err;
    });
  }

  /**
   * @param gameId
   * @returns returns a roundNo,EventString Map containing the event details for future rounds
   */
  public getAnalystEvents(gameId: string): Promise<Map<number, any>> {
    return this.gameDAO.getGameById(gameId).then((game) => {
      const maxRounds = game.currentRound + 3;
      const analystRounds: Round[] = [];
      const roundEventsMap = new Map<number, any>();
      game.rounds.forEach((round) => {
        if (round.roundNo > game.currentRound && round.roundNo <= maxRounds) {
          if (round.event) {
            analystRounds.push(round);
            roundEventsMap.set(round.roundNo, round.event);
          }
        }
      });
      return roundEventsMap;
    }).catch((err) => {
      return err;
    });
  }

  public getAnalystTrends(gameId: string): Promise<Map<number, any>> {
    return this.gameDAO.getGameById(gameId).then((game) => {
      const maxRounds = game.currentRound + 10;
      const analystRounds: Round[] = [];
      const roundTrendsMap = new Map<number, any>();
      let trendToDisplay: string;
      const pick = this.probabilityService.pickFromDeck(["sector", "stock"]);
      // console.log(Object.keys(game.rounds[0].sectorTrends));
      // console.log(game.rounds[0].sectorTrends.keys());
      if (pick === "sector") {
        // console.log(game.rounds[0].sectorTrends);
        // console.log(game.rounds[0].sectorTrends.keys());
        const sectors = [...game.rounds[0].sectorTrends.keys()];
        trendToDisplay = String(this.probabilityService.pickFromDeck(sectors));
        game.rounds.forEach((round) => {
          if (round.roundNo > game.currentRound && round.roundNo <= maxRounds) {
              roundTrendsMap.set(round.roundNo, round.sectorTrends.get(trendToDisplay));
          }
        });
      } else if (pick === "stock") {
        const stocks: string[] = [];
        game.rounds[0].stock.forEach((stock) => {
          stocks.push(stock.company);
        });
        trendToDisplay = String(this.probabilityService.pickFromDeck(stocks));
        game.rounds.forEach((round) => {
          if (round.roundNo > game.currentRound && round.roundNo <= maxRounds) {
              roundTrendsMap.set(round.roundNo, round.sectorTrends.get(trendToDisplay));
          }
        });
      }
      return {
        entity: trendToDisplay,
        trends: roundTrendsMap,
      };
    }).catch((err) => {
      return err;
    });
  }

  /**
   * @param gameId
   * @returns The current round of the game.
   */
  public getGameClock(gameId: string): Promise<number> {
    return this.gameDAO.getGameById(gameId).then((game) => {
      return game.currentRound;
    }).catch((err) => {
      return err;
    });
  }

  public getStockPriceForCurrentRound(gameId: string): Promise<Stock[]> {
    return this.gameDAO.getCurrentRoundStock(gameId).then((res) => {
      return res.stock;
    }).catch((err) => {
      return err;
    });
  }

  /**
   * @param gameId
   * @param stockName Company/stock name for the stock that is being searched
   * @returns Number, number Map storing the round and price of the stock at each round
   */
  public getStockPriceHisory(gameId: string, stockName: string): Promise<Map<number, number>> {
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

  private initializeStocksPriceMap(stocksSectorMap: Map<string, string[]>) {
    const stocksPriceMap = new Map<string, number>();
    stocksSectorMap.forEach((stocks, sector) => {
      stocks.forEach((stock) => {
        stocksPriceMap.set(stock, Number(Config.InitialStockPrice));
      });
    });
    return stocksPriceMap;
  }

  private initializeGameSimulation() {
    const sectors = ["Technology", "Business"];
    const stocksSectorMap = new Map<string, string[]>();
    stocksSectorMap.set(sectors[0], ["99X", "Virtusa", "WSO2"]);
    stocksSectorMap.set(sectors[1], ["John Keells", "Cargills"]);
    const stocksPriceMap = this.initializeStocksPriceMap(stocksSectorMap);
    const rounds: Round[] = [];
    const marketTrendsDeck = this.marketTrendsService.initializeDeck(Config.Rounds);
    const sectorTrendsDeck = this.sectorTrendsService.initializeDeck(Config.Rounds, sectors);
    let currentEvent: IEvent = null;
    let noOfRoundsSincePreviousEvent = 10;
    let eventDuration = 0;
    for (let roundNo = 0; roundNo < Config.Rounds; roundNo++) {
      const stocks: Stock[] = [];
      const round = GlobalDI.get<Round>("Round");
      // const event = eventDuration === 0 ? this.marketEventsSevice.getEvent(noOfRoundsSincePreviousEvent) : null;
      // const event = (!currentEvent) ? this.marketEventsSevice.getEvent(noOfRoundsSincePreviousEvent) : null;
      const marketTrend = this.marketTrendsService.getScore(marketTrendsDeck);
      const sectorTrend = this.sectorTrendsService.getScore(sectorTrendsDeck);
      eventDuration--;
      if (eventDuration <= 0) {
        currentEvent = null;
      }
      // TODO current event is an issue have to check
      if (currentEvent) {
        round.event = currentEvent;
        round.marketTrend = marketTrend;
        round.roundNo = roundNo;
        round.sectorTrends = sectorTrend;
        noOfRoundsSincePreviousEvent = 0;
        // eventDuration > 0 ? eventDuration -= 1 : eventDuration = 0;
      } else {
        noOfRoundsSincePreviousEvent < 10 ? noOfRoundsSincePreviousEvent += 1 : noOfRoundsSincePreviousEvent = 10;
        const event = this.marketEventsSevice.getEvent(noOfRoundsSincePreviousEvent, stocksSectorMap);
        if (event) {
          if (event.name === Config.Boom || event.name === Config.Bust) {
            eventDuration = Number(this.probabilityService.pickFromDeck([2, 3, 4, 5]));
          } else if (event.name === Config.ProfitWarning
            || event.name === Config.Takeover || event.name === Config.Scandal) {
            eventDuration = Number(this.probabilityService.pickFromDeck([1, 2, 3, 4, 5, 6, 7]));
          }
          round.eventDuration = eventDuration;
          round.event = currentEvent;
          round.eventDuration = eventDuration;
          currentEvent = event;
        } else {
          noOfRoundsSincePreviousEvent++;
        }
        round.marketTrend = marketTrend;
        round.roundNo = roundNo;
        round.sectorTrends = sectorTrend;
      }
      if (stocksSectorMap) {
        stocksSectorMap.forEach((stockList, sector) => {
          stockList.forEach((stockName) => {
            const stock = GlobalDI.get<Stock>("Stock");
            const randomTrend = this.randomTrendsService.getScore();
            let stockPriceAlteration = 0;
            if (currentEvent && (currentEvent.entity === sector || currentEvent.entity === stockName)) {
                stockPriceAlteration = currentEvent.value + marketTrend + sectorTrend.get(sector) + randomTrend;
            } else {
              stockPriceAlteration = marketTrend + sectorTrend.get(sector) + randomTrend;
            }
            const stockPrice = stocksPriceMap.get(stockName) + this.calculateStockPrice(stockPriceAlteration);
            stock.company = stockName;
            stock.price = stockPrice;
            stock.round = roundNo;
            stock.sector = sector;
            stock.randomTrend = randomTrend;
            stocksPriceMap.set(stockName, stockPrice);
            stocks.push(stock);
          });
        });

      }
      round.stock = stocks;
      rounds.push(round);
    }
    return rounds;
  }
}
