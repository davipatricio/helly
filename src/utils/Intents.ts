/**
 * Utility class for working with intents
 * @hideconstructor
 */
class Intents extends null {
	/**
	 * Parse strings into intents.
	 * @param {Array<string | number | undefined> | number | undefined} intents - Intents to calculate
	 * @returns {number}
	 */
	public static parse(intents: Array<string | number | undefined> | number | undefined): number {
		if (typeof intents === 'number') return intents;
		if (!Array.isArray(intents)) throw new Error('Intents must be an array or number');

		let finalIntents = 0;
		for (const intent of intents) {
			switch (intent) {
			case 'GUILDS':
				finalIntents |= 1 << 0;
				break;
			case 'GUILD_MEMBERS':
				finalIntents |= 1 << 1;
				break;
			case 'GUILD_BANS':
				finalIntents |= 1 << 2;
				break;
			case 'GUILD_EMOJIS_AND_STICKERS':
				finalIntents |= 1 << 3;
				break;
			case 'GUILD_INTEGRATIONS':
				finalIntents |= 1 << 4;
				break;
			case 'GUILD_WEBHOOKS':
				finalIntents |= 1 << 5;
				break;
			case 'GUILD_INVITES':
				finalIntents |= 1 << 6;
				break;
			case 'GUILD_VOICE_STATES':
				finalIntents |= 1 << 7;
				break;
			case 'GUILD_PRESENCES':
				finalIntents |= 1 << 8;
				break;
			case 'GUILD_MESSAGES':
				finalIntents |= 1 << 9;
				break;
			case 'GUILD_MESSAGE_REACTIONS':
				finalIntents |= 1 << 10;
				break;
			case 'GUILD_MESSAGE_TYPING':
				finalIntents |= 1 << 11;
				break;
			case 'DIRECT_MESSAGES':
				finalIntents |= 1 << 12;
				break;
			case 'DIRECT_MESSAGE_REACTIONS':
				finalIntents |= 1 << 13;
				break;
			default:
				finalIntents |= typeof intent === 'string' ? 0 : finalIntents;
				break;
			}
		}
		return finalIntents;
	}
}

export { Intents };