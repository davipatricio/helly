import Collection from '@discordjs/collection';
import { APIGuild, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Guild, GuildWidgetSettingsData } from '../structures/Guild';
import { Transformers } from '../utils/transformers';

// TODO: GuildManager methods (.create, .delete, .fetch etc)

/** Manages API methods for {@link Guild}s */
class GuildManager {
  /** The client that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  /** All of the guilds the client is currently handling, mapped by their Ids */
  get cache() {
    return this.client.caches.guilds;
  }

  /**
   * Obtains one or multiple guilds from Discord, or the guild cache if it's already available
   * @param id The guild's Id to fetch. If undefined, fetches all guilds
   */
  fetch(): Promise<Collection<string, Guild>>;
  fetch(id?: string): Promise<Guild>;
  async fetch(id?: string) {
    if (!id) {
      const guilds = (await this.client.rest.make(Routes.userGuilds(), 'Get')) as APIGuild[];
      const fetchedGuilds = new Collection<string, Guild>();

      for (const guild of guilds) {
        const data = this.updateOrSet(guild.id, guild);
        fetchedGuilds.set(guild.id, data);
      }
      return fetchedGuilds;
    }

    const fetchedGuild = (await this.client.rest.make(Routes.guild(id), 'Get')) as APIGuild;
    const cachedGuild = this.updateOrSet(id, fetchedGuild);
    return cachedGuild;
  }

  /**
   * Edits a {@link Guild}
   * @param guildId The Id of the guild
   * @param options The options to edit the guild with
   * @param reason The reason to edit the guild
   * @example
   * ```js
   * client.guilds.edit('123456789123456', { name: 'My amazing community!'});
   * ```
   */
  async edit(guildId: string, options: Partial<Guild>, reason = '') {
    const transformed = Transformers.guildData(options);
    const data = await this.client.rest.make(Routes.guild(guildId), 'Patch', transformed, { 'X-Audit-Log-Reason': reason });
    return this.updateOrSet(guildId, data as APIGuild);
  }

  /**
   * Edits a guild's widget settings
   * @param settings The widget settings for the guild
   * @param reason Reason for changing the guild's widget settings
   */
  async setWidgetSettings(guildId: string, settings: GuildWidgetSettingsData, reason = '') {
    const transformed = Transformers.guildWidgetSettings(settings);
    await this.client.rest.make(Routes.guildWidgetSettings(guildId), 'Patch', transformed, { 'X-Audit-Log-Reason': reason });
    // TODO: GuildWidget class
    return null;
  }

  /** Leaves a guild */
  async leave(id: string) {
    await this.client.rest.make(Routes.userGuild(id), 'Delete');
    return undefined;
  }

  /**
   * Updates or caches a {@link Guild} with the provided {@link APIGuild} data
   * @private
   */
  updateOrSet(id: string, data: APIGuild) {
    const cachedGuild = this.client.caches.guilds.get(id);
    if (cachedGuild) return cachedGuild.parseData(data);

    const guild = new Guild(this.client, data);
    this.client.caches.guilds.set(id, guild);

    return guild;
  }
}

export { GuildManager };
