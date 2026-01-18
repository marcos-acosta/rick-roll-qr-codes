import { selectRandom } from "./util";

export default class Sampler<T> {
  data: Array<T>;
  remainingIndexes: Set<number>;

  constructor(data: Array<T>) {
    this.data = data;
    this.remainingIndexes = new Set(Array(data.length).keys());
  }

  public reset() {
    this.remainingIndexes = new Set(Array(this.data.length).keys());
  }

  sample() {
    if (this.remainingIndexes.size === 0) {
      this.reset();
    }
    const indexToSelect = selectRandom([...this.remainingIndexes]);
    this.remainingIndexes.delete(indexToSelect);
    return this.data[indexToSelect];
  }
}
