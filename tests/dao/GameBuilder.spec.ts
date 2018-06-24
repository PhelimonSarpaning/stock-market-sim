import { assert, expect } from "chai";
import { SinonStub } from "sinon";
import sinon = require("sinon");
import { GameDAO } from "../../src/db/dao/GameDAO";
import { GameSchema } from "../../src/db/schema/GameSchema";
import { Game } from "../../src/models";
import { GameBuilder } from "../../src/util/GameBuilder";
import { GlobalDI } from "./../../src/inversify.config";

describe("Testing GameBuilder", () => {
  beforeEach(() => {
    GlobalDI.snapshot();
  });

  afterEach(() => {
    GlobalDI.restore();
  });

  describe("Testing buildFromSchema()", () => {
    // let sandbox;
    const gameBuilder = GlobalDI.get<GameBuilder>("GameBuilder");

    describe("", () => {

      it("should reslove a object of type Game ", () => {
        const gameSchemaObj = new GameSchema();
        gameSchemaObj.rounds = [];
        gameSchemaObj._id = "5a4489e765542405a88a0c9b";
        gameSchemaObj.currentRound = 2;
        gameSchemaObj.name = "ummes";
        gameSchemaObj.sectorsCompanyMap = {};
        const game = gameBuilder.buildFromSchema(gameSchemaObj);
        // expect(game.id).to.be.a.instanceof(String);
        expect(game.name).to.be.equal("ummes");
      });
    });

  });
});
