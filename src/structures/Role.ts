import type { APIRole } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Parsers } from '../utils/transformers/Parsers';
import { PermissionsBitField } from '../utils/bitfield/PermissionsBitField';
import { SnowflakeUtil } from '../utils/Snowflake';
import { BaseStructure } from './BaseStructure';
import type { Guild } from './Guild';

export interface RoleTags {
  /** The Id of the bot this role belongs to */
  botId: string | undefined;
  /** The Id of the integration this role belongs to */
  integrationId: string | undefined;
  /** Whether this is the guild's premium subscription role */
  premiumSubscriber?: null;
}

export type RoleData = Partial<Role>;

/** Represents a role on Discord */
class Role extends BaseStructure {
  /** Raw {@link Role} data */
  data: APIRole;
  /** The Id of the guild the role is in */
  guildId: string;
  /** The role permissions */
  permissions: PermissionsBitField;
  constructor(client: Client, data: APIRole, guild: Guild) {
    super(client);
    this.guildId = guild.id;
    this.parseData(data);
  }

  /** The time the role was created at */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /** The timestamp the role was created at */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id);
  }

  /** The name of this role */
  get name() {
    return this.data.name;
  }

  /** The role's Id */
  get id() {
    return this.data.id;
  }

  /** The position of this role */
  get position() {
    return this.data.position;
  }

  /** Integer representation of hexadecimal color code */
  get color() {
    return this.data.color;
  }

  /** If true, users that are part of this role will appear in a separate category in the users list */
  get hoist() {
    return this.data.hoist;
  }

  /** Whether or not the role can be mentioned by anyone */
  get mentionable() {
    return this.data.mentionable;
  }

  /** Whether or not the role is managed by an external service */
  get managed() {
    return this.data.managed;
  }

  /** The guild that the role belongs to */
  get guild() {
    return this.client.caches.guilds.get(this.guildId);
  }

  /** The tags this role has */
  get tags(): RoleTags {
    const { tags } = this.data;
    return Parsers.roleTags(tags);
  }

  /** Returns the mention of the role */
  override toString() {
    return `<@&${this.id}>`;
  }

  /** @private */
  parseData(data: APIRole) {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    this.permissions = new PermissionsBitField(this.data.permissions);
    return this;
  }
}

export { Role };
