import * as bodyParser from "body-parser";
import { NextFunction, Request, Response, Router } from "express";
import { GameController } from "../../controllers/GameController";
import { GlobalDI } from "../../inversify.config";
import { IRequest } from "./../../middleware/Auth";

const router = Router();

const jsonParser = bodyParser.json();

const gameController = GlobalDI.get<GameController>("GameController");

/**
 * @description GET request, Domain specific artifactTypeList with data structure will return as a json model.
 * @param domain
 * @returns artifactTypeList
 */
router.post("/", jsonParser, (req: IRequest, res: Response, next: NextFunction) => {
  gameController.createGame(req, res, next);
});

router.get("/turn/:id", (req: IRequest, res: Response, next: NextFunction) => {
  gameController.nextTurn(req, res, next);
});

router.get("/events/:id", (req: IRequest, res: Response, next: NextFunction) => {
  gameController.getAnalystEvents(req, res, next);
});

router.get("/trends/:id", (req: IRequest, res: Response, next: NextFunction) => {
  gameController.getAnalystTrends(req, res, next);
});

router.get("/clock/:id", (req: IRequest, res: Response, next: NextFunction) => {
  gameController.getGameClock(req, res, next);
});

router.get("/round/stock/:id", (req: IRequest, res: Response, next: NextFunction) => {
  gameController.getGameCurrentStock(req, res, next);
});

router.get("/stock/history", (req: IRequest, res: Response, next: NextFunction) => {
  gameController.getStockHistory(req, res, next);
});

export { router };
