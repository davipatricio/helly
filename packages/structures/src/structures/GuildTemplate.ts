import type { APITemplate } from 'discord-api-types/v10';
import { User } from './User';

export class GuildTemplate {
  /**
   * Raw GuildTemplate object
   */
  data: APITemplate;
  constructor(data: APITemplate) {
    this.#parseData(data);
  }

  /**
   * The template code (unique ID)
   */
  get code() {
    return this.data.code;
  }

  /**
   * When this template was created
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The timestamp of when this template was created
   */
  get createdTimestamp() {
    return Date.parse(this.data.created_at);
  }

  /**
   * The user who created the template
   */
  get creator() {
    // TODO: better parsing
    return this.data.creator ? new User(this.data.creator) : null;
  }

  /**
   * The ID of the user who created the template
   */
  get creatorId() {
    return this.data.creator_id;
  }

  /**
   * The description for the template
   */
  get description() {
    return this.data.description;
  }

  /**
   * Whether the template has unsynced changes
   */
  get isDirty() {
    return this.data.is_dirty;
  }

  /**
   * Template name
   */
  get name() {
    return this.data.name;
  }

  /**
   * The guild snapshot this template contains
   */
  get serializedSourceGuild() {
    return this.data.serialized_source_guild;
  }

  /**
   * The ID of the guild this template is based on
   */
  get sourceGuildId() {
    return this.data.source_guild_id;
  }

  /**
   * When this template was last synced to the source guild
   */
  get updatedAt() {
    return new Date(this.updatedTimestamp);
  }

  get updatedTimestamp() {
    return Date.parse(this.data.updated_at);
  }

  /**
   * Number of times this template has been used
   */
  get usageCount() {
    return this.data.usage_count;
  }

  #parseData(data: APITemplate) {
    this.data = { ...data };
  }
}
