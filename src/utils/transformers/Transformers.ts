import { ActionRowBuilder } from '@discordjs/builders';
import type {
  APIActionRowComponent,
  APIButtonComponent,
  APIChannel,
  APIEmbed,
  APIGuild,
  APIMessageActionRowComponent,
  APIMessageReferenceSend,
  APISelectMenuComponent,
  APITextChannel,
  APITextInputComponent,
  MessageFlags,
} from 'discord-api-types/v10';
import { Embed } from '../../builders/Embed';
import type { ChannelData, MessageReferenceSend } from '../../structures/Channel';
import type { Guild } from '../../structures/Guild';
import { MessageFlagsBitField } from '../bitfield/MessageFlagsBitField';
import { Parsers } from './Parsers';

class Transformers extends null {
  static messageReference(data: MessageReferenceSend) {
    if (!data) return undefined;
    return {
      message_id: data.messageId as string,
      guild_id: data.guildId,
      channel_id: data.channelId,
      fail_if_not_exists: data.failIfNotExists,
    } as APIMessageReferenceSend;
  }

  static messageEmbeds(): undefined;
  static messageEmbeds(data?: Embed | APIEmbed): APIEmbed;
  static messageEmbeds(data?: Embed | APIEmbed) {
    if (!data) return undefined;
    if (data instanceof Embed) return data.toJSON();
    return data;
  }

  static messageFlags(): undefined;
  static messageFlags(data?: MessageFlags | MessageFlagsBitField): number;
  static messageFlags(data?: MessageFlags | MessageFlagsBitField) {
    if (!data) return undefined;
    if (data instanceof MessageFlagsBitField) return data.bitfield;
    return new MessageFlagsBitField(data).bitfield;
  }

  static channelData(): undefined;
  static channelData(data?: ChannelData): APIChannel;
  static channelData(data?: ChannelData): APIChannel | undefined {
    if (!data) return undefined;
    const parsedData = data as unknown as APIChannel;
    if (data.rateLimitPerUser) (parsedData as APITextChannel).rate_limit_per_user = data.rateLimitPerUser;
    if (data.type) parsedData.type = Parsers.channelCustomType(data.type);
    return parsedData;
  }

  static guildData(): undefined;
  static guildData(data?: Partial<Guild>): APIGuild;
  static guildData(data?: Partial<Guild>) {
    if (!data) return undefined;
    // TODO: add remaining parameters https://discord.com/developers/docs/resources/guild#membership-screening-object-json-params
    const parsedData = data as unknown as APIGuild;
    if (data.afkChannel) parsedData.afk_channel_id = data.afkChannel.id;
    if (data.afkChannelId) parsedData.afk_channel_id = data.afkChannelId;

    if (data.publicUpdatesChannel) parsedData.public_updates_channel_id = data.publicUpdatesChannel.id;
    if (data.publicUpdatesChannelId) parsedData.public_updates_channel_id = data.publicUpdatesChannelId;

    if (data.rulesChannel) parsedData.rules_channel_id = data.rulesChannel.id;
    if (data.rulesChannelId) parsedData.rules_channel_id = data.rulesChannelId;

    if (data.systemChannel) parsedData.system_channel_id = data.systemChannel.id;
    if (data.systemChannelId) parsedData.system_channel_id = data.systemChannelId;

    if (data.afkTimeout) parsedData.afk_timeout = data.afkTimeout;
    if (data.description) parsedData.description = data.description;
    if (data.ownerId) parsedData.owner_id = data.ownerId;
    if (data.premiumProgressBarEnabled) parsedData.premium_progress_bar_enabled = data.premiumProgressBarEnabled;
    return parsedData;
  }

  static messageComponents(
    data: ActionRowBuilder | APIActionRowComponent<APIMessageActionRowComponent> | undefined,
  ): APIActionRowComponent<APIButtonComponent | APISelectMenuComponent | APITextInputComponent> | undefined {
    if (!data) return undefined;
    if (data instanceof ActionRowBuilder) return data.toJSON();
    return data;
  }
}

export { Transformers };
