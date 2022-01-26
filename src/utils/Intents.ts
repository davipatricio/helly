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
	public static parse(intents: (string | number | undefined)[] | number): number {
		if (typeof intents === 'number') return intents;
		if (!Array.isArray(intents)) throw new Error('Intents must be an array or number');

		let finalIntents = 0;

		for(const intent of intents) {
			const bitfield = FLAGS[intent as IntentNames];
			if (!bitfield && typeof intent === 'number') {
				finalIntents |= intent;
				continue;
			}
			if(bitfield) finalIntents |= bitfield;
		}

		return finalIntents;
	}
}

export { Intents };