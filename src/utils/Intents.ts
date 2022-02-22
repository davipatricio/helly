import { GatewayIntentBits } from 'discord-api-types/v10';

export type IntentParser = (keyof typeof GatewayIntentBits | number)[] | keyof typeof GatewayIntentBits | number;

/** Utility class for working with intents */
class Intents {
  /** Object containing all available intents */
  static Flags: typeof GatewayIntentBits;
  bitfield: number;
  constructor(intents: IntentParser) {
    this.bitfield = this.parse(intents);
  }

  /** Adds bits to these ones */
  add(intents: IntentParser): this {
    if (typeof intents === 'number') {
      this.bitfield |= intents;
      return this;
    }

    if (typeof intents === 'string') {
      this.bitfield |= GatewayIntentBits[intents] as unknown as number;
      return this;
    }

    if (!Array.isArray(intents)) throw new Error('Intents must be an array, number or string');

    intents.forEach(intent => {
      this.bitfield |= typeof intent === 'number' ? intent : GatewayIntentBits[intent];
    });

    return this;
  }

  /** Removes an intent from the bitfield */
  remove(intents: IntentParser) {
    if (typeof intents === 'number') {
      this.bitfield &= ~intents;
      return this;
    }

    if (typeof intents === 'string') {
      this.bitfield &= ~(GatewayIntentBits[intents] as unknown as number);
      return this;
    }

    if (!Array.isArray(intents)) throw new Error('Intents must be an array, number or string');

    intents.forEach(intent => {
      this.bitfield &= ~(typeof intent === 'number' ? intent : GatewayIntentBits[intent]);
    });

    return this;
  }

  /** Checks whether the bitfield has a intent */
  has(intents: IntentParser) {
    if (typeof intents === 'number') return (this.bitfield & intents) === intents;
    if (typeof intents === 'string') {
      const intentBit = GatewayIntentBits[intents] as unknown as number;
      return (this.bitfield & intentBit) === intentBit;
    }
    if (!Array.isArray(intents)) throw new Error('Intents must be an array, number or string');

    let finalIntents = 0;

    intents.forEach(intent => {
      finalIntents |= typeof intent === 'number' ? intent : GatewayIntentBits[intent];
    });

    return (this.bitfield & finalIntents) === finalIntents;
  }

  /** Gets an Array of {@link GatewayIntentBits} names based on the bits available */
  toArray() {
    return Object.keys(GatewayIntentBits).filter((intent: keyof typeof GatewayIntentBits) => this.has(intent));
  }

  /**
   * Parse an array of strings into intents
   * @param intents - Intents to parse
   */
  parse(intents = this.bitfield as IntentParser) {
    if (typeof intents === 'number') return intents;
    if (typeof intents === 'string') return GatewayIntentBits[intents] as unknown as number;
    if (!Array.isArray(intents)) throw new Error('Intents must be an array, number or string');

    let finalIntents = 0;

    intents.forEach(intent => {
      finalIntents |= typeof intent === 'number' ? intent : GatewayIntentBits[intent];
    });

    return finalIntents;
  }
}

Intents.Flags = GatewayIntentBits;

export { Intents };
