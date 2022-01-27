import EventEmitter from 'node:events';
import { ActionManager } from '../actions/ActionManager';
import { AnyChannel, ChannelManager } from '../managers/ChannelManager';
import { GuildManager } from '../managers/GuildManager';
import { UserManager } from '../managers/UserManager';
import { Intents } from '../utils/Intents';
import { Requester } from '../utils/Requester';
import { ClientOptions, defaultValues } from './ClientOptions';
import * as Heartbeater from './websocket/Heartbeater';
import { WebsocketManager } from './websocket/WebsocketManager';

/**
 * The main hub for interacting with the Discord API, and the starting point for any bot
 * @extends {EventEmitter}
 * @param {ClientOptions} options Options to pass to the client
 */
class Client extends EventEmitter {
	api: any;
	user: null;
	ping: number;
	token: string;
	ready: boolean;
	// Managers
	ws: WebsocketManager;
	actions: ActionManager;
	guilds: GuildManager;
	users: UserManager;
	channels: ChannelManager;
	// Other
	options: ClientOptions;
	requester!: Requester;
	constructor(options?: ClientOptions) {
		super();

		this.options = Object.assign(defaultValues, options);
		this.options.cache = Object.assign({
			guilds: Infinity,
			channels: Infinity,
			guildChannels: Infinity,
			users: Infinity,
			members: Infinity,
			presences: Infinity,
			messages: 100,
			emojis: 300,
			roles: Infinity,
		}, options?.cache);
		this.options.intents = Intents.parse(this.options.intents ?? 0);

		this.api = {};
		this.ready = false;

		/**
		 * User that the client is logged in as
		 * @type {?ClientUser}
		 **/
		this.user = null;

		/**
		 * The average ping of the {@link Client}
		 * @type {number}
		 * @readonly
		 **/
		this.ping = -1;

		/**
		 * Authorization token for the logged in bot
		 * @type {string}
		 */
		this.token = '';

		this.checkOptions(this.options);
		this.ws = new WebsocketManager(this);
		this.actions = new ActionManager();

		/**
		 * All of the guilds the client is currently handling, mapped by their ids
		 * @type {GuildManager}
		 */
		this.guilds = new GuildManager(this, this.options.cache?.guilds as number);

		/**
		 * All of the {@link User} objects that have been cached at any point, mapped by their ids
		 * @type {UserManager}
		 */
		this.users = new UserManager(this, this.options.cache?.users as number);

		/**
		 * All of the {@link Channel} objects that have been cached at any point, mapped by their ids
		 * @type {ChannelManager}
		 */
		this.channels = new ChannelManager(this, this.options.cache?.channels as number);
	}

	/**
	 * Returns whether the client has logged in, indicative of being able to access properties such as user and application
	 * @returns {boolean}
	 */
	isReady(): boolean {
		return this.ready;
	}

	/**
	 * Logs the client in, establishing a WebSocket connection to Discord
	 * @param {string} token Token for logging in
	 */
	login(token: string): void {
		if (!token) throw new Error('No token was provided');

		this.token = token.replace('Bot ', '').replace('Bearer ', '');
		this.requester = new Requester(this.token, this);
		this.ws.connect();
		this.emit('debug', '[DEBUG] Login method was called. Preparing to connect to the Discord Gateway.');
	}

	checkOptions(options: ClientOptions): void {
		if (typeof options !== 'object') throw new TypeError('Client#options must be an object');
		if (typeof options.apiVersion !== 'number') throw new TypeError('Client#options.apiVersion must be a number');
		if (typeof options.autoReconnect !== 'boolean') throw new TypeError('Client#options.autoReconnect must be a boolean');
		if (!Array.isArray(options.disabledEvents)) throw new TypeError('Client#options.disabledEvents must be an array');
		if (!Array.isArray(options.intents) && typeof options.intents !== 'number') throw new TypeError('Client#options.intents must be an array or a number');
		if (typeof options.failIfNotExists !== 'boolean') throw new TypeError('Client#options.failIfNotExists must be a boolean');

		// Cache
		if (typeof options.cache !== 'object') throw new TypeError('Client#options.cache must be an object');
		if (typeof options.cache.guilds !== 'number') throw new TypeError('Client#options.cache.guilds must be a number');
		if (typeof options.cache.guildChannels !== 'number') throw new TypeError('Client#options.cache.guildChannels must be a number');
		if (typeof options.cache.users !== 'number') throw new TypeError('Client#options.cache.users must be a number');
		if (typeof options.cache.members !== 'number') throw new TypeError('Client#options.cache.members must be a number');
		if (typeof options.cache.presences !== 'number') throw new TypeError('Client#options.cache.presences must be a number');
		if (typeof options.cache.messages !== 'number') throw new TypeError('Client#options.cache.messages must be a number');
		if (typeof options.cache.emojis !== 'number') throw new TypeError('Client#options.cache.emojis must be a number');
		if (typeof options.cache.roles !== 'number') throw new TypeError('Client#options.cache.roles must be a number');
	}

	reconnect(): void {
		// Stop heartbeating (this automatically verifies if there's a timer)
		Heartbeater.stop(this);

		this.cleanUp();
		this.emit('reconnecting');

		// If we don't have a session id, we cannot reconnect
		this.api.shouldResume = Boolean(this.api.sessionId);
		this.login(this.token);
	}

	cleanUp(): void {
		this.ping = 1;
		this.ready = false;
		this.user = null;
		this.guilds.cache.clear();
		this.users.cache.clear();
		this.channels.cache.clear();
	}

	_getChannel(id: string, guildId = '' as string): AnyChannel | undefined {
		return this.channels.cache.get(id) ?? this.guilds.cache.get(guildId)?.channels.cache.get(id);
	}

	incrementMaxListeners(): void {
		const maxListeners = this.getMaxListeners();
		if (maxListeners !== 0) {
			this.setMaxListeners(maxListeners + 1);
		}
	}

	decrementMaxListeners(): void {
		const maxListeners = this.getMaxListeners();
		if (maxListeners !== 0) {
			this.setMaxListeners(maxListeners - 1);
		}
	}

}

export { Client };
