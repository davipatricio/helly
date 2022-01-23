/**
 * Options for {@link ClientOptions}#cache
 * @typedef {Object} ClientCacheOptions
 * @property {number} [guilds=Infinity] - Maximum number of {@link Guild}s to cache
 * @property {number} [channels=Infinity] - Maximum number of {@link Channel}s to cache
 * @property {number} [channels=Infinity] - Maximum number of Guild{@link Channel}s to cache
 * @property {number} [users=Infinity] - Maximum number of {@link User}s to cache
 */
export interface ClientCacheOptions {
	guilds?: number;
	channels?: number;
	guildChannels?: number;
	users?: number;
	members?: number;
	presences?: number;
	messages?: number;
	emojis?: number;
	roles?: number;
}

/**
 * Options for a {@link Client}
 * @typedef {Object} ClientOptions
 * @property {boolean} [autoReconnect=true] - If the client should automatically reconnect to the gateway
 * @property {number} [shardCount=1] - The total amount of shards used by this bot
 * @property {number[]} [shards=[0, 1]] - The shard's id to run, or an array of shard ids
 * @property {number} [apiVersion=9] - API version to use
 * @property {number} [largeThreshold=9] - Number of members in a guild after which offline users will no longer be sent in the initial guild member list, must be between 50 and 250
 * @property {string[]|number} [intents=0] - {@link Intents} to enable for this connection
 * @property {string[]} [disabledEvents=[]] - Events to disable
 * @property {boolean} [failIfNotExists=false] - Default value for {@link MessageReference#fail_if_not_exists}
 * @property {ClientCacheOptions} [cache] - Limit chaching of specific structures to reduce CPU/memory usage
 */
export interface ClientOptions {
	autoReconnect?: boolean;
	shardId?: number;
	shardCount?: number;
	shards?: number[];
	apiVersion?: number;
	largeThreshold?: number;
	intents?: Array<string | undefined> | number;
	disabledEvents?: string[];
	failIfNotExists?: boolean;
	cache?: ClientCacheOptions;
}

export const defaultValues: ClientOptions = {
	autoReconnect: true,
	disabledEvents: [],

	// Data sent in IDENTIFY payload
	shardId: 0,
	shardCount: 1,

	apiVersion: 9,

	intents: [],
	largeThreshold: 50,

	// Default message options
	failIfNotExists: false,
};