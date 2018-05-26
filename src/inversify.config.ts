import { Container } from "inversify";
import "reflect-metadata";

import { MarketTrendService, ProbabilityService, SectorTrendService } from "./services/";
import { Logger } from "./util/Logger";

const GlobalDI = new Container();

GlobalDI.bind<Logger>("Logger").to(Logger).inSingletonScope();
GlobalDI.bind<MarketTrendService>("MarketTrendService").to(MarketTrendService);
GlobalDI.bind<ProbabilityService>("ProbabilityService").to(ProbabilityService);
GlobalDI.bind<SectorTrendService>("SectorTrendService").to(SectorTrendService);

export { GlobalDI };
