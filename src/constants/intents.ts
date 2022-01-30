/**
 * Numeric intents flags. All available properties:
 * * `GUILDS`
 * * `GUILD_MEMBERS`
 * * `GUILD_BANS`
 * * `GUILD_EMOJIS_AND_STICKERS`
 * * `GUILD_INTEGRATIONS`
 * * `GUILD_WEBHOOKS`
 * * `GUILD_INVITES`
 * * `GUILD_VOICE_STATES`
 * * `GUILD_PRESENCES`
 * * `GUILD_MESSAGES`
 * * `GUILD_MESSAGE_REACTIONS`
 * * `GUILD_MESSAGE_TYPING`
 * * `DIRECT_MESSAGE_REACTIONS`
 * * `DIRECT_MESSAGE_TYPING`
 * * `GUILD_SCHEDULED_EVENTS`
 * @see {@link https://discord.com/developers/docs/topics/gateway#gateway-intents}
 * @typedef {Object<string, bigint>} IntentFlags
 */
const FLAGS = {
	GUILDS: 1n << 0n,
	GUILD_MEMBERS: 1n << 1n,
	GUILD_BANS: 1n << 2n,
	GUILD_EMOJIS_AND_STICKERS: 1n << 3n,
	GUILD_INTEGRATIONS: 1n << 4n,
	GUILD_WEBHOOKS: 1n << 5n,
	GUILD_INVITES: 1n << 6n,
	GUILD_VOICE_STATES: 1n << 7n,
	GUILD_PRESENCES: 1n << 8n,
	GUILD_MESSAGES: 1n << 9n,
	GUILD_MESSAGE_REACTIONS: 1n << 10n,
	GUILD_MESSAGE_TYPING: 1n << 11n,
	DIRECT_MESSAGES: 1n << 12n,
	DIRECT_MESSAGE_REACTIONS: 1n << 13n,
	DIRECT_MESSAGE_TYPING: 1n << 14n,
	GUILD_SCHEDULED_EVENTS: 1n << 16n,
	ALL: BigInt(0),
};

FLAGS.ALL = Object.values(FLAGS).reduce((a, b) => a | b);

type IntentNames = keyof typeof FLAGS;

export { FLAGS, IntentNames };