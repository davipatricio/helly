import { WebSocketClient } from '@hellyjs/ws';
import EventEmitter from 'events';
import { IntentsBitField } from '../utils';
import { ClientOptions, defaultClientOptions } from './ClientOptions';

export class Client extends EventEmitter {
  /**
   * The id of the logged client
   */
  id: string;
  /**
   * The options the client was instantiated with
   */
  options: Required<ClientOptions>;
  /**
   * Authorization token for the logged in bot
   */
  token: string;
  /**
   * A {@WebSocketClient} instance
   */
  ws: WebSocketClient;
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
    this.ws = new WebSocketClient({
      // TODO: compression
      compress: false,
      intents: Number(new IntentsBitField(this.options.intents).bitfield),
      token: this.token,
      url: this.options.ws.gateway,
    });
  }

  connect() {
    this.ws.connect();
  }
}
