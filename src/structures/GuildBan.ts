import type { APIBan } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { BaseStructure } from './BaseStructure';
import type { Guild } from './Guild';

class GuildBan extends BaseStructure {
  /** Raw ban data */
  data: APIBan;
  /** The guild in which the ban was issued */
  guild: Guild;
  constructor(client: Client, data: APIBan, guild: Guild) {
    super(client);
    this.guild = guild;
    this.parseData(data);
  }

  /** The reason the user was banned */
  get reason() {
    return this.data.reason;
  }

  /** The user that was banned */
  get user() {
    return this.client.caches.users.get(this.data.user.id) ?? this.client.users.updateOrSet(this.data.user.id, this.data.user);
  }

  /** @private */
  parseData(data: APIBan) {
    if (!data) return this;

    this.data = { ...this.data, ...data };

    return this;
  }
}

export { GuildBan };
