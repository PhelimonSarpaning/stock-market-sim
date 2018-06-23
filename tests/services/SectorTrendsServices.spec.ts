import { expect } from "chai";
import * as sinon from "sinon";
import { GlobalDI } from "../../src/inversify.config";
import { ProbabilityService, SectorTrendsService } from "../../src/services";
import { Config } from "../../src/util/Config";

describe("Sector Trends Service", () => {

  describe("Testing initializedDeck()", () => {

    describe("Testing sunny case" , () => {
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
      it("should return an object", () => {
        //
        const sectorDeck = sectorTrendsService.initializeDeck(4, ["Business", "Marketing"]);
        expect(sectorDeck).to.be.an.instanceOf(Object);
      });
    });
  });

  // describe("Testing getScore()", () => {

  //   describe("Testing sunny case" , () => {
  //     const sectorTrendsService = GlobalDI.get<SectorTrendsService>("SectorTrendsService");
  //     let sandbox: any;
  //     beforeEach(() => {
  //       sandbox = sinon.sandbox.create();
  //       const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");
  //       sandbox.stub(probabilityService, "pickFromDeck").returns(Config.IncrementString);
  //     });
  //     afterEach(() => {
  //       sandbox.restore();
  //     });
  //     it("should return an object", () => {
  //       const sectorDecks = new Map<string, string[]>();
  //       sectorDecks.set("Busniess", "")
  //       const sectorDeck = sectorTrendsService.getScore(sectorDecks);
  //       expect(sectorDeck).to.be.an.instanceOf(Object);
  //     });
  //   });
  // });
});
