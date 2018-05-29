import { inject, injectable } from "inversify";
import { ProbabilityService } from ".";

@injectable()
export class RandomTrendsService {
  constructor(
    @inject("ProbabilityService") private probabilityService: ProbabilityService,
  ) { }

  public getScore() {
    return Number(this.probabilityService.pickFromDeck([-2 , -1, 0, 1, 2]));
  }
}
