import type { APISticker } from 'discord-api-types/v10';
import { User } from './User';

export class Sticker {
  /**
   * Raw Sticker object
   */
  data: APISticker;
  constructor(data: APISticker) {
    this.#parseData(data);
  }

  /**
   * Previously the sticker asset hash, now an empty string
   * @deprecated
   */
  get asset() {
    return this.data.asset;
  }

  /**
   * Whether this guild sticker can be used, may be false due to loss of Server Boosts
   */
  get available() {
    return this.data.available;
  }

  /**
   * Description of the sticker
   */
  get description() {
    return this.data.description;
  }

  /**
   * Type of sticker format
   */
  get formatType() {
    return this.data.format_type;
  }

  /**
   * ID of the guild that owns this sticker
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * ID of the sticker
   */
  get id() {
    return this.data.id;
  }

  /**
   * Name of the sticker
   */
  get name() {
    return this.data.name;
  }

  /**
   * For standard stickers, ID of the pack the sticker is from
   */
  get packId() {
    return this.data.pack_id;
  }

  /**
   * The standard sticker’s sort order within its pack
   */
  get sortValue() {
    return this.data.sort_value;
  }

  /**
   * For guild stickers, the Discord name of a unicode emoji representing the sticker’s expression. for standard stickers, a comma-separated list of related expressions.
   */
  get tags() {
    return this.data.tags.split(', ');
  }

  /**
   * Type of sticker
   * See https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-types
   */
  get type() {
    return this.data.type;
  }

  /**
   * The user that uploaded the guild sticker
   */
  get user() {
    return this.data.user ? new User(this.data.user) : undefined;
  }

  #parseData(data: APISticker) {
    this.data = { ...data };
  }
}
