import { APIChannel, APIEmbed, APIMessageReference, APIMessageReferenceSend, APIRoleTags, APITextChannel, ChannelType, MessageFlags } from 'discord-api-types/v10';
import { EmbedBuilder, UnsafeEmbedBuilder } from '..';
import type { RoleTags } from '../structures';
import type { ChannelData, MessageReference } from '../structures/Channel';
import { MessageFlagsBitField } from './bitfield/MessageFlagsBitField';

// Transformers

function transformMessageReference(data?: APIMessageReferenceSend): APIMessageReferenceSend | undefined {
  if (!data) return undefined;
  return {
    message_id: data.message_id,
    guild_id: data.guild_id,
    channel_id: data.channel_id,
    fail_if_not_exists: data.fail_if_not_exists,
  };
}

function transformMessageEmbeds(data?: EmbedBuilder | UnsafeEmbedBuilder | APIEmbed): APIEmbed | undefined {
  if (!data) return undefined;
  if (data instanceof EmbedBuilder) return data.toJSON() as APIEmbed;
  if (data instanceof UnsafeEmbedBuilder) return data.toJSON() as APIEmbed;
  return data;
}

function transformMessageFlags(data?: MessageFlags | MessageFlagsBitField) {
  if (!data) return undefined;
  if (data instanceof MessageFlagsBitField) return data.bitfield;
  return new MessageFlagsBitField(data).bitfield;
}

function transformChannelData(data?: ChannelData): APIChannel | undefined {
  if (!data) return undefined;
  const parsedData = data as unknown as APIChannel;
  if (data.rateLimitPerUser) (parsedData as APITextChannel).rate_limit_per_user = data.rateLimitPerUser;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  if (data.type) parsedData.type = parseChannelCustomType(data.type);
  return parsedData;
}

// Parsers

function parseMessageReference(data?: APIMessageReference): MessageReference | undefined {
  if (!data) return undefined;
  return {
    messageId: data.message_id,
    guildId: data.guild_id,
    channelId: data.channel_id,
  };
}

function parseMessageFlags(data?: MessageFlags) {
  if (!data) return undefined;
  return MessageFlags[data] as keyof typeof MessageFlags;
}

function parseChannelCustomType(data?: ChannelType | number | string): ChannelType {
  if (!data) return 0;
  if (typeof data === 'string') return ChannelType[data as string] ?? 0;
  return data;
}

function parseRoleTags(data: APIRoleTags | undefined): RoleTags {
  return {
    botId: data?.bot_id ?? undefined,
    integrationId: data?.integration_id ?? undefined,
    premiumSubscriber: data?.premium_subscriber ?? null,
  };
}

export const Parsers = { parseMessageReference, parseMessageFlags, parseRoleTags, parseChannelCustomType };
export const Transformers = { transformChannelData, transformMessageReference, transformMessageEmbeds, transformMessageFlags };
