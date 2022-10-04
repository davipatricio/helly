import type { APIGuildWelcomeScreenChannel } from 'discord-api-types/v10';

export class GuildWelcomeScreenChannel {
  /**
   * Raw GuildWelcomeScreenChannel object
   */
  data: APIGuildWelcomeScreenChannel;
  constructor(data: APIGuildWelcomeScreenChannel) {
    this.#parseData(data);
  }

  /**
   * The channel id that is suggested
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * The description shown for the channel
   */
  get description() {
    return this.data.description;
  }

  /**
   * The emoji id of the emoji that is shown on the left of the channel
   */
  get emojiId() {
    return this.data.emoji_id;
  }

  /**
   * The emoji name of the emoji that is shown on the left of the channel
   */
  get emojiName() {
    return this.data.emoji_name;
  }

  #parseData(data: APIGuildWelcomeScreenChannel) {
    this.data = { ...data };
  }
}
