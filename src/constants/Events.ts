/* eslint-disable no-shadow */
export const enum Events {
  Ready = 'Ready',
  Debug = 'Debug',
  Reconnecting = 'Reconnecting',
  GuildCreate = 'GuildCreate',
  GuildDelete = 'GuildDelete',
  GuildUnavailable = 'GuildUnavailable',
}

export const enum RestEvents {
  ApiRequest = 'ApiRequest',
  ApiResponse = 'ApiResponse',
}
