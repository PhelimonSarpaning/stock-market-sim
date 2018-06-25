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

  /**
   * @param gameName takes the game name as parameter, whoever it isn't treated as a unique ID
   * @returns prepared round object, without the round event values
   */
  public startGame(gameName: string): Promise<any> {
    const game = GlobalDI.get<Game>("Game");
    const sectors = ["Technology", "Business", "Telco", "Health"];
    const stocksSectorMap = new Map<string, string[]>();
    stocksSectorMap.set(sectors[0], ["99X PLC", "Virtusa PLC", "WSO2 PLC", "IFS PLC"]);
    stocksSectorMap.set(sectors[1], ["John Keells PLC", "Cargills PLC", "Singer Sri Lanka PLC", "Brown & Company PLC"]);
    stocksSectorMap.set(sectors[2], ["Dialog Axiata PLC", "Mobitel PLC", "Etisalat PLC", "Airtel PLC"]);
    stocksSectorMap.set(sectors[3], ["Hemas Holdings Hospital PLC", "Nawaloka Hospital Hospitals PLC",
      "Durdans Hospital PLC", "Asiri Hospital Holdings PLC"]);
    game.sectorsCompanyMap = stocksSectorMap;
    game.rounds = this.initializeGameSimulation(sectors, stocksSectorMap);
    game.name = gameName;
    return new Promise((resolve, reject) => {
      this.gameDAO.save(game).then((newGame) => {
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
        resolve(resObj);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * @param gameId
   * @description gets the game Id and RETURNS the next Round details UPDATES the currentRound
   * @returns Round if next round exists if not returns a NULL
   * @rejects An error
   */
  public nextRound(gameId: string): Promise<Round> {
    return new Promise((resolve, reject) => {
      this.gameDAO.getGameById(gameId).then((game) => {
        if (!game) {
          reject(new Error("Game doesn't exist!"));
        }
        let newRound: Round = null;
        game.rounds.forEach((round) => {
          if (round.roundNo === (game.currentRound + 1)) {
            newRound = round;
          }
        });
        this.gameDAO.updateGameRound(game.id, game.currentRound + 1).then((roundUpdated) => {
          resolve(newRound);
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * @param gameId
   * @returns returns a roundNo,EventString Map containing the event details for future rounds
   */
  public getAnalystEvents(gameId: string): Promise<Map<number, any>> {
    return new Promise((resolve, reject) => {
      this.gameDAO.getGameById(gameId).then((game) => {
        if (!game) {
          reject(new Error("Game doesn't exist!"));
        }
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
        resolve(roundEventsMap);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public getAnalystTrends(gameId: string): Promise<Map<number, any>> {
    return new Promise((resolve, reject) => {
      this.gameDAO.getGameById(gameId).then((game) => {
        if (!game) {
          reject(new Error("Game doesn't exist!"));
        }
        const maxRounds = game.currentRound + 10;
        const analystRounds: Round[] = [];
        const roundTrendsMap = new Map<number, any>();
        let trendToDisplay: string;
        const pick = this.probabilityService.pickFromDeck(["sector", "stock"]);
        if (pick === "sector") {
          const sectors = Object.keys(game.rounds[0].sectorTrends);
          trendToDisplay = String(this.probabilityService.pickFromDeck(sectors));
          game.rounds.forEach((round) => {
            if (round.roundNo > game.currentRound && round.roundNo <= maxRounds) {
              roundTrendsMap.set(round.roundNo, round.sectorTrends[trendToDisplay]);
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
              round.stock.forEach((stock) => {
                if (stock.company === trendToDisplay) {
                  roundTrendsMap.set(round.roundNo, stock.randomTrend);
                }
              });
            }
          });
        }
        const resultArr: any = [];
        const stocksSectorMap = this.stockSectorMap(game.rounds[0].stock);
        roundTrendsMap.forEach((val, key, map) => {
          resultArr.push({
            entity: trendToDisplay,
            round: key,
            sector: pick === "stock" ? stocksSectorMap.get(trendToDisplay) : undefined,
            type: pick,
            value: val,
          });
        });
        resolve(resultArr);
        // return {
        //   entity: trendToDisplay,
        //   trends: roundTrends,
        // };
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * @param gameId
   * @returns The current round of the game.
   */
  public getGameClock(gameId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.gameDAO.getGameById(gameId).then((game) => {
        if (!game) {
          reject(new Error("Game doesn't exist!"));
        }
        resolve(game.currentRound);
      }).catch((err) => {
        reject(err);
      });
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
    return new Promise((resolve, reject) => {
      this.gameDAO.getGameById(gameId).then((game) => {
        if (!game) {
          reject(new Error("Game doesn't exist!"));
        }
        const roundStockMap = new Map<number, number>();
        game.rounds.forEach((round) => {
          round.stock.forEach((stock) => {
            if (stock.company === stockName && round.roundNo <= game.currentRound) {
              roundStockMap.set(stock.round, stock.price);
            }
          });
        });
        resolve(roundStockMap);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public getStocksSectorMapping(gameId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gameDAO.getGameById(gameId).then((game) => {
        if (!game) {
          reject(new Error("Game doesn't exist!"));
        }
        // const resultArr: any = [];
        // for (const key in object) {
        //   if (object.hasOwnProperty(key)) {
        //     const element = object[key];
        //   }
        // }
        resolve(game.sectorsCompanyMap);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public getSectorList(gameId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gameDAO.getGameById(gameId).then((game) => {
        if (!game) {
          reject(new Error("Game doesn't exist!"));
        }
        resolve(Object.keys(game.sectorsCompanyMap));
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public getSectorAverageForGame(gameId: string, sector: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gameDAO.getGameById(gameId).then((game) => {
        if (!game) {
          reject(new Error("Game doesn't exist!"));
        }
        const resObject = {};
        const sectors = Object.keys(game.sectorsCompanyMap);
        const roundsResult: any = {};
        game.rounds.forEach((round) => {
          let count = 0;
          let sectorTotal = 0;
          round.stock.forEach((stock) => {
            if (stock.sector === sector && stock.round <= game.currentRound) {
              sectorTotal += stock.price;
              count++;
            }
          });
          if (round.roundNo <= game.currentRound) {
            roundsResult[String(round.roundNo)] = (sectorTotal / count);
          }
        });
        // const sectorResult: any = {};
        // sectors.forEach((sector) => {
        //   const roundsResult: any = {};
        //   game.rounds.forEach((round) => {
        //     let count = 0;
        //     let sectorTotal = 0;
        //     round.stock.forEach((stock) => {
        //       if (stock.sector === sector) {
        //         sectorTotal += stock.price;
        //         count++;
        //       }
        //     });
        //     roundsResult[String(round.roundNo)] = (sectorTotal / count);
        //   });
        //   sectorResult[sector] = roundsResult;
        // });
        resolve(roundsResult);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public getMarketAverageForGame(gameId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gameDAO.getGameById(gameId).then((game) => {
        if (!game) {
          reject(new Error("Game doesn't exist!"));
        }
        const resObject = {};
        const roundsResult: any = {};
        game.rounds.forEach((round) => {
          let count = 0;
          let marketTotal = 0;
          round.stock.forEach((stock) => {
            if (stock.round <= game.currentRound) {
              marketTotal += stock.price;
              count++;
            }
          });
          if (round.roundNo <= game.currentRound) {
            roundsResult[String(round.roundNo)] = (marketTotal / count);
          }
        });
        resolve(roundsResult);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  private stockSectorMap(stocks: Stock[]) {
    const stocksSectorMap = new Map<string, string>();
    stocks.forEach((stock) => {
      stocksSectorMap.set(stock.company, stock.sector);
    });
    return stocksSectorMap;
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

  private initializeGameSimulation(sectors: string[], stocksSectorMap: Map<string, string[]>) {
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
