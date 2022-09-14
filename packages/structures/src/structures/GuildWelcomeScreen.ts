import type { APIGuildWelcomeScreen } from 'discord-api-types/v10';
import { GuildWelcomeScreenChannel } from './GuildWelcomeScreenChannel';

export class GuildWelcomeScreen {
  /**
   * Raw GuildWelcomeScreen object
   */
  data: APIGuildWelcomeScreen;
  constructor(data: APIGuildWelcomeScreen) {
    this.#parseData(data);
  }

  /**
   * The welcome screen short message
   */
  get description() {
    return this.data.description;
  }

  /**
   * Array of suggested channels
   */
  get welcomeChannels() {
    return this.data.welcome_channels.map(channel => new GuildWelcomeScreenChannel(channel));
  }

  #parseData(data: APIGuildWelcomeScreen) {
    this.data = { ...data };
  }
}
