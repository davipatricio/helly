import type { Method } from 'axios';
import { setTimeout as sleep } from 'node:timers/promises';
import type { Client } from '../../client/Client';
import type { Headers } from './RestManager';

export interface Ratelimit {
  reset?: number;
  remainingRequests?: number;
  removing?: boolean;
}

const RatelimitCache: Record<string, Ratelimit> = {};

/** @internal */
class Ratelimits extends null {
  static isRatelimited(majorId: string): boolean {
    if (!RatelimitCache[majorId]) return false;
    return RatelimitCache[majorId].remainingRequests === 0;
  }

  static checkRatelimit(majorId: string, headers: Headers): void {
    const remainingRequests = Number(headers['x-ratelimit-remaining'] || 5);
    const reset = Math.round(Number(headers['x-ratelimit-reset-after'] || 0) * 1000) + 250;
    RatelimitCache[majorId] = { removing: false, remainingRequests, reset };
    if (remainingRequests === 0) Ratelimits.applyRatelimit(majorId);
  }

  static applyRatelimit(majorId: string) {
    if (RatelimitCache[majorId].removing) return;

    RatelimitCache[majorId].removing = true;
    setTimeout(() => {
      RatelimitCache[majorId] = {};
    }, RatelimitCache[majorId].reset).unref();
  }

  // eslint-disable-next-line no-underscore-dangle
  static _majorId(endpoint: string) {
    // From: https://github.com/discordjs/discord.js/blob/307389a335d0fef25c6e8a3c7e401b1328629bc4/packages/rest/src/lib/RequestManager.ts#L427
    const majorIdMatch = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(endpoint);
    return majorIdMatch?.[1] ?? 'global';
  }

  // eslint-disable-next-line no-underscore-dangle
  static async _retry(client: Client, endpoint: string, method: Method, data: any, additionalHeaders: Headers, majorId: string, _retries: number) {
    client.emit('rateLimit', { endpoint, reset: RatelimitCache[majorId].reset });
    await sleep(RatelimitCache[majorId].reset);
    return client.rest.make(endpoint, method, data, additionalHeaders, _retries + 1);
  }
}

export { Ratelimits };
