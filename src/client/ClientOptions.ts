import type { AllowedMentionsOptions } from '../structures/TextChannel';

export interface ClientOptions {
    autoReconnect?: boolean,
    shardId?: number,
    shardCount?: number,
    apiVersion?: number,
    large_threshold?: number,
    intents?: Array<string> | number,
    disabledEvents?: Array<string>,
    properties?: HTTPOptions,
    failIfNotExists?: boolean,
    allowedMentions: AllowedMentionsOptions
}

export interface HTTPOptions {
    $os?: string,
    $browser?: string,
    $device?: string,
}
