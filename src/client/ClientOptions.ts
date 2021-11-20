import type { AllowedMentionsOptions } from '../structures/TextChannel';

export interface ClientOptions {
  autoReconnect?: boolean;
  compress?: boolean;
  shardId?: number;
  shardCount?: number;
  shards?: Array<number>;
  apiVersion?: number;
  large_threshold?: number;
  intents?: Array<string | undefined> | number;
  disabledEvents?: string[];
  properties?: HTTPOptions;
  failIfNotExists?: boolean;
  allowedMentions?: AllowedMentionsOptions;
  cache?: ClientCacheOptions;
}

export interface ClientCacheOptions {
  guilds?: number;
  channels?: number;
  users?: number;
  members?: number;
  presences?: number;
  messages?: number;
  emojis?: number;
  roles?: number;
}

export interface HTTPOptions {
  $os?: string;
  $browser?: string;
  $device?: string;
}

export const defaultValues: ClientOptions = {
  autoReconnect: true,
  compress: false,
  disabledEvents: [],
  // Caching Options
  cache: {
    guilds: Infinity,
    channels: Infinity,
    users: Infinity,
    members: Infinity,
    presences: Infinity,
    messages: 100,
    emojis: 300,
    roles: Infinity,
  },

  // Data sent in IDENTIFY payload
  shardId: 0,
  shardCount: 1,

  apiVersion: 9,

  intents: [],
  large_threshold: 50,

  properties: {
    $os: process.platform,
    $browser: 'peachy.js',
    $device: 'peachy.js',
  },

  // Default message options
  failIfNotExists: false,
  allowedMentions: {
    parse: ['users', 'roles'],
    replied_user: true,
    users: [],
    roles: [],
  },
};
