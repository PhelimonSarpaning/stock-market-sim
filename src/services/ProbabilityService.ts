import { injectable } from "inversify";
import * as shuffle from "shuffle-array";

@injectable()
export class ProbabilityService {

  public generateDeck(weights: Map<string, number>, rounds: number) {
    let deck: string[] = [];
    let totalWeight = 0;
    weights.forEach((value) => {
      totalWeight += value;
    });
    // let count = 0;
    weights.forEach((weight, key) => {
      for (let i = 0; i < Math.ceil(rounds * (weight / totalWeight)); i++) {
        deck.push(key);
      }
    });
    deck = shuffle(deck);
    return deck;
  }

  public pickFromDeck(deck: string[] | number[]) {
    const elemIndex = Math.ceil(Math.random() * 10000) % deck.length;
    return deck[elemIndex];
  }

  public removeFromDeck(deck: string[], pick: string) {
    let deleted = false;
    deck.forEach((element, index) => {
      if (element === pick && !deleted) {
        deck.splice(index, 1);
        deleted = true;
      }
    });
    return deck;
  }

  public tossCoin(): boolean {
    if (Math.ceil(Math.random() * 10000) % 2 === 1) {
      return true;
    } else {
      return false;
    }
  }

}
