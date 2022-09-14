import type { APIGuildWelcomeScreen } from 'discord-api-types/v10';
import { GuildWelcomeScreenChannel } from './GuildWelcomeScreenChannel';

export class GuildWelcomeScreen {
  /**
   * The welcome screen short message
   */
  description: string | null;
  /**
   * Array of suggested channels
   */
  welcomeChannels: GuildWelcomeScreenChannel[];
  constructor(data: APIGuildWelcomeScreen) {
    this.#parseData(data);
  }

  #parseData(data: APIGuildWelcomeScreen) {
    if ('description' in data) this.description = data.description;
    // TODO: better parsing
    if ('welcome_channels' in data) this.welcomeChannels = data.welcome_channels.map(channel => new GuildWelcomeScreenChannel(channel));
  }
}
