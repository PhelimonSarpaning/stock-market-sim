import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IRequest } from "../middleware/Auth";
import { GameService } from "../services";
import { Logger } from "../util";

@injectable()
export class GameController {
  constructor(
    @inject("GameService") private gameService: GameService,
    @inject("Logger") private logger: Logger,
  ) { }

  public createGame(req: Request, res: Response, next: NextFunction) {
    const gameName = req.body.gameName;
    if (!gameName) {
      return res.status(400).json({ err: "Game name not found" });
    }
    this.gameService.startGame(gameName).then((result) => {
      result.round.stocks.forEach((stock: any) => {
        delete stock.randomTrend;
      });
      res.status(200).json(result);
    }).catch((err) => {
      this.logger.error(err);
      return res.status(500).json({ message: err.message });
    });
  }

  public nextTurn(req: IRequest, res: Response, next: NextFunction) {
    const gameId = req.params.id;
    if (!gameId) {
      return res.status(400).json({ err: "Game ID not found" });
    }
    this.gameService.nextRound(gameId).then((result) => {
      result.stock.forEach((stock) => {
        delete stock.randomTrend;
      });
      if (result.event) { delete result.event.value; }
      res.status(200).json({
        event: result.event,
        roundNo: result.roundNo,
        stocks: result.stock,
      });
    }).catch((err) => {
      this.logger.error(err);
      return res.status(500).json({ message: err.message });
    });
  }

  public getAnalystEvents(req: IRequest, res: Response, next: NextFunction) {
    const gameId = req.params.id;
    if (!gameId) {
      return res.status(400).json({ err: "Game ID not found" });
    }
    this.gameService.getAnalystEvents(gameId).then((result) => {
      // const resultObject: any = {};
      // result.forEach((value, key, map) => {
      //   delete value.value;
      //   resultObject[key] = value;
      // });
      const resultArr: any = [];
      result.forEach((value, key, map) => {
        delete value.value;
        value.round = key;
        resultArr.push(value);
      });
      res.status(200).json(resultArr);
    }).catch((err) => {
      this.logger.error(err);
      return res.status(500).json({ message: err.message });
    });
  }

  public getAnalystTrends(req: IRequest, res: Response, next: NextFunction) {
    const gameId = req.params.id;
    if (!gameId) {
      return res.status(400).json({ err: "Game ID not found" });
    }
    this.gameService.getAnalystTrends(gameId).then((result) => {
      // const resultObject: any = {};
      // result.forEach((value, key, map) => {
      //   // delete value.value;
      //   resultObject[key] = value;
      // });
      res.status(200).json(result);
    }).catch((err) => {
      this.logger.error(err);
      return res.status(500).json({ message: err.message });
    });
  }

  public getGameClock(req: IRequest, res: Response, next: NextFunction) {
    const gameId = req.params.id;
    if (!gameId) {
      return res.status(400).json({ err: "Game ID not found" });
    }
    this.gameService.getGameClock(gameId).then((result) => {
      res.status(200).json({
        roundNo: result,
      });
    }).catch((err) => {
      this.logger.error(err);
      return res.status(500).json({ message: err.message });
    });
  }

  public getGameCurrentStock(req: IRequest, res: Response, next: NextFunction) {
    const gameId = req.params.id;
    if (!gameId) {
      return res.status(400).json({ err: "Game ID not found" });
    }
    this.gameService.getStockPriceForCurrentRound(gameId).then((stocks) => {
      stocks.forEach((stock) => {
        delete stock.randomTrend;
      });
      res.status(200).json(stocks);
    }).catch((err) => {
      this.logger.error(err);
      return res.status(500).json({ message: err.message });
    });
  }

  public getStockHistory(req: IRequest, res: Response, next: NextFunction) {
    const gameId = req.query.id;
    if (!gameId) {
      return res.status(400).json({ err: "Game ID not found" });
    }
    const stockName = req.query.stockName;
    if (!stockName) {
      return res.status(400).json({ err: "Stock name not found" });
    }
    this.gameService.getStockPriceHisory(gameId, stockName).then((result) => {
      const resultObject: any = {};
      result.forEach((value, key, map) => {
        resultObject[key] = value;
      });
      res.status(200).json(resultObject);
    }).catch((err) => {
      this.logger.error(err);
      return res.status(500).json({ message: err.message });
    });
  }

  public getStockSectorMapping(req: IRequest, res: Response, next: NextFunction) {
    const gameId = req.query.id;
    if (!gameId) {
      return res.status(400).json({ err: "Game ID not found" });
    }
    this.gameService.getStocksSectorMapping(gameId).then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
      this.logger.error(err);
      return res.status(500).json({ message: err.message });
    });
  }

  public getSectorList(req: IRequest, res: Response, next: NextFunction) {
    const gameId = req.query.id;
    if (!gameId) {
      return res.status(400).json({ err: "Game ID not found" });
    }
    this.gameService.getSectorList(gameId).then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
      this.logger.error(err);
      return res.status(500).json({ message: err.message });
    });
  }

  public getSectorAverageForGame(req: IRequest, res: Response, next: NextFunction) {
    const gameId = req.query.id;
    if (!gameId) {
      return res.status(400).json({ err: "Game ID not found" });
    }
    const sector = req.query.sector;
    if (!sector) {
      return res.status(400).json({ err: "Sector not found" });
    }
    this.gameService.getSectorAverageForGame(gameId, sector).then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
      this.logger.error(err);
      return res.status(500).json({ message: err.message });
    });
  }

  public getMarketAverageForGame(req: IRequest, res: Response, next: NextFunction) {
    const gameId = req.query.id;
    if (!gameId) {
      return res.status(400).json({ err: "Game ID not found" });
    }
    this.gameService.getMarketAverageForGame(gameId).then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
      this.logger.error(err);
      return res.status(500).json({ message: err.message });
    });
  }
}
