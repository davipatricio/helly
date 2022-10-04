import { RouteBases } from 'discord-api-types/v10';

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
  constructor(options?: Partial<RequesterOptions>) {
    this.#checkOptions(options);
  }

  #checkOptions(options?: Partial<RequesterOptions>) {
    this.options = { ...options, ...DEFAULT_REQUESTER_OPTIONS };

    if (this.options.authorization === '') {
      throw new Error('No authorization token provided');
    }

    if (!['Bot', 'Bearer'].includes(this.options.authorizationPrefix)) {
      throw new Error('Invalid authorization prefix');
    }
  }
}
