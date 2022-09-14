import type { APITemplate, APITemplateSerializedSourceGuild } from 'discord-api-types/v10';
import { User } from './User';

export class GuildTemplate {
  /**
   * The template code (unique ID)
   */
  code: string;
  /**
   * When this template was created
   */
  createdAt: Date;
  /**
   * The timestamp of when this template was created
   */
  createdTimestamp: number;
  /**
   * The user who created the template
   */
  creator: User | null;
  /**
   * The ID of the user who created the template
   */
  creatorId: string;
  /**
   * The description for the template
   */
  description: string | null;
  /**
   * Whether the template has unsynced changes
   */
  isDirty: boolean | null;
  /**
   * Template name
   */
  name: string;
  /**
   * The guild snapshot this template contains
   */
  serializedSourceGuild: APITemplateSerializedSourceGuild;
  /**
   * The ID of the guild this template is based on
   */
  sourceGuildId: string;
  /**
   * When this template was last synced to the source guild
   */
  updatedAt: Date;
  /**
   * Number of times this template has been used
   */
  usageCount: number;
  constructor(data: APITemplate) {
    this.#parseData(data);
  }

  #parseData(data: APITemplate) {
    if ('code' in data) this.code = data.code;
    if ('created_at' in data) this.createdAt = new Date(data.created_at);
    if ('created_at' in data) this.createdTimestamp = new Date(data.created_at).getTime();
    // TODO: better parsing
    if ('creator' in data) this.creator = data.creator ? new User(data.creator) : null;
    if ('creator' in data) this.creatorId = data.creator?.id ?? null;
    if ('description' in data) this.description = data.description;
    if ('is_dirty' in data) this.isDirty = data.is_dirty;
    if ('name' in data) this.name = data.name;
    if ('serialized_source_guild' in data) this.serializedSourceGuild = data.serialized_source_guild;
    if ('source_guild_id' in data) this.sourceGuildId = data.source_guild_id;
    if ('updated_at' in data) this.updatedAt = new Date(data.updated_at);
    if ('usage_count' in data) this.usageCount = data.usage_count;
  }
}
