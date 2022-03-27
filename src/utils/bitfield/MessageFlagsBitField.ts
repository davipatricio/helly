import { MessageFlags } from 'discord-api-types/v10';

export type MessageFlagsCheckType = (keyof typeof MessageFlags | number | string)[] | keyof typeof MessageFlags | number | string;

/** Utility class for working with message flags */
class MessageFlagsBitField {
  bitfield: number;

  /** The default bit */
  static defaultBit = 0;
  /** Object containing all available message flags */
  static Flags = MessageFlags;

  constructor(bits: MessageFlagsCheckType) {
    this.bitfield = MessageFlagsBitField.parse(bits ?? MessageFlagsBitField.defaultBit);
  }

  /** Adds bits to these ones */
  add(...bits: MessageFlagsCheckType[]) {
    let total = MessageFlagsBitField.defaultBit;
    for (const bit of bits) total |= MessageFlagsBitField.parse(bit);
    this.bitfield |= Number(total);
    return this;
  }

  /** Checks whether the bitfield has a bit, or multiple bits */
  has(bit: MessageFlagsCheckType) {
    // eslint-disable-next-line no-param-reassign
    bit = MessageFlagsBitField.parse(bit);
    return (this.bitfield & bit) === bit;
  }

  /** Removes bits from these */
  remove(...bits) {
    let total = MessageFlagsBitField.defaultBit;
    for (const bit of bits) {
      total |= MessageFlagsBitField.parse(bit);
    }
    this.bitfield &= ~total;
    return this;
  }

  /** Gets an Array of {@link MessageFlags} names based on the bits available */
  toArray() {
    return Object.keys(MessageFlagsBitField.Flags).filter(bit => this.has(bit));
  }

  static parse(bit: MessageFlagsCheckType): number {
    const { defaultBit } = this;
    if (typeof defaultBit === typeof bit && bit >= defaultBit) return Number(bit);
    if (bit instanceof MessageFlagsBitField) return bit.bitfield;
    if (Array.isArray(bit)) {
      return bit
        .map(p => this.parse(p))
        .reduce((prev, p) => {
          return Number(prev | p);
        }, defaultBit);
    }
    if (typeof bit === 'string') {
      if (typeof this.Flags[bit] !== 'undefined') return this.Flags[bit];
      if (!isNaN(bit as unknown as number)) return Number(bit);
    }
    throw new TypeError(`Expected bit to be a number, string, array or MessageFlagsBitField`);
  }
}

export { MessageFlagsBitField };
