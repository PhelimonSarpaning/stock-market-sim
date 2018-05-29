import { injectable } from "inversify";
import { GlobalDI } from "../inversify.config";
import { Game } from "../models/Game";

@injectable()
export class GameBuilder {

  public buildFromSchema(gameSchema: any) {
    const game = GlobalDI.get<Game>("Game");
    game.id = gameSchema._id;
    game.name = gameSchema.name;
    game.currentRound = gameSchema.currentRound;
    game.rounds = gameSchema.rounds;
    return game;
  }
}
