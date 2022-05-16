import { APIApplicationCommand, Routes } from 'discord-api-types/v10';
import type { Guild } from '.';
import type { Client } from '../client/Client';
import { Transformers } from '../utils/transformers/Transformers';
import { BaseStructure } from './BaseStructure';

class ApplicationCommand extends BaseStructure {
  /** Raw command data */
  data: APIApplicationCommand;
  /** The guild this command is part of */
  guild: Guild | undefined;
  constructor(client: Client, data: APIApplicationCommand, guild?: Guild) {
    super(client);
    this.parseData(data, guild);
  }

  /** Unique id of the parent application */
  get applicationId() {
    return this.data.application_id;
  }

  /** Unique Id of the command */
  get id() {
    return this.data.id;
  }

  get type() {
    return this.data.type;
  }

  /** The name of the command */
  get name() {
    return this.data.name;
  }

  /** Localization dictionary for the name field */
  get nameLocalizations() {
    return this.data.name_localizations;
  }

  /** The description of the command */
  get description() {
    return this.data.description;
  }

  /** Localization dictionary for the description field */
  get descriptionLocalizations() {
    return this.data.description_localizations;
  }

  /** Whether the command is enabled by default when the app is added to a guild */
  get defaultPermission() {
    return this.data.default_permission;
  }

  /** The default bitfield used to determine whether this command be used in a guild */
  get defaultMemberPermissions() {
    return this.data.default_member_permissions;
  }

  /** Whether the command can be used in dms */
  get dmPermission() {
    return this.data.dm_permission;
  }

  /** The options for the command */
  get options() {
    return this.data.options ?? [];
  }

  /** The guild's Id this command is part of, this may be non-null when `guild` is `null` */
  get guildId() {
    return this.guild?.id ?? this.data.guild_id;
  }

  /**
   * Edits this application command
   * @param data The data to update the command with
   * @example
   * ```js
   * command.edit({ description: 'Shows the bot latency.' })
   * ```
   */
  async edit(data: Partial<ApplicationCommand>) {
    const transformedData = Transformers.applicationCommand(data);

    if (this.guildId) {
      const rawData = (await this.client.rest.make(Routes.applicationGuildCommand(this.applicationId, this.guildId, this.id), 'Patch', transformedData)) as APIApplicationCommand;
      return this.parseData(rawData, this.guild);
    }

    const rawData = (await this.client.rest.make(Routes.applicationCommand(this.applicationId, this.id), 'Patch', transformedData)) as APIApplicationCommand;
    return this.parseData(rawData);
  }

  /** Edits the name of this ApplicationCommand */
  setName(name: string) {
    return this.edit({ name });
  }

  /** Edits the description of this ApplicationCommand */
  setDescription(description: string) {
    return this.edit({ description });
  }

  /** Edits the default permission of this ApplicationCommand */
  setDefaultPermission(defaultPermission = true) {
    return this.edit({ defaultPermission });
  }

  /** Edits the default member permissions of this ApplicationCommand */
  setDefaultMemberPermissions(defaultMemberPermissions: string) {
    return this.edit({ defaultMemberPermissions });
  }

  /** Edits the dm permission of this ApplicationCommand */
  setDMPermission(dmPermission = true) {
    return this.edit({ dmPermission });
  }

  /** Deletes this command */
  async delete() {
    if (this.guildId) {
      await this.client.rest.make(Routes.applicationGuildCommand(this.applicationId, this.guildId, this.id), 'Delete');
    } else await this.client.rest.make(Routes.applicationCommand(this.applicationId, this.id), 'Delete');
    return undefined;
  }

  /** Fetches this command */
  async fetch() {
    if (this.guildId) {
      const data = (await this.client.rest.make(Routes.applicationGuildCommand(this.applicationId, this.guildId, this.id), 'Get')) as APIApplicationCommand;
      return this.parseData(data, this.guild);
    }
    const data = (await this.client.rest.make(Routes.applicationCommand(this.applicationId, this.id), 'Get')) as APIApplicationCommand;
    return this.parseData(data);
  }

  /** Return the command name and options name */
  override toString() {
    return `${this.name} ${this.options.map(option => option.name)}`;
  }

  /** @private */
  parseData(data: APIApplicationCommand, guild?: Guild) {
    if (!data) return this;
    this.guild = guild;

    this.data = { ...this.data, ...data };
    return this;
  }
}

export { ApplicationCommand };
