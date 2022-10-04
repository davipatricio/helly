export class LimitedMap<T> extends Map<string, T> {
  constructor(public limit: number) {
    super();
  }

  override set(key: string, value: T) {
    if (this.size === this.limit) {
      this.delete(this.keys().next().value);
    }

    return super.set(key, value);
  }
}
