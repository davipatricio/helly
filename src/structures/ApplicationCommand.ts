import { APIApplicationCommand, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { BaseStructure } from './BaseStructure';

class ApplicationCommand extends BaseStructure {
  /** Raw command data */
  data: APIApplicationCommand;
  /** The Id of the {@link Guild} the member is in */
  guildId: string;
  constructor(client: Client, data: APIApplicationCommand) {
    super(client);
    this.parseData(data);
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

  /** The options for the command */
  get options() {
    return this.data.options ?? [];
  }

  /** Deletes this command globally */
  async delete() {
    await this.client.rest.make(Routes.applicationCommand(this.applicationId, this.id), 'Delete');
    return undefined;
  }

  /** Fetches this global command */
  async fetch() {
    const data = (await this.client.rest.make(Routes.applicationCommand(this.applicationId, this.id), 'Get')) as APIApplicationCommand;
    return this.parseData(data);
  }

  /** Return the command name and options name */
  override toString() {
    return `${this.name} ${this.options.map(option => option.name)}`;
  }

  /** @private */
  parseData(data: APIApplicationCommand) {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    return this;
  }
}

export { ApplicationCommand };
