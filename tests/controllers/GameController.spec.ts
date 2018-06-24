// import { assert, expect } from "chai";
// import * as httpMocks from "node-mocks-http";
// import { SinonStub } from "sinon";
// import sinon = require("sinon");
// import { GameController } from "../../src/controllers/GameController";
// import { Game } from "../../src/models";
// import { GameService } from "../../src/services";
// import { GlobalDI } from "./../../src/inversify.config";

// describe("Testing GameDAO", () => {
//   beforeEach(() => {
//     GlobalDI.snapshot();
//   });

//   afterEach(() => {
//     GlobalDI.restore();
//   });

//   describe("Testing createGame()", () => {

//     describe("Test sunny case", () => {
//       let sandbox: any;
//       let stub: SinonStub;
//       const gameController = GlobalDI.get<GameController>("GameController");

//       beforeEach(() => {
//         // GlobalDI
//         sandbox = sinon.sandbox.create();
//         const gameService = GlobalDI.get<GameService>("GameService");
//         const resObj = {
//           currentRound: 0,
//           gameId: "804922nbfh02289",
//           name: "ummes",
//           round: {
//             event: {},
//             roundNo: 0,
//             stocks: [
//               {
//                 randomTrend: 3,
//                 value: 102,
//               },
//             ],
//           },
//         };
//         stub = sinon.stub(gameService, "startGame").resolves(resObj);

//       });

//       afterEach(() => {
//         stub.restore();
//       });

//       it("should reslove a object of type Game ", (done) => {
//         const request = httpMocks.createRequest({
//           body: {
//             gameName: "ummes",
//           },
//           method: "POST",
//         });

//         const response = httpMocks.createResponse({
//           eventEmitter: require("events").EventEmitter,
//         });
//         response.on("close", () => {
//           console.log(response._getData());
//           done();
//         });
//         gameController.createGame(request, response, {} as any);
//         // request.setEncoding()
//         // const data = JSON.parse(response._getData());
//         // console.log(res);
//         // done();
//         // expect(data.round.stocks[0].randomTrend).to.be.equal(undefined);
//       });
//     });

//     // describe("Test rainy case", () => {
//     //   let sandbox: any;
//     //   const gameDAO = GlobalDI.get<GameDAO>("GameDAO");

//     //   beforeEach(() => {
//     //     sandbox = sinon.sandbox.create();
//     //     sandbox.stub(GameSchema, "create").rejects(new Error());

//     //   });

//     //   afterEach(() => {
//     //     sandbox.restore();
//     //   });

//     //   it("should reslove a object of type Game ", () => {
//     //     const game = GlobalDI.get<Game>("Game");
//     //     game.rounds = [];
//     //     game.currentRound = 2;
//     //     game.name = "ummes";
//     //     game.sectorsCompanyMap = {};
//     //     return gameDAO.save(game).catch((err) => {
//     //       expect(err).to.be.an.instanceof(Error);
//     //     });
//     //   });
//     //   const req = new Request();

//     // });

//   });
// });
