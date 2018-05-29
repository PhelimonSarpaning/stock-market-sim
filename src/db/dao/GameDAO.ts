import { inject, injectable } from "inversify";
import { Game } from "../../models/Game";
import { GameBuilder } from "../../util/GameBuilder";
import { GameSchema } from "../schema/GameSchema";

@injectable()
export class GameDAO {
  constructor(
    @inject("GameBuilder") private gameBuilder: GameBuilder,
  ) { }

  public save(game: Game): Promise<Game> {
    return GameSchema.create(game).then((result) => {
      return this.gameBuilder.buildFromSchema(result);
    }).catch((err) => {
      return err;
    });
  }

  public getGameById(id: string): Promise<Game> {
    return GameSchema.findById(id).then((result) => {
      if (result) {
        return this.gameBuilder.buildFromSchema(result);
      } else {
        return null;
      }
    }).catch((err) => {
      return err;
    });
  }

  public updateGameRound(gameId: string, round: number) {
    return GameSchema.updateOne({ id: gameId}, {currentRound: round}).then((result) => {
      if (result) {
        return true;
      } else {
        return false;
      }
    }).catch((err) => {
      return err;
    });
  }
}
