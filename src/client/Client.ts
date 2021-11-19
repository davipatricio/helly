import EventEmitter from 'events';
import Heartbeater from './ws/Heartbeater';
import Intents from '../utils/Intents';
import APIRequester from '../utils/Requester';
import { defaultValues, ClientOptions } from './ClientOptions';

import WebSocketManager from './ws/WebsocketManager';
import ActionManager from '../actions/ActionManager';
import GuildManager from '../managers/GuildManager';
import UserManager from '../managers/UserManager';

import type ClientUser from '../structures/ClientUser';

class Client extends EventEmitter {
  ws: WebSocketManager;
  token!: string;
  options: ClientOptions;
  api!: Record<string, any>;
  ping!: number;
  ready: boolean;
  requester!: APIRequest;

  // Managers
  guilds!: GuildManager;
  users!: UserManager;
  actions: ActionManager;
  user: ClientUser | null;

  constructor(options = defaultValues as ClientOptions) {
    super();
    this.api = {};
    this.ready = false;
    this.user = null;

    this.options = Object.assign(defaultValues, options);
    this.verifyOptions(this.options);
    this.prepareCache();
    this.options.intents = Intents.parse(this.options.intents ?? ['GUILDS']);

    this.ws = new WebSocketManager(this);
    this.actions = new ActionManager(this);
  }

  prepareCache() {
    this.guilds = new GuildManager(this, Infinity);
    this.users = new UserManager(this, Infinity);
  }

  login(token: string) {
    if (!token) throw new Error('No token provided');
    this.token = token;
    this.ping = -1;

    this.requester = new APIRequester(this.token, this);
    this.emit('debug', '[DEBUG] Login method was called. Preparing to connect to the Discord Gateway.');
    this.ws.connect();
  }

  reconnect() {
    // Stop heartbeating (this automatically verifies if there's a timer)
    Heartbeater.stop(this);

    this.cleanUp();
    this.emit('reconnecting');

    // If we don't have a session id, we cannot reconnect
    this.api.should_resume = Boolean(this.api.sessionId);
    this.login(this.token);
  }

  disconnect() {
    this.ws.connection?.close(1000);
    // Stop heartbeating (this automatically verifies if there's a timer)
    Heartbeater.stop(this);

    this.api = {};
    this.cleanUp();
  }

  cleanUp() {
    this.ping = 1;
    this.ready = false;

    this.user = null;
    this.guilds.cache.clear();
    // this.emojis.cache.clear();
    this.users.cache.clear();
    // this.channels.cache.clear();
  }

  verifyOptions(options: ClientOptions) {
    if (typeof options !== 'object') throw new Error('Options must be an object');

    if (!Array.isArray(options.disabledEvents)) throw new Error('The disabledEvents option must be an array.');

    if (typeof options.properties !== 'object') throw new Error('The properties option must be an object.');

    if (typeof options.shardId !== 'number') throw new Error('The shardId option must be a number.');
    if (typeof options.apiVersion !== 'number') throw new Error('The apiVersion option must be a number.');
    if (typeof options.shardCount !== 'number') throw new Error('The shardCount option must be a number.');
    if (typeof options.large_threshold !== 'number') {
      throw new Error('The large_threshold option must be a number.');
    }

    // Value checking
    if (options.shardId < 0) throw new Error('The shardId option must be a positive number.');
    if (options.shardCount < 1) throw new Error('The shardCount option must be a positive number.');

    if (options.large_threshold < 50) {
      throw new Error('The large_threshold option must be a number between 50 and 250.');
    }
    if (options.large_threshold > 250) {
      throw new Error('The large_threshold option must be a number between 50 and 250.');
    }
  }
}

export default Client;
