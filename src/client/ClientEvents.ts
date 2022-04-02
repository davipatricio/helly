import type { ButtonInteraction, SelectMenuInteraction } from '../structures';
import type { Channel } from '../structures/Channel';
import type { ChatInputCommandInteraction } from '../structures/ChatInputCommandInteraction';
import type { Guild } from '../structures/Guild';
import type { Message } from '../structures/Message';
import type { ModalSubmitInteraction } from '../structures/ModalSubmitInteraction';
import type { GuildMembersChunkEventArgs } from './actions/GUILD_MEMBERS_CHUNK';
import type { Client } from './Client';

export interface ClientEvents {
  /** Emitted whenever a guild channel is created */
  ChannelCreate: [channel: Channel];
  /** Emitted whenever a channel is deleted */
  ChannelDelete: [channel: Channel];
  Debug: [information: string];
  /** Emitted when the client becomes ready to start working */
  Ready: [client: Client];
  Reconnecting: [];
  /** Emitted whenever the client joins a guild */
  GuildCreate: [guild: Guild];
  /** Emitted whenever a guild kicks the client or the guild is deleted/left */
  GuildDelete: [guild: Guild];
  /** Emitted whenever a guild is updated - e.g. name change */
  GuildUpdate: [oldGuild: Guild | undefined, newGuild: Guild];
  /** Emitted whenever a guild becomes unavailable, likely due to a server outage */
  GuildUnavailable: [guild: Guild];
  /** Emitted whenever a chunk of guild members is received (all members come from the same guild) */
  GuildMembersChunk: [data: GuildMembersChunkEventArgs];
  /**
   * Emitted whenever a message is created
   * @see https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Privileged-Intent-for-Verified-Bots
   */
  MessageCreate: [data: Message];
  /**
   * Emitted whenever a message is deleted
   * Can miss structures if the message is not cached
   */
  MessageDelete: [data: Message];
  InteractionCreate: [interaction: ChatInputCommandInteraction | ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction];
}
