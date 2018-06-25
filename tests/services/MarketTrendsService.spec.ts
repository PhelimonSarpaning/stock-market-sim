import { expect } from "chai";
import * as sinon from "sinon";
import { GlobalDI } from "../../src/inversify.config";
import { MarketTrendsService, ProbabilityService } from "../../src/services";
import { Config } from "../../src/util/Config";

describe("Market Trends Service", () => {

  describe("Testing initializedDeck()", () => {

    describe("Testing case" , () => {
      const marketTrendsService = GlobalDI.get<MarketTrendsService>("MarketTrendsService");
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
        const deck = marketTrendsService.initializeDeck(4);
        expect(deck).to.be.an.instanceOf(Object);
        expect(deck.length).to.be.equal(4);
      });
    });
  });

  // describe("Testing getScore()", () => {

  //   describe("Testing for increment" , () => {
  //     const marketTrendsService = GlobalDI.get<MarketTrendsService>("MarketTrendsService");
  //     let sandbox: any;
  //     beforeEach(() => {
  //       sandbox = sinon.sandbox.create();
  //       const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");
  //       sandbox.stub(probabilityService, "pickFromDeck").returns(Config.IncrementString);
  //       sandbox.stub(probabilityService, "removeFromDeck").returns();
  //     });
  //     afterEach(() => {
  //       sandbox.restore();
  //     });
  //     it("should return a map with values being 1", () => {
  //       const value = marketTrendsService.getScore(["increment", "increment"]);
  //       expect(value).to.be.equal(1);
  //     });
  //   });

  //   describe("Testing for decrement" , () => {
  //     const marketTrendsService = GlobalDI.get<MarketTrendsService>("MarketTrendsService");
  //     let sandbox: any;
  //     beforeEach(() => {
  //       sandbox = sinon.sandbox.create();
  //       const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");
  //       sandbox.stub(probabilityService, "pickFromDeck").returns(Config.DecrementString);
  //       sandbox.stub(probabilityService, "removeFromDeck").returns();
  //     });
  //     afterEach(() => {
  //       sandbox.restore();
  //     });
  //     it("should return a map with values being -1", () => {
  //       const value = marketTrendsService.getScore(["decrement", "decrement"]);
  //       expect(value).to.be.equal(-1);
  //     });
  //   });

  //   describe("Testing for constant" , () => {
  //     const marketTrendsService = GlobalDI.get<MarketTrendsService>("SectorTrendsService");
  //     let sandbox: any;
  //     beforeEach(() => {
  //       sandbox = sinon.sandbox.create();
  //       const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");
  //       sandbox.stub(probabilityService, "pickFromDeck").returns(Config.ConstantString);
  //       sandbox.stub(probabilityService, "removeFromDeck").returns();
  //     });
  //     afterEach(() => {
  //       sandbox.restore();
  //     });
  //     it("should return a map with values being 0", () => {
  //       const value = marketTrendsService.getScore(["constant", "constant"]);
  //       expect(value).to.be.equal(1);
  //     });
  //   });
  // });
});
