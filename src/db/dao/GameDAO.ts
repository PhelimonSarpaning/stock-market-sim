import { inject, injectable } from "inversify";
import { Round } from "../../models";
import { Game } from "../../models/Game";
import { GameBuilder } from "../../util/GameBuilder";
import { GameSchema } from "../schema/GameSchema";

@injectable()
export class GameDAO {
  constructor(
    @inject("GameBuilder") public gameBuilder: GameBuilder,
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
    return GameSchema.updateOne({ _id: gameId}, {currentRound: round}).then((result) => {
      if (result) {
        return true;
      } else {
        throw new Error("Round didn't shift");
      }
    }).catch((err) => {
      return err;
    });
  }

  public getCurrentRoundStock(gameId: string): Promise<Round> {
    return GameSchema.findById(gameId).then((res) => {
      let game: Game;
      let currentRound: Round;
      if (res) {
         game = this.gameBuilder.buildFromSchema(res);
         game.rounds.forEach((round) => {
           if (round.roundNo === game.currentRound) {
              currentRound = round;
           }
         });
         return currentRound;
      } else {
        throw new Error("Current round stock details not found");
      }
    }).catch((err) => {
      return err;
    });
  }
}
