import { assert, expect } from "chai";
import { SinonStub } from "sinon";
import sinon = require("sinon");
import { GameDAO } from "../../src/db/dao/GameDAO";
import { GameSchema } from "../../src/db/schema/GameSchema";
import { Game } from "../../src/models";
import { GameBuilder } from "../../src/util/GameBuilder";
import { GlobalDI } from "./../../src/inversify.config";

describe("Testing GameDAO", () => {
  beforeEach(() => {
    GlobalDI.snapshot();
  });

  afterEach(() => {
    GlobalDI.restore();
  });

  describe("Testing save()", () => {

    describe("Test sunny case", () => {
      let sandbox: any;
      const gameDAO = GlobalDI.get<GameDAO>("GameDAO");

      beforeEach(() => {
        // GlobalDI
        sandbox = sinon.sandbox.create();
        // let stub: SinonStub;
        // let tdpbStub: SinonStub;
        const gameSchemaObj = new GameSchema();
        gameSchemaObj.rounds = [];
        gameSchemaObj._id = "5a4489e765542405a88a0c9b";
        gameSchemaObj.currentRound = 2;
        gameSchemaObj.name = "ummes";
        gameSchemaObj.sectorsCompanyMap = {};
        // const gameSchema = new GameSchema();
        sandbox.stub(GameSchema, "create").resolves(gameSchemaObj);

        const gameBuilder = GlobalDI.get<GameBuilder>("GameBuilder");
        const game = GlobalDI.get<Game>("Game");
        game.rounds = [];
        game.currentRound = 2;
        game.name = "ummes";
        game.sectorsCompanyMap = {};
        sandbox.stub(gameBuilder, "buildFromSchema").returns(game);

      });

      afterEach(() => {
        sandbox.restore();
      });

      it("should reslove a object of type Game ", () => {
        const game = GlobalDI.get<Game>("Game");
        game.rounds = [];
        game.currentRound = 2;
        game.name = "ummes";
        game.sectorsCompanyMap = {};
        return gameDAO.save(game).then((res) => {
          expect(res).to.be.an.instanceof(Game);
        });
      });
    });

    describe("Test rainy case", () => {
      let sandbox: any;
      const gameDAO = GlobalDI.get<GameDAO>("GameDAO");

      beforeEach(() => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(GameSchema, "create").rejects(new Error());

      });

      afterEach(() => {
        sandbox.restore();
      });

      it("should reslove a object of type Game ", () => {
        const game = GlobalDI.get<Game>("Game");
        game.rounds = [];
        game.currentRound = 2;
        game.name = "ummes";
        game.sectorsCompanyMap = {};
        return gameDAO.save(game).catch((err) => {
          expect(err).to.be.an.instanceof(Error);
        });
      });
    });

  });
});
