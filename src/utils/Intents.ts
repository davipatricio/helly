import { GatewayIntentBits } from 'discord-api-types/v10';

export type IntentParser = (keyof typeof GatewayIntentBits | number)[] | number;

class Intents extends null {
  /** Object containing all available intents */
  static Flags: typeof GatewayIntentBits;

  /**
   * Parse an array of strings into intents
   * @param intents - Intents to parse
   */
  static parse(intents: IntentParser): number {
    if (typeof intents === 'number') return intents;
    if (!Array.isArray(intents)) throw new Error('Intents must be an array or number');

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
