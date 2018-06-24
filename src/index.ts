import * as dotenv from "dotenv";
import * as express from "express";
import * as mongoose from "mongoose";

import { GlobalDI } from "./inversify.config";
import { Logger } from "./util/Logger";

/**
 * Configure dotenv. Doing this before importing the routes
 */
dotenv.config();

import * as apiV1 from "./routes/v1";
import { MarketTrendsService, ProbabilityService, SectorTrendsService } from "./services";

/**
 * Create Express Server
 */
const app = express();

const logger = GlobalDI.get<Logger>("Logger");

/**
 * Express Configuration
 */

app.set("port", process.env.PORT || 3000);

/**
 * MongoDB Connection
 */
mongoose.connection.on("connected", () => {
  logger.debug("DB Connection Established");
});

mongoose.connection.on("reconnected", () => {
  logger.debug("DB Connection Reestablished");
});

mongoose.connection.on("disconnected", () => {
  logger.debug("DB Connection Disconnected");
});

mongoose.connection.on("close", () => {
  logger.debug("DB Connection Closed");
});

mongoose.connection.on("error", (error) => {
  logger.error("ERROR: " + error);
});

mongoose.connect(process.env.MONGOLAB_URI, {
  autoReconnect: true,
  reconnectInterval: 500, // Reconnect every 500ms
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  useMongoClient: true,
}).then(() => {
  logger.info("Successfully conected to mongoDB");
}).catch((err) => {
  logger.error(err.message);
});

(mongoose as any).Promise = global.Promise; // Use global promises for mongoose

// const m = GlobalDI.get<MarketTrendService>("MarketTrendService");
// const d = m.initializeDeck(14);
// const p = GlobalDI.get<ProbabilityService>("ProbabilityService");
// console.log(p.pickFromDeck(d));
// console.log(m.getScore(d));
// console.log(d);
// console.log(m.getScore(d));
// console.log(d);
// console.log(m.getScore(d));
// console.log(d);
// console.log(m.getScore(d));
// console.log(d);
// const s = GlobalDI.get<SectorTrendService>("SectorTrendService");
// const d = s.initializeDeck(10, ["Tech", "Marketing"]);
// console.log(s.getScore(d));
// console.log(s.getScore(d));
// console.log(s.getScore(d));
// console.log(s.getScore(d));
// console.log(s.getScore(d));
// console.log(s.getScore(d));
// console.log(s.getScore(d));
// console.log(s.getScore(d));
// console.log(s.getScore(d));
// console.log(s.getScore(d));
// console.log(d);
// console.log(s.getScore(d));
// console.log(d);
// console.log(s.getScore(d));

// console.log(d);
/**
 * API v1 Routes
 */

app.use("/api/v1", apiV1.router);

app.route("/").get((req, res) => {
  res.status(200).json({ message: "Welcome, it works"});
});

export { app };
