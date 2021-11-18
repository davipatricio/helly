import type Client from '../Client';

function sendIdentify(client: Client) {
  const IdentifyPayload = {
    op: 2,
    d: {
      large_threshold: client.options.large_threshold,
      compress: false,
      shards: [client.options.shardId, client.options.shardCount],
      token: client.token,
      intents: client.options.intents,
      properties: client.options.properties,
    },
  };

  client.ws.connection?.send(JSON.stringify(IdentifyPayload));
}

function sendResume(client: Client) {
  const ResumePayload = {
    op: 6,
    d: {
      token: client.token,
      session_id: client.api.sessionId,
      seq: client.api.sequence,
    },
  };

  client.ws.connection?.send(JSON.stringify(ResumePayload));
}

export default {
  sendIdentify,
  sendResume,
};
