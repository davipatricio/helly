import { GuildSystemChannelFlags } from 'discord-api-types/v10';

export type SystemChannelFlagsCheckType = (keyof typeof GuildSystemChannelFlags | number | string)[] | keyof typeof GuildSystemChannelFlags | number | string;

/** Utility class for working with user flags */
class SystemChannelFlagsBitField {
  bitfield: number;

  /** The default bit */
  static defaultBit = 0;
  /** Object containing all available user flags */
  static Flags = GuildSystemChannelFlags;

  constructor(bits: SystemChannelFlagsCheckType) {
    this.bitfield = SystemChannelFlagsBitField.parse(bits ?? SystemChannelFlagsBitField.defaultBit);
  }

  /** Adds bits to these ones */
  add(...bits: SystemChannelFlagsCheckType[]) {
    let total = SystemChannelFlagsBitField.defaultBit;
    for (const bit of bits) total |= SystemChannelFlagsBitField.parse(bit);
    this.bitfield |= Number(total);
    return this;
  }

  /** Checks whether the bitfield has a bit, or multiple bits */
  has(bit: SystemChannelFlagsCheckType) {
    // eslint-disable-next-line no-param-reassign
    bit = SystemChannelFlagsBitField.parse(bit);
    return (this.bitfield & bit) === bit;
  }

  /** Removes bits from these */
  remove(...bits) {
    let total = SystemChannelFlagsBitField.defaultBit;
    for (const bit of bits) {
      total |= SystemChannelFlagsBitField.parse(bit);
    }
    this.bitfield &= ~total;
    return this;
  }

  /** Gets an Array of {@link UserFlags} names based on the bits available */
  toArray() {
    return Object.keys(SystemChannelFlagsBitField.Flags).filter(bit => this.has(bit));
  }

  static parse(bit: SystemChannelFlagsCheckType): number {
    const { defaultBit } = this;
    if (typeof defaultBit === typeof bit && bit >= defaultBit) return Number(bit);
    if (bit instanceof SystemChannelFlagsBitField) return bit.bitfield;
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
    throw new TypeError(`Expected bit to be a number, string, array or SystemChannelFlagsBitField`);
  }
}

export { SystemChannelFlagsBitField };
