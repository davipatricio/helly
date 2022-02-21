import { GatewayIntentBits } from 'discord-api-types/v10';

export type IntentParser = (keyof typeof GatewayIntentBits | number)[] | GatewayIntentBits | number;

/** Utility class for working with intents */
class Intents {
  /** Object containing all available intents */
  static Flags: typeof GatewayIntentBits;
  bitfield: number;
  constructor(intents: IntentParser) {
    this.bitfield = this.parse(intents);
  }

  /** Adds bits to these ones */
  add(intent: keyof typeof GatewayIntentBits | number) {
    if (typeof intent === 'number') this.bitfield |= intent;
    else this.bitfield |= GatewayIntentBits[intent];
    return this;
  }

  /** Removes an intent from the bitfield */
  remove(intent: keyof typeof GatewayIntentBits | number) {
    if (typeof intent === 'number') this.bitfield &= ~intent;
    else this.bitfield &= ~GatewayIntentBits[intent];
    return this;
  }

  /** Checks whether the bitfield has a intent */
  has(intent: keyof typeof GatewayIntentBits | number) {
    if (typeof intent === 'number') return (this.bitfield & intent) === intent;
    return (this.bitfield & GatewayIntentBits[intent]) === GatewayIntentBits[intent];
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
      const bitfield = GatewayIntentBits[intent] as number;
      finalIntents |= bitfield;
    });

    return finalIntents;
  }
}

Intents.Flags = GatewayIntentBits;

export { Intents };
