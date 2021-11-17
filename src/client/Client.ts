import EventEmitter from 'events';
import WebSocket from 'ws';
import type { ClientOptions } from './ClientOptions';

class Client extends EventEmitter {
  ws: WebSocket | null;
  token: string;
  options: ClientOptions;
  constructor(options = {} as ClientOptions) {
    super();
    this.ws = null;
    this.token = '';
    this.options = Object.assign(
      {
        autoReconnect: true,
        disabledEvents: [],

        // Data sent in IDENTIFY payload
        shardId: 0,
        shardCount: 1,

        apiVersion: 9,

        intents: ['GUILDS'],
        large_threshold: 50,

        properties: {
          $os: process.platform,
          $browser: 'peachy.js',
          $device: 'peachy.js',
        },

        // Default message options
        failIfNotExists: false,
        allowedMentions: {
          parse: ['users', 'roles', 'everyone'],
          replied_user: true,
          users: [],
          roles: [],
        },
      },
      options,
    );
  }

  login(token: string) {
    if (typeof token !== 'string') throw new Error('Token must be a string');
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
