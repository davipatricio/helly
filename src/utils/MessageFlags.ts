import { MessageFlags as APIMessageFlags } from 'discord-api-types/v10';

export type MessageFlagsParser = (keyof typeof APIMessageFlags | number)[] | keyof typeof APIMessageFlags | number;

/** Utility class for working with flags */
class MessageFlags {
  /** Object containing all available flags */
  static Flags: typeof APIMessageFlags;
  bitfield: number;
  /**
   * @example
   * ```js
   *  const flags = new MessageFlags([MessageFlags.Flags.Ephemeral, MessageFlags.Flags.Loading]);
   * ```
   * @example
   * ```js
   *  const flags = new MessageFlags('SuppressEmbeds').add('Urgent');
   * ```
   * @example
   * ```js
   *  const flags = new MessageFlags(4);
   * ```
   */
  constructor(flags: MessageFlagsParser) {
    this.bitfield = this.parse(flags);
  }

  /** Adds bits to these ones */
  add(flags: MessageFlagsParser): this {
    if (typeof flags === 'number') {
      this.bitfield |= flags;
      return this;
    }

    if (typeof flags === 'string') {
      this.bitfield |= APIMessageFlags[flags] as unknown as number;
      return this;
    }

    if (!Array.isArray(flags)) throw new Error('MessageFlags must be an array, number or string');

    flags.forEach(flag => {
      this.bitfield |= typeof flag === 'number' ? flag : APIMessageFlags[flag];
    });

    return this;
  }

  /** Removes a flag from the bitfield */
  remove(flags: MessageFlagsParser) {
    if (typeof flags === 'number') {
      this.bitfield &= ~flags;
      return this;
    }

    if (typeof flags === 'string') {
      this.bitfield &= ~(APIMessageFlags[flags] as unknown as number);
      return this;
    }

    if (!Array.isArray(flags)) throw new Error('MessageFlags must be an array, number or string');

    flags.forEach(flag => {
      this.bitfield &= ~(typeof flag === 'number' ? flag : APIMessageFlags[flag]);
    });

    return this;
  }

  /** Checks whether the bitfield has a flag */
  has(flags: MessageFlagsParser) {
    if (typeof flags === 'number') return (this.bitfield & flags) === flags;
    if (typeof flags === 'string') {
      const flagBit = APIMessageFlags[flags] as unknown as number;
      return (this.bitfield & flagBit) === flagBit;
    }
    if (!Array.isArray(flags)) throw new Error('MessageFlags must be an array, number or string');

    let finalFlags = 0;

    flags.forEach(flag => {
      finalFlags |= typeof flag === 'number' ? flag : APIMessageFlags[flag];
    });

    return (this.bitfield & finalFlags) === finalFlags;
  }

  /** Gets an Array of {@link APIMessageFlags} names based on the bits available */
  toArray() {
    return Object.keys(APIMessageFlags).filter((flag: keyof typeof APIMessageFlags) => this.has(flag));
  }

  /**
   * Parse an array of strings into flags
   * @param flags - MessageFlags to parse
   */
  parse(flags = this.bitfield as MessageFlagsParser) {
    if (typeof flags === 'number') return flags;
    if (typeof flags === 'string') return APIMessageFlags[flags] as unknown as number;
    if (!Array.isArray(flags)) throw new Error('MessageFlags must be an array, number or string');

    let finalFlags = 0;

    flags.forEach(flag => {
      finalFlags |= typeof flag === 'number' ? flag : APIMessageFlags[flag];
    });

    return finalFlags;
  }
}

MessageFlags.Flags = APIMessageFlags;

export { MessageFlags };
