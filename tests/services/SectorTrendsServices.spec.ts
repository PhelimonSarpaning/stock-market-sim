import { expect } from "chai";
import * as sinon from "sinon";
import { GlobalDI } from "../../src/inversify.config";
import { ProbabilityService, SectorTrendsService } from "../../src/services";
import { Config } from "../../src/util/Config";

describe("Sector Trends Service", () => {

  describe("Testing initializedDeck()", () => {

    describe("Testing case" , () => {
      const sectorTrendsService = GlobalDI.get<SectorTrendsService>("SectorTrendsService");
      let sandbox: any;
      beforeEach(() => {
        sandbox = sinon.sandbox.create();
        const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");
        sandbox.stub(probabilityService, "generateDeck").returns([]);
      });
      afterEach(() => {
        sandbox.restore();
      });
      it("should return an sector Map", () => {
        const sectors = ["Business", "Marketing"];
        const sectorDeck = sectorTrendsService.initializeDeck(4, sectors);
        sectorDeck.forEach((value, key) => {
          expect(sectors.indexOf(key) !== -1);
        });
        expect(sectorDeck).to.be.an.instanceOf(Object);
      });
    });
  });

  describe("Testing getScore()", () => {

    describe("Testing for increment" , () => {
      const sectorTrendsService = GlobalDI.get<SectorTrendsService>("SectorTrendsService");
      let sandbox: any;
      beforeEach(() => {
        sandbox = sinon.sandbox.create();
        const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");
        sandbox.stub(probabilityService, "pickFromDeck").returns(Config.IncrementString);
      });
      afterEach(() => {
        sandbox.restore();
      });
      it("should return a map with values being 1", () => {
        const sectorDecks = new Map<string, string[]>();
        sectorDecks.set("Busniess", ["increment", "increment"]);
        sectorDecks.set("Marketing", ["increment", "increment"]);
        const sectorDeck = sectorTrendsService.getScore(sectorDecks);
        expect(sectorDeck).to.be.an.instanceOf(Object);
        sectorDeck.forEach((value, key) => {
          expect(value).to.be.equal(1);
        });
      });
    });

    describe("Testing for decrement" , () => {
      const sectorTrendsService = GlobalDI.get<SectorTrendsService>("SectorTrendsService");
      let sandbox: any;
      beforeEach(() => {
        sandbox = sinon.sandbox.create();
        const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");
        sandbox.stub(probabilityService, "pickFromDeck").returns(Config.DecrementString);
      });
      afterEach(() => {
        sandbox.restore();
      });
      it("should return a map with values being -1", () => {
        const sectorDecks = new Map<string, string[]>();
        sectorDecks.set("Busniess", ["decrement", "decrement"]);
        sectorDecks.set("Marketing", ["decrement", "decrement"]);
        const sectorDeck = sectorTrendsService.getScore(sectorDecks);
        expect(sectorDeck).to.be.an.instanceOf(Object);
        sectorDeck.forEach((value, key) => {
          expect(value).to.be.equal(-1);
        });
      });
    });

    describe("Testing for constant" , () => {
      const sectorTrendsService = GlobalDI.get<SectorTrendsService>("SectorTrendsService");
      let sandbox: any;
      beforeEach(() => {
        sandbox = sinon.sandbox.create();
        const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");
        sandbox.stub(probabilityService, "pickFromDeck").returns(Config.ConstantString);
      });
      afterEach(() => {
        sandbox.restore();
      });
      it("should return a map with values being 0", () => {
        const sectorDecks = new Map<string, string[]>();
        sectorDecks.set("Busniess", ["constant", "constant"]);
        sectorDecks.set("Marketing", ["constant", "constant"]);
        const sectorDeck = sectorTrendsService.getScore(sectorDecks);
        expect(sectorDeck).to.be.an.instanceOf(Object);
        sectorDeck.forEach((value, key) => {
          expect(value).to.be.equal(0);
        });
      });
    });
  });
});
