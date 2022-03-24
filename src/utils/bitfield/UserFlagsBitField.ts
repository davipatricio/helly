import { UserFlags } from 'discord-api-types/v10';

export type UserFlagsCheckType = (keyof typeof UserFlags | number | string)[] | keyof typeof UserFlags | number | string;

/** Utility class for working with user flags */
class UserFlagsBitField {
  bitfield: number;

  /** The default bit */
  static defaultBit = 0;
  /** Object containing all available user flags */
  static Flags = UserFlags;

  constructor(bits: UserFlagsCheckType) {
    this.bitfield = UserFlagsBitField.parse(bits ?? UserFlagsBitField.defaultBit);
  }

  /** Adds bits to these ones */
  add(...bits: UserFlagsCheckType[]) {
    let total = UserFlagsBitField.defaultBit;
    for (const bit of bits) total |= UserFlagsBitField.parse(bit);
    this.bitfield |= Number(total);
    return this;
  }

  /** Checks whether the bitfield has a bit, or multiple bits */
  has(bit: UserFlagsCheckType) {
    // eslint-disable-next-line no-param-reassign
    bit = UserFlagsBitField.parse(bit);
    return (this.bitfield & bit) === bit;
  }

  /** Removes bits from these */
  remove(...bits) {
    let total = UserFlagsBitField.defaultBit;
    for (const bit of bits) {
      total |= UserFlagsBitField.parse(bit);
    }
    this.bitfield &= ~total;
    return this;
  }

  /** Gets an Array of {@link UserFlags} names based on the bits available */
  toArray() {
    return Object.keys(UserFlagsBitField.Flags).filter(bit => this.has(bit));
  }

  static parse(bit: UserFlagsCheckType): number {
    const { defaultBit } = this;
    if (typeof defaultBit === typeof bit && bit >= defaultBit) return Number(bit);
    if (bit instanceof UserFlagsBitField) return bit.bitfield;
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
    throw new TypeError(`Expected bit to be a number, string, array or UserFlagsBitField`);
  }
}

export { UserFlagsBitField };
