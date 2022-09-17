import { ClientOptions, defaultClientOptions } from './ClientOptions';

export class Client {
  /**
   * The options the client was instantiated with
   */
  options: ClientOptions;
  /**
   * @param options The options for the client
   * @example
   * ```js
   *  const { Client, GatewayIntentBits } = require('helly');
   *  const client = new Client({ token: '', intents: [GatewayIntentBits.Guilds] })
   * ```
   */
  constructor(options: Partial<ClientOptions> = {}) {
    this.options = Object.assign(defaultClientOptions, options);
  }
}
