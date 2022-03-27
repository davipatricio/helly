/* eslint-disable no-shadow */
export const enum Events {
  Ready = 'Ready',
  Debug = 'Debug',
  Reconnecting = 'Reconnecting',
  ChannelCreate = 'ChannelCreate',
  ChannelDelete = 'ChannelDelete',
  GuildCreate = 'GuildCreate',
  GuildDelete = 'GuildDelete',
  GuildUnavailable = 'GuildUnavailable',
  GuildMembersChunk = 'GuildMembersChunk',
  GuildUpdate = 'GuildUpdate',
  MessageCreate = 'MessageCreate',
  MessageDelete = 'MessageDelete',
  InteractionCreate = 'InteractionCreate',
}

export const enum RestEvents {
  ApiRequest = 'ApiRequest',
  ApiResponse = 'ApiResponse',
}
