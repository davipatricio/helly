import type { APIRole } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { BaseStructure } from './BaseStructure';
import type { Guild } from './Guild';

export interface RoleTags {
  /** the id of the bot this role belongs to */
  botId: string | undefined;
  /** the id of the integration this role belongs to */
  integrationId: string | undefined;
  /** whether this is the guild's premium subscriber role */
  premiumSubscriber?: null;
}

class Role extends BaseStructure {
  /** Raw {@link Role} data */
  data: APIRole;
  /** @private */
  #guildId: string;
  constructor(client: Client, data: APIRole, guild: Guild) {
    super(client);
    this.#guildId = guild.id;
    this.parseData(data);
  }

  get name() {
    return this.data.name;
  }

  get id() {
    return this.data.id;
  }

  get position() {
    return this.data.position;
  }

  get tags(): RoleTags {
    const { tags } = this.data;

    return {
      botId: tags?.bot_id ?? undefined,
      integrationId: tags?.integration_id ?? undefined,
      premiumSubscriber: tags?.premium_subscriber ?? null,
    };
  }

  get guild() {
    return this.client.guilds.cache.get(this.#guildId);
  }

  /** @private */
  parseData(data: APIRole): this {
    if (!data) return this;
    this.data = { ...this.data, ...data };
    return this;
  }
}

export { Role };
