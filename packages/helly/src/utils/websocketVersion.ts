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
export function websocketVersion(url: string, version = GatewayVersion, encoding = 'json', compress: 'zlib-stream' | undefined = undefined) {
  const parsedUrl = new URL(url);
  if (parsedUrl.searchParams.has('v') && parsedUrl.searchParams.has('encoding') && parsedUrl.searchParams.has('compress')) return url;

  parsedUrl.searchParams.set('v', parsedUrl.searchParams.get('v') ?? version);
  parsedUrl.searchParams.set('encoding', parsedUrl.searchParams.get('encoding') ?? encoding);

  const compressValue = parsedUrl.searchParams.get('compress') ?? compress;
  if (compressValue) parsedUrl.searchParams.set('compress', compressValue);

  return parsedUrl.toString();
}
