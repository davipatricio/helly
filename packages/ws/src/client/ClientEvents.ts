import type { GatewayDispatchPayload } from 'discord-api-types/v10';
import type WebSocket from 'ws';

export interface ClientEvents {
  /**
   * Emitted when the client closes the WebSocket connection
   */
  Close: [code: number, reason: string];
  /**
   * Emitted for general debugging information
   */
  Debug: [message: string];
  /**
   * Emitted when Discord sends a dispatch event
   */
  Dispatch: [data: GatewayDispatchPayload];
  /**
   * Emitted when the client encounters an error
   */
  Error: [error: Error];
  /**
   * Emitted when the client starts a new WebSocket connection
   */
  Open: [];
  /**
   * Emitted when the client receives a message from the WebSocket
   */
  Raw: [data: WebSocket.Data];
}
