import EventEmitter from 'events';
import { ClientOptions, defaultClientOptions } from './ClientOptions';

export class Client extends EventEmitter {
  /**
   * The id of the logged client
   */
  id: string;
  /**
   * The options the client was instantiated with
   */
  options: ClientOptions;
  /**
   * Authorization token for the logged in bot
   */
  token: string;
  /**
   * @param options The options for the client
   * @example
   * ```js
   *  const { Client, GatewayIntentBits } = require('helly');
   *  const client = new Client({ token: '', intents: [GatewayIntentBits.Guilds] })
   * ```
   */
  constructor(options: Partial<ClientOptions> = {}) {
    super();
    this.options = { ...options, ...defaultClientOptions };
  }
}
