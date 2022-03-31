import Collection from '@discordjs/collection';
import { APIApplicationCommand, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import type { Guild } from '../structures';
import { ApplicationCommand } from '../structures/ApplicationCommand';
import { LimitedCollection } from '../utils';

/** Manages API methods for {@link User}s */
class ApplicationCommandManager {
  /** The {@link Client} that instantiated this Manager */
  client: Client;
  /** The cached commands for this Manager */
  cache: LimitedCollection<string, ApplicationCommand>;
  /** The guild that instantiated this Manager */
  guild: Guild | undefined;
  constructor(client: Client, guild?: Guild) {
    this.client = client;
    this.guild = guild;
    this.cache = new LimitedCollection(this.guild ? this.client.options.caches.guildCommands : this.client.options.caches.commands);

    // Pre-cache commands
    this.fetch().catch(() => {
      // Do nothing
    });
  }

  /** Obtains one or multiple application commands from Discord */
  async fetch(id: string): Promise<ApplicationCommand>;
  async fetch(id?: string): Promise<Collection<string, ApplicationCommand>>;
  async fetch(id?: string) {
    if (!id) {
      // Fetch all guild commands
      if (this.guild) {
        const data = (await this.client.rest.make(Routes.applicationGuildCommands(this.client.id, this.guild.id))) as APIApplicationCommand[];
        const collection = new Collection<string, ApplicationCommand>();
        for (const command of data) collection.set(command.id, this.updateOrSet(command.id, command));
        return collection;
      }
      // Fetch all global commands
      const data = (await this.client.rest.make(Routes.applicationCommands(this.client.id))) as APIApplicationCommand[];
      const collection = new Collection<string, ApplicationCommand>();
      for (const command of data) collection.set(command.id, this.updateOrSet(command.id, command));
      return collection;
    }

    // Fetch a guild-specific command with a specific Id
    if (this.guild) {
      const data = (await this.client.rest.make(Routes.applicationGuildCommand(this.client.id, this.guild.id, id))) as APIApplicationCommand;
      return this.updateOrSet(id, data);
    }
    // Fetch a global command with a specific Id
    const data = (await this.client.rest.make(Routes.applicationCommand(this.client.id, id))) as APIApplicationCommand;
    return this.updateOrSet(id, data);
  }

  /**
   * Updates or caches an {@link ApplicationCommand} with the provided {@link ApplicationCommand} data
   * @private
   */
  updateOrSet(id: string, data: APIApplicationCommand) {
    const cachedCommand = this.cache.get(id);
    if (cachedCommand) return cachedCommand.parseData(data);

    const command = new ApplicationCommand(this.client, data, this.guild);
    this.cache.set(id, command);

    return command;
  }
}

export { ApplicationCommandManager };
