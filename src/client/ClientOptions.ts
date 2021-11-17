export interface ClientOptions {
    autoReconnect?: boolean,
    shardId?: number,
    shardCount?: number,
    apiVersion?: number,
    large_threshold?: number,
    intents?: Array<string>,
    disabledEvents?: Array<string>,
    properties?: HTTPOptions,
}

export interface HTTPOptions {
    $os?: string,
    $browser?: string,
    $device?: string,
}
