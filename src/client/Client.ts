import EventEmitter from 'node:events';
import { ActionManager } from '../actions/ActionManager';
import { ChannelManager } from '../managers/ChannelManager';
import { GuildManager } from '../managers/GuildManager';
import { UserManager } from '../managers/UserManager';
import { Intents } from '../utils/Intents';
import { Requester } from '../utils/Requester';
import { ClientOptions, defaultValues } from './ClientOptions';
import * as Heartbeater from './websocket/Heartbeater';
import { WebsocketManager } from './websocket/WebsocketManager';

/**
 * The main hub for interacting with the Discord API, and the starting point for any bot.
 * @extends {EventEmitter}
 * @param {ClientOptions} options Options to pass to the client
 */

class Client extends EventEmitter {
	api: any;
	user: null;
	ping: number;
	token: string;
	ready: boolean;

	ws: WebsocketManager;
	actions: ActionManager;
	guilds: GuildManager;
	users: UserManager;
	channels: ChannelManager;

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
		this.options.intents = Intents.parse(this.options.intents);

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
		 * Authorization token for the logged in bot.
		 * @type {string}
		 */
		this.token = '';

		this.parseOptions(this.options);
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
	 * Returns whether the client has logged in, indicative of being able to access properties such as user and application.
	 * @returns {boolean}
	 */
	isReady() {
		return this.ready;
	}

	/**
	 * Logs the client in, establishing a WebSocket connection to Discord.
	 * @param {string} token Token for logging in
	 */
	login(token: string) {
		if (!token) throw new Error('No token was provided');

		this.token = token.replace('Bot ', '').replace('Bearer ', '');
		this.requester = new Requester(this.token, this);
		this.ws.connect();
		this.emit('debug', '[DEBUG] Login method was called. Preparing to connect to the Discord Gateway.');
	}

	parseOptions(options: any) {
		if (typeof options !== 'object') throw new TypeError('Client options must be an object');
	}

	reconnect() {
		// Stop heartbeating (this automatically verifies if there's a timer)
		Heartbeater.stop(this);

		this.cleanUp();
		this.emit('reconnecting');

		// If we don't have a session id, we cannot reconnect
		this.api.shouldResume = Boolean(this.api.sessionId);
		this.login(this.token);
	}

	cleanUp() {
		this.ping = 1;
		this.ready = false;
		this.user = null;
		this.guilds.cache.clear();
		this.users.cache.clear();
		this.channels.cache.clear();
	}
}

export { Client };
