import { GatewayIntentBits } from 'discord-api-types/v10';

export type IntentsCheckType = (keyof typeof GatewayIntentBits | number | string)[] | keyof typeof GatewayIntentBits | number | string;

/** Utility class for working with intents */
class IntentsBitField {
  ['constructor']: typeof IntentsBitField;
  bitfield: number;
  /**
   * The default bit
   * @private
   */
  static defaultBit: number;
  /** Object containing all available intents */
  static Flags: typeof GatewayIntentBits;
  constructor(bits: IntentsCheckType) {
    this.bitfield = this.constructor.parse(bits ?? this.constructor.defaultBit);
  }

  /** Adds bits to these ones */
  add(...bits: IntentsCheckType[]) {
    let total = this.constructor.defaultBit;
    for (const bit of bits) total |= this.constructor.parse(bit);
    this.bitfield |= Number(total);
    return this;
  }

  /** Checks whether the bitfield has a bit, or multiple bits */
  has(bit: IntentsCheckType) {
    // eslint-disable-next-line no-param-reassign
    bit = this.constructor.parse(bit);
    return (this.bitfield & bit) === bit;
  }

  /** Removes bits from these */
  remove(...bits) {
    let total = this.constructor.defaultBit;
    for (const bit of bits) {
      total |= this.constructor.parse(bit);
    }
    this.bitfield &= ~total;
    return this;
  }

  /** Gets an Array of {@link GatewayIntentBits} names based on the bits available */
  toArray() {
    return Object.keys(this.constructor.Flags).filter(bit => this.has(bit));
  }

  static parse(bit: IntentsCheckType): number {
    const { defaultBit } = this;
    if (typeof defaultBit === typeof bit && bit >= defaultBit) return Number(bit);
    if (bit instanceof IntentsBitField) return bit.bitfield;
    if (Array.isArray(bit)) {
      return bit
        .map(p => this.parse(p))
        .reduce((prev, p) => {
          return Number(prev | p);
        }, defaultBit);
    }
    if (typeof bit === 'string') {
      if (typeof this.Flags[bit] !== 'undefined') return this.Flags[bit];
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(bit as unknown as number)) return Number(bit);
    }
    throw new TypeError(`Expected bit to be a number, string, array or IntentsBitField`);
  }
}

IntentsBitField.Flags = GatewayIntentBits;
IntentsBitField.defaultBit = 0;

export { IntentsBitField };
