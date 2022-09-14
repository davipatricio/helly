import type { APISticker, StickerFormatType, StickerType } from 'discord-api-types/v10';
import { User } from './User';

export class Sticker {
  /**
   * Previously the sticker asset hash, now an empty string
   * @deprecated
   */
  asset?: '';
  /**
   *
   * @param data Whether this guild sticker can be used, may be false due to loss of Server Boosts
   */
  available?: boolean;
  /**
   * Description of the sticker
   */
  description: string | null;
  /**
   * Type of sticker format
   */
  formatType: StickerFormatType;
  /**
   * ID of the guild that owns this sticker
   */
  guildId?: string | null;
  /**
   * ID of the sticker
   */
  id: string;
  /**
   * Name of the sticker
   */
  name: string;
  /**
   * For standard stickers, ID of the pack the sticker is from
   */
  packId?: string | null;
  /**
   * The standard sticker’s sort order within its pack
   */
  sortValue?: number;
  /**
   * For guild stickers, the Discord name of a unicode emoji representing the sticker’s expression. for standard stickers, a comma-separated list of related expressions.
   */
  tags: string[];
  /**
   * Type of sticker
   * See https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-types
   */
  type: StickerType;
  /**
   * The user that uploaded the guild sticker
   */
  user?: User | null;
  constructor(data: APISticker) {
    this.#parseData(data);
  }

  #parseData(data: APISticker) {
    if ('asset' in data) this.asset = data.asset;
    if ('available' in data) this.available = data.available;
    if ('description' in data) this.description = data.description;
    if ('format_type' in data) this.formatType = data.format_type;
    if ('guild_id' in data) this.guildId = data.guild_id;
    if ('id' in data) this.id = data.id;
    if ('name' in data) this.name = data.name;
    if ('pack_id' in data) this.packId = data.pack_id;
    if ('sort_value' in data) this.sortValue = data.sort_value;
    if ('tags' in data) this.tags = data.tags.split(',');
    if ('type' in data) this.type = data.type;
    // TODO: correct user parsing
    if ('user' in data) this.user = new User(data.user!);
  }
}
