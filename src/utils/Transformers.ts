import { ActionRowBuilder } from '@discordjs/builders';
import {
  APIActionRowComponent,
  APIButtonComponent,
  APIChannel,
  APIEmbed,
  APIMessageActionRowComponent,
  APIMessageReference,
  APIMessageReferenceSend,
  APIRoleTags,
  APISelectMenuComponent,
  APITextChannel,
  APITextInputComponent,
  ChannelType,
  MessageFlags,
} from 'discord-api-types/v10';
import { Embed } from '../builders/Embed';
import type { ChannelData, MessageReference } from '../structures/Channel';
import type { RoleTags } from '../structures/Role';
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

function transformMessageEmbeds(data?: Embed | APIEmbed): APIEmbed | undefined {
  if (!data) return undefined;
  if (data instanceof Embed) return data.toJSON();
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

function transformMessageComponents(
  data: ActionRowBuilder | APIActionRowComponent<APIMessageActionRowComponent> | undefined,
): APIActionRowComponent<APIButtonComponent | APISelectMenuComponent | APITextInputComponent> | undefined {
  if (!data) return undefined;
  if (data instanceof ActionRowBuilder) return data.toJSON();
  return data;
}

// Parsers

function parseMessageComponents(row: APIActionRowComponent<APIMessageActionRowComponent>) {
  const actionRow = new ActionRowBuilder({ type: row.type, components: row.components });
  return actionRow;
}

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

export const Parsers = { parseMessageReference, parseMessageFlags, parseRoleTags, parseChannelCustomType, parseMessageComponents };
export const Transformers = { transformChannelData, transformMessageComponents, transformMessageReference, transformMessageEmbeds, transformMessageFlags };
