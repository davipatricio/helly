import EventEmitter from 'events';
import { ActionManager } from './actions/ActionManager';
import { ClientOptions, defaultValues } from './ClientOptions';
import Heartbeater from './websocket/Heartbeater';
import { WebsocketManager } from './websocket/WebsockerManager';

interface ClientAPI {
  shouldResume: boolean;
  heartbeatInterval: number | null;
  sessionId: string | null;
  sequence: number | null;
  heartbeatAcked: boolean;
  lastHeartbeatAck: number | null;
  lastHeartbeat: number | null;
  heartbeatTimer: NodeJS.Timer | null;
}

/**
 * The main hub for interacting with the Discord API, and the starting point for any bot
 */
class Client extends EventEmitter {
  /** @private */
  actions: ActionManager;
  /** @private */
  ws: WebsocketManager;
  options: ClientOptions;
  /** @private */
  api: ClientAPI;
  ready: boolean;
  token: string;
  ping: number;
  /** @param options - The options for the client */
  constructor(options = {} as Partial<ClientOptions>) {
    super();

    this.actions = new ActionManager();
    this.ws = new WebsocketManager(this);
    this.options = Object.assign(defaultValues, options);

    /** @ignore */
    this.api = {
      shouldResume: false,
      heartbeatInterval: null,
      sessionId: null,
      sequence: null,
      heartbeatAcked: false,
      lastHeartbeatAck: null,
      lastHeartbeat: null,
      heartbeatTimer: null,
    };

    this.ready = false;
    this.token = '';
    this.ping = 0;
  }

  login(token: string) {
    if (typeof token !== 'string') throw new Error('A token is required and must be a string');
    this.token = token;
    this.ws.connect();
  }

  reconnect() {
    // Stop heartbeating (this automatically verifies if there's a timer)
    Heartbeater.stop(this);

    this.cleanUp();
    this.emit('reconnecting');

    // If we don't have a session id, we cannot reconnect
    this.api.shouldResume = Boolean(this.api.sessionId);
    this.login(this.token);
  }

  cleanUp() {
    this.ping = 0;
  }
}

export { Client };
