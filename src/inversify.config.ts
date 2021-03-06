import { Container } from "inversify";
import "reflect-metadata";

import { GameController } from "./controllers/GameController";
import { GameDAO } from "./db/dao/GameDAO";
import { Game, Round, Stock } from "./models";
import { GameService, MarketEventsService, MarketTrendsService, ProbabilityService, RandomTrendsService,
  SectorTrendsService } from "./services/";
import { GameBuilder } from "./util/GameBuilder";
import { Logger } from "./util/Logger";

const GlobalDI = new Container();

GlobalDI.bind<Logger>("Logger").to(Logger).inSingletonScope();
GlobalDI.bind<MarketTrendsService>("MarketTrendsService").to(MarketTrendsService);
GlobalDI.bind<ProbabilityService>("ProbabilityService").to(ProbabilityService);
GlobalDI.bind<SectorTrendsService>("SectorTrendsService").to(SectorTrendsService);
GlobalDI.bind<GameService>("GameService").to(GameService);
GlobalDI.bind<MarketEventsService>("MarketEventsService").to(MarketEventsService);
GlobalDI.bind<RandomTrendsService>("RandomTrendsService").to(RandomTrendsService);

GlobalDI.bind<Game>("Game").to(Game);
GlobalDI.bind<Round>("Round").to(Round);
GlobalDI.bind<Stock>("Stock").to(Stock);

GlobalDI.bind<GameController>("GameController").to(GameController);

GlobalDI.bind<GameDAO>("GameDAO").to(GameDAO);

GlobalDI.bind<GameBuilder>("GameBuilder").to(GameBuilder);

export { GlobalDI };
