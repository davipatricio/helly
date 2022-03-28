import type { APIApplicationCommand } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { BaseStructure } from './BaseStructure';

class ApplicationCommand extends BaseStructure {
  /** Raw command data */
  data: APIApplicationCommand;
  /** The id of the {@link Guild} the member is in */
  guildId: string;
  constructor(client: Client, data: APIApplicationCommand) {
    super(client);
    this.parseData(data);
  }

  /** @private */
  parseData(data: APIApplicationCommand) {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    return this;
  }
}

export { ApplicationCommand };
