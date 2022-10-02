import type { GatewayReceivePayload } from 'discord-api-types/v10';
import { TextDecoder } from 'util';
import { inflate } from 'zlib';
import type { WebSocketClient } from './WebSocketClient';

let ZlibSync: typeof import('zlib-sync');
try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  ZlibSync = require('zlib-sync');
  // eslint-disable-next-line no-empty
} catch {}

/**
 * @private @internal
 */
export class MessageReader {
  /**
   * The client that instantiated this class
   */
  client: WebSocketClient;
  /**
   * The class that handles decompression
   */
  inflate: import('zlib-sync').Inflate;
  /**
   * The text decoder used to decode incoming messages
   */
  textDecoder = new TextDecoder();
  constructor(client: WebSocketClient) {
    this.client = client;
    if (ZlibSync)
      this.inflate = new ZlibSync.Inflate({
        chunkSize: 65_535,
        to: 'string',
      });
  }

  isZlibSyncAvailable() {
    return !!ZlibSync;
  }

  async read(data: ArrayBuffer | Buffer, isBinary: boolean) {
    const decompressable = new Uint8Array(data);

    // Deal with no compression
    if (!isBinary) return JSON.parse(this.textDecoder.decode(decompressable)) as GatewayReceivePayload;

    if (this.client.packetCompress) {
      return new Promise<GatewayReceivePayload>((resolve, reject) => {
        inflate(decompressable, { chunkSize: 65_535 }, (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(JSON.parse(this.textDecoder.decode(result)));
        });
      });
    }

    // Transport compression (gateway wide)
    if (this.inflate) {
      const l = decompressable.length;
      const flush = l >= 4 && decompressable[l - 4] === 0x00 && decompressable[l - 3] === 0x00 && decompressable[l - 2] === 0xff && decompressable[l - 1] === 0xff;

      this.inflate.push(Buffer.from(decompressable), flush ? ZlibSync.Z_SYNC_FLUSH : ZlibSync.Z_NO_FLUSH);

      if (this.inflate.err || !flush) return null;

      const { result } = this.inflate;
      if (!result) return null;

      return JSON.parse(typeof result === 'string' ? result : this.textDecoder.decode(result)) as GatewayReceivePayload;
    }

    return null;
  }
}
