import { Collection } from '@discordjs/collection';
import { APIBan, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import type { Guild } from '../structures/Guild';
import { GuildBan } from '../structures/GuildBan';
import type { BanOptions } from '../structures/GuildMember';
import { LimitedCollection } from '../utils/LimitedCollection';
import { Transformers } from '../utils/transformers';

/** Manages API methods for {@link GuildMember}s */
class GuildBanManager {
  /** The client that instantiated this Manager */
  client: Client;
  /** The {@link Guild} belonging to this manager */
  guild: Guild;
  /** The cached bans for this {@link Guild} */
  cache: LimitedCollection<string, GuildBan>;
  constructor(client: Client, guild: Guild) {
    this.client = client;
    this.guild = guild;
    this.cache = new LimitedCollection(this.client.options.caches.bans);
  }

  /**
   * Fetches ban(s) from Discord
   * @param id The user ID to fetch
   * @example
   * ```js
   * guild.bans.fetch().then(bans => console.log(bans.size)));
   * ```
   * @example
   * ```js
   * guild.bans.fetch('123456789123456');
   * ```
   */
  async fetch(): Promise<Collection<string, GuildBan>>;
  async fetch(id?: string): Promise<GuildBan>;
  async fetch(id?: string) {
    if (id) {
      const data = (await this.client.rest.make(Routes.guildBan(this.guild.id, id))) as APIBan;
      const ban = this.updateOrSet(data.user.id, data);
      return ban;
    }

    const data = (await this.client.rest.make(Routes.guildBans(this.guild.id))) as APIBan[];
    const finalCollection = new Collection<string, GuildBan>();
    for (const ban of data) finalCollection.set(ban.user.id, this.updateOrSet(ban.user.id, ban));

    return finalCollection;
  }

  /**
   * Bans a user from the guild
   * @param id The member to ban
   * @param options Options for the ban
   * @example
   * ```js
   * guild.bans.create('123456789123456')
   *  ```
   * @example
   * ```js
   * guild.bans.create('123456789123456', { reason: 'Spamming', days: 1 })
   * ```
   */
  async create(id: string, options: BanOptions = { days: 0, reason: '' }) {
    const data = (await this.client.rest.make(Routes.guildBan(this.guild.id, id), 'Put', Transformers.banOptions(options), { 'X-Audit-Log-Reason': options.reason ?? '' })) as APIBan;
    const ban = this.updateOrSet(id, data);
    return ban;
  }

  /**
   * Unbans a user from the guild
   * @param id The member to unban
   * @param reason Reason for unbanning user
   * @example
     ```js
      guild.bans.remove('123456789123456')
      ```
   * @example
   * ```js
   * guild.bans.remove('123456789123456', 'Applied ban in the wrong user')
   * ``` 
   */
  async remove(id: string, reason = '') {
    await this.client.rest.make(Routes.guildBan(this.guild.id, id), 'Delete', undefined, { 'X-Audit-Log-Reason': reason });
    this.cache.delete(id);
    return this.client.caches.users.get(id);
  }

  /**
   * Updates or caches a {@link GuildBan} with the provided {@link APIBan} data
   * @private
   */
  updateOrSet(id: string, data: APIBan) {
    const cachedBan = this.guild.bans.cache.get(id);
    if (cachedBan) return cachedBan.parseData(data);

    const ban = new GuildBan(this.client, data, this.guild);
    this.guild.bans.cache.set(id, ban);

    return ban;
  }
}

export { GuildBanManager };
