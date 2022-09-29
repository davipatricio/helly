import { GatewayVersion } from 'discord-api-types/v10';

/**
 * Returns a websocket url for the given gateway version
 * @param url The base url
 * @param version The gateway version
 * @param encoding The encoding to use
 * @returns  The websocket url
 * @example
 * ```js
 *  const url = getWebsocketUrl('wss://gateway.discord.gg', '10', 'json');
 *  console.log(url); // wss://gateway.discord.gg/?v=10&encoding=json
 * ```
 */
export function websocketVersion(url: string, version = GatewayVersion, encoding = 'json') {
  const parsedUrl = new URL(url);
  if (parsedUrl.searchParams.has('v') && parsedUrl.searchParams.has('encoding')) return url;

  parsedUrl.searchParams.set('v', version);
  parsedUrl.searchParams.set('encoding', encoding);
  return parsedUrl.toString();
}
