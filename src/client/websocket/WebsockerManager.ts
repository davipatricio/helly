import { GatewayCloseCodes } from 'discord-api-types/v10';
import WebSocket from 'ws';
import { Events } from '../../constants';
import { WSCloseCodes } from '../../constants/WSCloseCodes';
import type { Client } from '../Client';
import * as Heartbeater from './Heartbeater';
import * as Parser from './Parser';

const Codes = {
  reconnect: [1000, GatewayCloseCodes.AlreadyAuthenticated, GatewayCloseCodes.InvalidSeq],
  throw: [GatewayCloseCodes.AuthenticationFailed, GatewayCloseCodes.InvalidShard, GatewayCloseCodes.ShardingRequired, GatewayCloseCodes.InvalidIntents, GatewayCloseCodes.DisallowedIntents],
  messages: WSCloseCodes,
};

/** @internal */
class WebsocketManager {
  connection: WebSocket;
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  connect() {
    this.connection = new WebSocket(`${this.client.options.ws.gateway}?v=${this.client.options.ws.version}&encoding=json`);
    this.connection.on('message', (data: WebSocket.RawData) => {
      if (this.connection.readyState !== WebSocket.OPEN) return;
      Parser.message(this.client, data);
    });
    this.connection.on('close', (code: number) => {
      if (!this.client.options.autoReconnect) return;
      if (typeof code !== 'number') return;
      this.parseClodeCode(code);
    });
  }

  parseClodeCode(code: number) {
    // TODO: emit disconnect event
    if (code === 1_000) {
      return;
    }
    if (Codes.reconnect.includes(code)) {
      this.client.api.sessionId = null;
      this.client.api.shouldResume = false;
      this.client.api.sequence = null;

      this.forceReconnect(false);
      this.client.emit(Events.Debug, `[DEBUG] ${Codes.messages[code] ?? 'Websocket connection closed with unknown close code. Reconnecting instead of resuming...'}`);
      return;
    }
    if (Codes.throw.includes(code)) throw new Error(`DiscordError: ${Codes.messages[code]} ${code}`);
    this.client.emit(Events.Debug, `[DEBUG] ${Codes.messages[code] ?? 'Websocket connection closed with unknown close code. Resuming instead of reconnecting...'}`);
    this.forceReconnect();
  }

  forceReconnect(resume = true) {
    Heartbeater.stop(this.client);
    this.client.api.sessionId = resume ? this.client.api.sessionId : null;

    this.client.reconnect();
    this.client.api.shouldResume = resume;
  }
}

export { WebsocketManager };
