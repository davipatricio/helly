import { ActionRowBuilder } from '@discordjs/builders';
import type {
  APIActionRowComponent,
  APIButtonComponent,
  APIChannel,
  APIEmbed,
  APIMessageActionRowComponent,
  APIMessageReferenceSend,
  APISelectMenuComponent,
  APITextChannel,
  APITextInputComponent,
  MessageFlags,
} from 'discord-api-types/v10';
import { Embed } from '../../builders/Embed';
import type { ChannelData, MessageReferenceSend } from '../../structures/Channel';
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

  static messageEmbeds(data?: Embed | APIEmbed) {
    if (!data) return undefined;
    if (data instanceof Embed) return data.toJSON();
    return data;
  }

  static messageFlags(data?: MessageFlags | MessageFlagsBitField) {
    if (!data) return undefined;
    if (data instanceof MessageFlagsBitField) return data.bitfield;
    return new MessageFlagsBitField(data).bitfield;
  }

  static channelData(data?: ChannelData): APIChannel | undefined {
    if (!data) return undefined;
    const parsedData = data as unknown as APIChannel;
    if (data.rateLimitPerUser) (parsedData as APITextChannel).rate_limit_per_user = data.rateLimitPerUser;
    if (data.type) parsedData.type = Parsers.channelCustomType(data.type);
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