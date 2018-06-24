import { NextFunction, Request, Response, Router } from "express";

import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as JWT from "jsonwebtoken";
import { auth, IRequest } from "./../../middleware/Auth";

import * as GAMEAPI from "./game-api";

const router = Router();
const authMiddleware = auth({ secret: process.env.JWT_SECRET });
const jsonParser = bodyParser.json();

// Use CORS
router.use(cors());

router.use("/game", GAMEAPI.router);

export { router };
