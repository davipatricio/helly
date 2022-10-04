import { RateLimit, RateLimitManager } from '@sapphire/ratelimits';
import { RouteBases } from 'discord-api-types/v10';
import { request } from 'undici';
import type { DispatchOptions } from 'undici/types/agent';
import type { HttpMethod } from 'undici/types/dispatcher';

export interface Routes {
  api: string;
  cdn: string;
  gift: string;
  invite: string;
  scheduledEvent: string;
  template: string;
}

export interface RequesterOptions {
  authorization: string;
  authorizationPrefix: 'Bearer' | 'Bot';
  routes: Partial<Routes>;
}

const DEFAULT_REQUESTER_OPTIONS: RequesterOptions = {
  authorization: '',
  authorizationPrefix: 'Bot',
  routes: {
    api: RouteBases.api,
    cdn: RouteBases.cdn,
    gift: RouteBases.gift,
    invite: RouteBases.invite,
    scheduledEvent: RouteBases.scheduledEvent,
  },
};

export class Requester {
  options: RequesterOptions;
  ratelimit: RateLimit;
  ratelimitManager: RateLimitManager;
  constructor(options?: Partial<RequesterOptions>) {
    this.#checkOptions(options);
    this.ratelimitManager = new RateLimitManager(5000);
    this.ratelimit = new RateLimit(this.ratelimitManager);
  }

  #checkOptions(options?: Partial<RequesterOptions>) {
    this.options = { ...DEFAULT_REQUESTER_OPTIONS, ...options };

    if (this.options.authorization === '') {
      throw new Error('No authorization token provided');
    }

    if (!['Bot', 'Bearer'].includes(this.options.authorizationPrefix)) {
      throw new Error('Invalid authorization prefix');
    }
  }

  // https://github.com/discordjs/discord.js/blob/d9137c36580b0fd52ad1af99324fb1026b8752d9/packages/rest/src/lib/RequestManager.ts#L495
  #getMajorParameter(endpoint: `/${string}`): string | 'global' {
    const majorIdMatch = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(endpoint);

    // Get the major id for this route - global otherwise
    const majorId = majorIdMatch?.[1] ?? 'global';
    return majorId;
  }

  request(endpoint: `/${string}`, method: HttpMethod = 'GET', body: DispatchOptions['body'] = undefined, additionalHeaders = {} as Record<string, string>) {
    const majorParam = this.#getMajorParameter(endpoint);

    const ratelimit = this.ratelimitManager.acquire(majorParam);
    // TODO: rateLimited event
    if (ratelimit.limited) {
      // Queue the request
      setTimeout(() => {
        this.request(endpoint, method, body, additionalHeaders);
      }, ratelimit.remainingTime);
      return;
    }

    ratelimit.consume();

    const url = `${this.options.routes.api ?? RouteBases.api}${endpoint}`;
    const headers = {
      Authorization: `${this.options.authorizationPrefix} ${this.options.authorization}`,
      'User-Agent': 'DiscordBot (https://github.com/davipatricio/helly, v0.0.1)',
      ...additionalHeaders,
    };

    request(url, {
      body,
      headers,
      method,
    });
  }
}
