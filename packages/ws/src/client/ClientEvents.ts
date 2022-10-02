import type { GatewayDispatchPayload, GatewayReceivePayload } from 'discord-api-types/v10';

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
   * Emitted when the client receives a message from the WebSocket
   */
  Message: [data: GatewayReceivePayload];
  /**
   * Emitted when the client starts a new WebSocket connection
   */
  Open: [];
}
