import Collection from '@discordjs/collection';
import { APIApplicationCommand, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import type { Guild } from '../structures';
import { ApplicationCommand } from '../structures/ApplicationCommand';
import { Transformers } from '../utils/transformers/Transformers';

/** Manages API methods for {@link User}s */
class ApplicationCommandManager {
  /** The {@link Client} that instantiated this Manager */
  client: Client;
  /** The guild that instantiated this Manager */
  guild: Guild | undefined;
  constructor(client: Client, guild?: Guild) {
    this.client = client;
    this.guild = guild;
  }

  /** The cached commands for this Manager */
  get cache() {
    if (!this.guild) return this.client.caches.commands;
    return this.client.caches.commands.filter(c => c.guildId === this.guild?.id);
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
   * Creates an application command
   * @param data The data to create the command with
   * @param guild The {@link Guild} to create the command in
   * @example
   * ```js
   * client.commands.create({ name: 'ping', description: 'Shows the bot\'s ping' });
   * ```
   * @example
   * ```js
   * guild.commands.create({ name: 'serverinfo', description: 'Shows information about the server' });
   * ```
   * @example
   * ```js
   * client.commands.create({ name: 'serverinfo', description: 'Shows information about the server' }, guild);
   * ```
   */
  async create(data: Partial<ApplicationCommand>, guild = this.guild) {
    const transformedData = Transformers.applicationCommand(data, guild);
    if (guild) {
      const command = (await this.client.rest.make(Routes.applicationGuildCommands(this.client.id, guild.id), 'Post', transformedData)) as APIApplicationCommand;
      return this.updateOrSet(command.id, command);
    }
    const command = (await this.client.rest.make(Routes.applicationCommands(this.client.id), 'Post', transformedData)) as APIApplicationCommand;
    return this.updateOrSet(command.id, command);
  }

  /**
   * Edits an application command
   * @param id The id of the command to edit
   * @param data The data to edit the command with
   * @param guild The {@link Guild} to edit the command in
   * @example
   * ```js
   * client.commands.edit('123456789123456', { name: 'ping', description: 'Shows the bot\'s ping' });
   * ```
   * @example
   * ```js
   * guild.commands.create('123456789123456', { name: 'serverinfo', description: 'Shows information about the server' });
   * ```
   * @example
   * ```js
   * guild.commands.create('123456789123456', { name: 'serverinfo', description: 'Shows information about the server' }, guild);
   * ```
   */
  async edit(id: string, data: Partial<ApplicationCommand>, guild = this.guild) {
    const transformedData = Transformers.applicationCommand(data, guild);
    if (guild) {
      const command = (await this.client.rest.make(Routes.applicationGuildCommand(this.client.id, id, guild.id), 'Patch', transformedData)) as APIApplicationCommand;
      return this.updateOrSet(command.id, command);
    }
    const command = (await this.client.rest.make(Routes.applicationCommand(this.client.id, id), 'Patch', transformedData)) as APIApplicationCommand;
    return this.updateOrSet(command.id, command);
  }

  /** Deletes an application command */
  async delete(id: string) {
    if (this.guild) {
      await this.client.rest.make(Routes.applicationGuildCommand(this.client.id, this.guild.id, id), 'Delete');
      return undefined;
    }
    await this.client.rest.make(Routes.applicationCommand(this.client.id, id), 'Delete');
    return undefined;
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
