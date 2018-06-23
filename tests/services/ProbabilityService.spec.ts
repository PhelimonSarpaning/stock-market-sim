import { expect } from "chai";
import * as shuffle from "shuffle-array";
import * as sinon from "sinon";
import { GlobalDI } from "../../src/inversify.config";
import { ProbabilityService, SectorTrendsService } from "../../src/services";
import { Config } from "../../src/util/Config";

describe("Probability Service", () => {

  describe("Testing generateDeck()", () => {

    describe("Testing sunny case", () => {
      const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");
      let sandbox: any;
      beforeEach(() => {
        sandbox = sinon.sandbox.create();
        // const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");
        // sandbox.stub(, "generateDeck").returns([]);
      });
      afterEach(() => {
        sandbox.restore();
      });
      it("should return an array with values", () => {
        //
        const weights = new Map<string, number>();
        weights.set("Marketing", 8);
        weights.set("Business", 2);
        const deck = probabilityService.generateDeck(weights, 10);
        let countMarketing: number = 0;
        let countBusiness: number = 0;
        deck.forEach((element) => {
          if (element === "Marketing") {
            countMarketing++;
          } else if (element === "Business") {
            countBusiness++;
          }
        });
        expect(countBusiness).to.be.equal(2);
        expect(countMarketing).to.be.equal(8);
      });
    });
  });

  describe("Testing pickFromDeck()", () => {
    const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");

    it("should return a string", () => {
      const weights = new Map<string, number>();
      const deck = ["abc", "efg", "hij", "klm"];
      const pick = probabilityService.pickFromDeck(deck);
      expect(deck.indexOf(pick as string) !== -1).to.be.equal(true);
    });

    it("should return a number", () => {
      const weights = new Map<string, number>();
      const deck = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const pick = probabilityService.pickFromDeck(deck);
      expect(deck.indexOf(pick as number) !== -1).to.be.equal(true);
    });
  });

  describe("Testing pickFromDeck()", () => {
    const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");

    it("should return a string", () => {
      const deck = ["abc", "efg", "hij", "klm"];
      const pick = probabilityService.pickFromDeck(deck);
      expect(deck.indexOf(pick as string) !== -1).to.be.equal(true);
    });

    it("should return a number", () => {
      const deck = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const pick = probabilityService.pickFromDeck(deck);
      expect(deck.indexOf(pick as number) !== -1).to.be.equal(true);
    });
  });

  describe("Testing removeFromDeck()", () => {
    const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");

    it("should return a string", () => {
      const deck = ["abc", "efg", "hij", "klm"];
      probabilityService.removeFromDeck(deck, "klm");
      expect(deck.indexOf("klm") === -1).to.be.equal(true);
    });
  });

  describe("Testing tossCoin()", () => {
    const probabilityService = GlobalDI.get<ProbabilityService>("ProbabilityService");

    it("should return boolean", () => {
      const toss = probabilityService.tossCoin();
      expect(toss).to.be.an("boolean");
    });
  });

});
