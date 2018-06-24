import { injectable } from "inversify";
import * as shuffle from "shuffle-array";

@injectable()
export class ProbabilityService {

  /**
   * @description this functions takes in the string and respective weight for each string and calculates
   * according the given weight how many times the string should be repeated(with relation to the total weight).
   * It then shuffles the result array to make it random.
   * @param weights map of <string,number> representing a string and the weight given to it.
   * @param rounds is the number of rounds
   * @returns it returns a string array of random events/trends/strings
   * @note the probability is considerd using the weights
   */
  public generateDeck(weights: Map<string, number>, rounds: number) {
    let deck: string[] = [];
    let totalWeight = 0;
    weights.forEach((value) => {
      totalWeight += value;
    });
    // The (rounds * (weight / totalWeight)) helps calculate the number of times a
    // particular event/trend/string should occur
    weights.forEach((weight, key) => {
      for (let i = 0; i < Math.ceil(rounds * (weight / totalWeight)); i++) {
        deck.push(key);
      }
    });
    deck = shuffle(deck);
    return deck;
  }

  /**
   * @description this functions takes in string | number array and returns an element from that randomly
   * @param deck send a string or number array
   */
  public pickFromDeck(deck: string[] | number[]) {
    const elemIndex = Math.ceil(Math.random() * 10000) % deck.length;
    return deck[elemIndex];
  }

  /**
   * @description this function will take in an array and the element that has to be removed and returns the
   * new array without the element
   * @param deck send a string | number array from which the element has to be removed
   * @param pick the string | number that has to be removed
   */
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

  /**
   * @description this function simulates a coin toss using Math.random
   * @returns boolean, true false for heads, tails respectively
   */
  public tossCoin(): boolean {
    if (Math.ceil(Math.random() * 10000) % 2 === 1) {
      return true;
    } else {
      return false;
    }
  }

}
