import { expect } from "chai";
import * as sinon from "sinon";
import { GlobalDI } from "../../src/inversify.config";
import { ProbabilityService, SectorTrendsService } from "../../src/services";
import { Config } from "../../src/util/Config";

describe("Market Events Service", () => {

  describe("Testing initializeEventDeck()", () => {

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

});
