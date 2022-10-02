import type { GatewayReceivePayload } from 'discord-api-types/v10';
import type WebSocket from 'ws';

let ZlibSync: typeof import('zlib-sync');
try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  ZlibSync = require('zlib-sync');
  // eslint-disable-next-line no-empty
} catch {}

let Erlpack: typeof import('erlpack');
try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  Erlpack = require('erlpack');
  // eslint-disable-next-line no-empty
} catch {}

export class MessageReader {
  inflate: import('zlib-sync').Inflate;
  constructor() {
    this.inflate = new ZlibSync.Inflate({
      chunkSize: 128 * 1024,
    });
  }

  read(data: WebSocket.Data, isCompressed = false) {
    let newData = data as Buffer;
    if (data instanceof ArrayBuffer && (isCompressed || Erlpack)) {
      newData = Buffer.from(data);
      // Fragmented messages
    } else if (Array.isArray(data)) newData = Buffer.concat(data);

    if (newData.length >= 4 && newData.readUInt32BE(newData.length - 4) === 0xffff) {
      this.inflate.push(data as Buffer, ZlibSync.Z_SYNC_FLUSH);
      if (this.inflate.err) throw new Error(`zlib error: ${this.inflate.msg}`);

      newData = Buffer.from(this.inflate.result as string);
    } else this.inflate.push(newData, false);

    if (Erlpack) {
      return Erlpack.unpack(newData) as GatewayReceivePayload;
    }
    return JSON.parse(newData.toString()) as GatewayReceivePayload;
  }
}
