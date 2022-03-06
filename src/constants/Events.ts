/* eslint-disable no-shadow */
export const enum Events {
  Ready = 'Ready',
  Debug = 'Debug',
  Reconnecting = 'Reconnecting',
  GuildCreate = 'GuildCreate',
  GuildUpdate = 'GuildUpdate',
  GuildDelete = 'GuildDelete',
  GuildUnavailable = 'GuildUnavailable',
  MessageCreate = 'MessageCreate',
}

export const enum RestEvents {
  ApiRequest = 'ApiRequest',
  ApiResponse = 'ApiResponse',
}
