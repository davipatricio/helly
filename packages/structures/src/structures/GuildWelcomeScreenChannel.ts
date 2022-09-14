import type { APIGuildWelcomeScreenChannel } from 'discord-api-types/v10';

export class GuildWelcomeScreenChannel {
  /**
   * The channel id that is suggested
   */
  channelId: string;
  /**
   * The description shown for the channel
   */
  description: string;
  /**
   * The emoji id of the emoji that is shown on the left of the channel
   */
  emojiId: string | null;
  /**
   * The emoji name of the emoji that is shown on the left of the channel
   */
  emojiName: string | null;
  constructor(data: APIGuildWelcomeScreenChannel) {
    this.#parseData(data);
  }

  #parseData(data: APIGuildWelcomeScreenChannel) {
    if ('channelId' in data) this.channelId = data.channel_id;
    if ('description' in data) this.description = data.description;
    if ('emojiId' in data) this.emojiId = data.emoji_id;
    if ('emojiName' in data) this.emojiName = data.emoji_name;
  }
}
