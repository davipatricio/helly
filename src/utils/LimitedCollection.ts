import { Collection } from '@discordjs/collection';

/** A Map that have a limited size and will remove the oldest items once the max size is reached */
class LimitedCollection<K, V> extends Collection<K, V> {
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
}

export { LimitedCollection };
