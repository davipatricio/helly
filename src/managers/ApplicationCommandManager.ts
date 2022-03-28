import type { APIApplicationCommand } from 'discord-api-types/v10';
import type { Client } from '../client/Client';

/** Manages API methods for {@link User}s */
class ApplicationCommandManager {
  /** The {@link Client} that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Updates or caches an {@link ApplicationCommand} with the provided {@link APIApplicationCommand} data
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateOrSet(_id: string, _data: APIApplicationCommand) {
    return this;
  }
}

export { ApplicationCommandManager };
