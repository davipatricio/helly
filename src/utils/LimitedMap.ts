/** A Map that have a limited size and will remove the oldest items once the max size is reached */
class LimitedMap<K, V> extends Map<K, V> {
  /** The maximum limit of this map */
  limit: number;
  /** @param limit - The maximum size of the map */
  constructor(limit = Infinity) {
    super();
    this.limit = limit;
  }

  /**
   * Adds or updates an element with a specified key and a value
   * @param key - The key of the element to add or update
   * @param value - The value of the element to add or update
   */
  override set(key: K, value: V) {
    if (this.limit <= 0) return this;
    if (this.size >= this.limit) {
      this.delete(this.keys().next().value);
    }

    return super.set(key, value);
  }

  /** Sorts the map with the provided function */
  sort(fn: (a: any, b: any) => number) {
    return this.valueArray().sort(fn);
  }

  /** Returns an array with all keys */
  keyArray() {
    return [...this.keys()];
  }

  /** Returns an array with all values */
  valueArray() {
    return [...this.values()];
  }

  /**
   * Maps each item to another value into an array
   * @param fn - Function that produces an element of the new array, taking three arguments
   */
  map(fn: (value: any, index: number, array: any[]) => any) {
    return this.valueArray().map(fn);
  }

  /**
   * Returns an array with a random value or N random values
   * @param items - The number of values to return
   */
  random(items = 1): V | V[] {
    if (items < 1 || this.size === 0) return [];
    if (items === 1) return this.valueArray()[Math.floor(Math.random() * this.size)];

    if (items >= this.size) return this.valueArray();

    // Select N random items
    const keys: any[] = [];
    for (let i = 0; i < items; i++) {
      keys.push(this.keyArray()[Math.floor(Math.random() * this.size)]);
    }
    return keys;
  }
}

export { LimitedMap };
