import type { APIGuild } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { RoleManager } from '../managers/RoleManager';
import { BaseStructure } from './BaseStructure';

class Guild extends BaseStructure {
  /** Raw {@link Guild} data */
  data: APIGuild;
  /** A manager of the roles belonging to this {@link Guild} */
  roles: RoleManager;
  constructor(client: Client, data: APIGuild) {
    super(client);
    this.roles = new RoleManager(client, this);
    this.parseData(data);
  }

  get afkChannelId() {
    return this.data.afk_channel_id;
  }

  get afkTimeout() {
    return this.data.afk_timeout;
  }

  get approximateMemberCount() {
    return this.data.approximate_member_count;
  }

  get approximatePresenceCount() {
    return this.data.approximate_presence_count;
  }

  get description() {
    return this.data.description;
  }

  get ownerId() {
    return this.data.owner_id;
  }

  /** Enabled {@link Guild} features */
  get features() {
    return this.data.features;
  }

  get large() {
    return this.data.large;
  }

  get memberCount() {
    return this.data.member_count;
  }

  get name() {
    return this.data.name;
  }

  get id() {
    return this.data.id;
  }

  /** @private */
  parseData(data: APIGuild): this {
    if (!data) return this;
    this.data = { ...this.data, ...data };
    // TODO: parse channels, members etc
    if (this.data.roles) {
      this.data.roles.forEach(apiRole => {
        this.roles.updateOrSet(apiRole.id, apiRole, this);
      });
    }
    return this;
  }
}

export { Guild };
