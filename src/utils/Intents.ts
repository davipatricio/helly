import { IntentNames, FLAGS } from '../constants/intents';

/**
 * Utility class for working with intents
 */
class Intents extends null {
	/**
	 * Parse strings into intents.
	 * @param {Array<string | number | undefined> | number} intents - Intents to calculate
	 * @example
	 * const intents = Intents.parse(['GUILDS', 'GUILD_MESSAGES']);
	 * @example
	 * const intents = Intents.parse(513);
	 * @example
	 * const intents = Intents.parse([1, 512]);
	 * @returns {number}
	 */
	static parse(intents: (string | number | bigint | undefined)[] | number | bigint): bigint {
		if (typeof intents === 'number') return BigInt(intents);
		if (typeof intents === 'bigint') return intents;
		if (!Array.isArray(intents)) throw new Error('Intents must be an array or number');

		let finalIntents = 0n;

		for(const intent of intents) {
			const bitfield = FLAGS[intent as IntentNames];
			if (!bitfield && typeof intent === 'number') {
				finalIntents |= BigInt(intent);
				continue;
			}
			if (!bitfield && typeof intent === 'bigint') {
				finalIntents |= intent;
				continue;
			}
			if(bitfield) finalIntents |= bitfield;
		}

		return finalIntents;
	}

	/**
	 * Numeric intents flags
	 * @type {IntentFlags}
	 */
	static get FLAGS(): Record<IntentNames, bigint> {
		return FLAGS;
	}
}

export { Intents };