/**
 * Options for a {@link Client}
 */
export interface ClientOptions {
  /**
   * Whether the client should automatically reconnect if it loses its connection
   * @defaultValue `true`
   */
  autoReconnect: boolean;
  /**
   * Token of the account to log in with
   */
  token: string;
}

export const defaultClientOptions = {
  autoReconnect: true,
  token: process.env.DISCORD_TOKEN ?? process.env.BOT_TOKEN ?? '',
} as ClientOptions;
