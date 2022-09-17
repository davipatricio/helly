import type { Awaitable } from '../utils/types';

export interface ClientEvents {
  /**
   * Sent when an application command's permissions are updated
   */
  // TODO: Add application command data structure
  ApplicationCommandPermissionsUpdate: [applicationCommandData: unknown];
  /**
   * Sent when a rule is triggered and an action is executed (e.g. when a message is blocked)
   */
  // TODO: Add auto moderation action execution structure
  AutoModerationActionExecution: [actionExecutionData: unknown];
  /**
   * Sent when an auto moderation rule is created
   */
  // TODO: Add auto moderation rule structure
  AutoModerationRuleCreate: [rule: unknown];
  /**
   * Sent when an auto moderation rule is deleted
   */
  // TODO: Add auto moderation rule structure
  AutoModerationRuleDelete: [rule: unknown];
  /**
   * Sent when an auto moderation rule is updated
   */
  // TODO: Add auto moderation rule structure
  AutoModerationRuleUpdate: [rule: unknown];
  /**
   * Sent when a new guild channel is created, relevant to the current user
   */
  // TODO: Add channel structure
  ChannelCreate: [channel: unknown];
  /**
   * Sent when a channel relevant to the current user is deleted
   */
  // TODO: Add channel structure
  ChannelDelete: [channel: unknown];
  /**
   * Sent when a message is pinned or unpinned in a text channel
   */
  // TODO: add channel pins update event structure
  ChannelPinsUpdate: [data: unknown];
  /**
   * Sent when a channel is updated
   */
  // TODO: Add channel structure
  ChannelUpdate: [channel: unknown];
  /**
   * Sent when a user is banned from a guild
   */
  // TODO: Add guild structure
  // TODO: Add user structure
  GuildBanAdd: [guild: unknown, user: unknown];
  /**
   * Sent when a user is unbanned from a guild
   */
  // TODO: Add guild structure
  // TODO: Add user structure
  GuildBanRemove: [guild: unknown, user: unknown];
  /**
   * Sent when the current user joins a new Guild
   */
  // TODO: Add guild structure
  GuildCreate: [guild: unknown];
  /**
   * Sent when the user leaves or is removed from a guild
   */
  // TODO: Add guild structure
  GuildDelete: [guild: unknown];
  /**
   * Sent when a guild integration is updated
   */
  GuildIntegrationsUpdate: [guild: unknown];
  /**
   * Sent when a new user joins a guild
   */
  // TODO: Add guild member structure
  GuildMemberAdd: [guildMember: unknown];
  /**
   * Sent when a user is removed from a guild (leave/kick/ban)
   */
  // TODO: Add guild member structure
  GuildMemberRemove: [guildMember: unknown];
  /**
   * Sent when the client request the members of a guild
   */
  // TODO: Add guild members chunk structure
  GuildMembersChunk: [chunkData: unknown];
  /**
   * Sent when a guild member is updated. This will also fire when the user object of a guild member changes
   */
  // TODO: Add guild member structure
  GuildMemberUpdate: [guildMember: unknown];
  /**
   * Sent when a guild role is created
   */
  // TODO: Add role structure
  // TODO: Add guild structure
  GuildRoleCreate: [guild: unknown, role: unknown];
  /**
   * Sent when a guild role is deleted
   */
  // TODO: Add role structure
  // TODO: Add guild structure
  GuildRoleDelete: [guild: unknown, role: unknown];
  /**
   * Sent when a guild role is updated
   */
  // TODO: Add role structure
  // TODO: Add guild structure
  GuildRoleUpdate: [guild: unknown, role: unknown];
  /**
   * Sent when a guild scheduled event is created
   */
  // TODO: Add guild scheduled event structure
  GuildScheduledEventCreate: [scheduledEvent: unknown];
  /**
   * Sent when a guild scheduled event is deleted
   */
  // TODO: Add guild scheduled event structure
  GuildScheduledEventDelete: [scheduledEvent: unknown];
  /**
   * Sent when a guild scheduled event is updated
   */
  // TODO: Add guild scheduled event structure
  GuildScheduledEventUpdate: [scheduledEvent: unknown];
  /**
   * Sent when a user has subscribed to a guild scheduled event
   */
  // TODO: Add guild scheduled event structure
  // TODO: Add user structure
  // TODO: Add guild structure
  GuildScheduledEventUserAdd: [guild: unknown, user: unknown, event: unknown];
  /**
   * Sent when a user has unsubscribed from a guild scheduled event
   */
  // TODO: Add guild scheduled event structure
  // TODO: Add user structure
  // TODO: Add guild structure
  GuildScheduledEventUserRemove: [guild: unknown, user: unknown, event: unknown];
  /**
   * Sent when a guild's stickers have been updated
   */
  GuildStickersUpdate: [guild: unknown, stickers: unknown[]];
  /**
   * Sent when a guild becomes unavailable due to an outage
   */
  // TODO: Add guild structure
  GuildUnavailable: [guild: unknown];
  /**
   * Sent when a guild is updated
   */
  // TODO: Add guild structure
  GuildUpdate: [guild: unknown];
  /**
   * Sent on connection to the websocket
   */
  Hello: [ms: number];
  /**
   * Sent when an integration is created
   */
  // TODO: Add integration structure
  IntegrationCreate: [guild: unknown, integration: unknown];
  /**
   * Sent when an integration is delete
   */
  // TODO: Add integration structure
  IntegrationDelete: [guild: unknown, integration: unknown];
  /**
   * Sent when an integration is updated
   */
  // TODO: Add integration structure
  IntegrationUpdate: [guild: unknown, integration: unknown];
  /**
   * Sent when a user uses an Application Command or Message Component
   */
  // TODO(docs): add links
  // TODO: Add interaction structure
  InteractionCreate: [interaction: unknown];
  /**
   * Sent to indicate one of at least three different situations:
   * - the gateway could not initialize a session after receiving an Opcode 2 Identify
   * - the gateway could not resume a previous session after receiving an Opcode 6 Resume
   * - the gateway has invalidated an active session and is requesting client action
   */
  InvalidSession: [resumable: boolean];
  /**
   * Sent when a new invite to a channel is created
   */
  // TODO: Add invite structure
  InviteCreate: [invite: unknown];
  /**
   * Sent when an invite is deleted
   */
  // TODO: Add invite structure
  InviteDelete: [invite: unknown];
  /**
   * Sent when a message is created
   */
  // TODO: Add message structure
  MessageCreate: [message: unknown];
  /**
   * Sent when a message is deleted
   */
  // TODO: Add message structure
  MessageDelete: [message: unknown];
  /**
   * Sent when multiple messages are deleted at once
   */
  // TODO: Add message delete bulk structure
  MessageDeleteBulk: [data: unknown];
  /**
   * Sent when a user adds a reaction to a message
   */
  // TODO: Add message reaction structure
  MessageReactionAdd: [messageReaction: unknown];
  /**
   * Sent when a user removes a reaction from a message
   */
  // TODO: Add message reaction structure
  MessageReactionRemove: [messageReaction: unknown];
  /**
   * Sent when a user explicitly removes all reactions from a message
   */
  MessageReactionRemoveAll: [data: unknown];
  /**
   * Sent when a bot removes all instances of a given emoji from the reactions of a message
   */
  // TODO: Add message reaction structure
  MessageReactionRemoveEmoji: [messageReaction: unknown];
  /**
   * Sent when a message is updated
   */
  // TODO: Add message structure
  MessageUpdate: [message: unknown];
  /**
   * A user's presence is their current state on a guild. This event is sent when a user's presence or info, such as name or avatar, is updated
   */
  // TODO: Add presence structure
  PresenceUpdate: [data: unknown];
  /**
   * The ready event is dispatched when a client has completed the initial handshake with the gateway (for new sessions)
   */
  Ready: [];
  /**
   * The reconnect event is dispatched when a client should reconnect to the gateway (and resume their existing session, if they have one)
   */
  Reconnect: [];
  /**
   * The resumed event is dispatched when a client has sent a resume payload to the gateway (for resuming existing sessions)
   */
  Resumed: [];
  /**
   * Sent when a Stage instance is created (i.e. the Stage is now "live")
   */
  // TODO: Add stage instance structure
  StageInstanceCreate: [stageInstance: unknown];
  /**
   * Sent when a Stage instance has been updated
   */
  // TODO: Add stage instance structure
  StageInstanceDelete: [stageInstance: unknown];
  /**
   * Sent when a Stage instance has been deleted (i.e. the Stage has been closed)
   */
  // TODO: Add stage instance structure
  StageInstanceUpdate: [stageInstance: unknown];
  /**
   * Sent when a thread is created, relevant to the current user, or when the current user is added to a thread
   */
  // TODO: Add channel structure
  ThreadCreate: [channel: unknown];
  /**
   * Sent when a thread relevant to the current user is deleted
   */
  // TODO: Add channel structure
  ThreadDelete: [channel: unknown];
  /**
   * Sent when the current user gains access to a channel
   */
  // TODO: Add thread list sync event structure
  ThreadListSync: [data: unknown];
  /**
   * Sent when anyone is added to or removed from a thread
   */
  // TODO: add thread members update structure
  ThreadMembersUpdate: [data: unknown];
  /**
   * Sent when the thread member object for the current user is updated
   */
  // TODO(docs): add link to thread member structure
  // TODO: Add thread member structure
  ThreadMemberUpdate: [threadMember: unknown];
  /**
   * Sent when a thread is updated
   */
  // TODO: Add channel structure
  ThreadUpdate: [channel: unknown];
  /**
   * Sent when a user starts typing in a channel
   */
  // TODO: Add typing structure
  TypingStart: [data: unknown];
  /**
   * Sent when properties about the user change
   */
  // TODO: Add user structure
  UserUpdate: [user: unknown];
  /**
   * Sent when a guild's voice server is updated. This is sent when initially connecting to voice, and when the current voice instance fails over to a new server
   */
  // TODO: Add voice server structure
  VoiceServerUpdate: [data: unknown];
  /**
   * Sent when someone joins/leaves/moves voice channels
   */
  // TODO: Add voice state structure
  VoiceStateUpdate: [data: unknown];
  /**
   * Sent when a guild channel's webhook is created, updated, or deleted
   */
  // TODO: Add webhook update structure
  WebhooksUpdate: [data: unknown];
}

declare module 'events' {
  interface EventEmitter {
    // Types from discordeno: https://github.com/discordeno/discordeno
    emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
    emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: unknown[]): boolean;
    off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): this;

    off<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => Awaitable<void>): this;

    on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): this;
    on<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => Awaitable<void>): this;

    once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): this;
    once<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => Awaitable<void>): this;

    removeAllListeners<K extends keyof ClientEvents>(event?: K): this;
    removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ClientEvents>): this;
  }
}
