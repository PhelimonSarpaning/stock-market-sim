import * as Mongoose from "mongoose";
import { IGame } from "../../models/IGame";

interface IGameSchemaModel extends IGame, Mongoose.Document { }
const gameSchema = new Mongoose.Schema({
  currentRound: {
    default: 0,
    type: Number,
  },
  name: {
    required: true,
    type: String,
  },
  rounds: {
    required: true,
    type: Mongoose.Schema.Types.Mixed,
  },
  sectorsCompanyMap: {
    required: true,
    type: Mongoose.Schema.Types.Mixed,
  },
});

const GameSchema = Mongoose.model<IGameSchemaModel>("Game", gameSchema);
export { GameSchema };
