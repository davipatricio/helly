const WSCloseCodes = {
  4000: 'Unknown websocket error! Resuming...',
  4001: 'We have sent an unknwon or invalid opcode to Discord. Reconnecting...',
  4002: 'We have sent an invalid payload to Discord. Reconnecting...',
  4003: 'We have sent a payload to Discord before connecting. Resuming...',
  4004: 'The provided account token is incorrect, NOT attempting to reconnect.',
  4005: 'We have tried to send more than one identify payload. Reconnecting...',
  4007: 'We have provided an invalid sequence to Discord. Reconnect...',
  4008: 'Unexpected Rate Limit! Reconnecting in 3 seconds...',
  4009: 'The bot session timed out. Reconnecting and starting a new one.',
  4010: 'You have provided invalid sharding data, NOT attempting to reconnect.',
  4011: 'The session would have handled too many guilds - you are required to shard your connection in order to connect.',
  4012: 'You have provided an invalid API versiion, NOT attempting to reconnect.',
  4013: 'Invalid intents provided, NOT attempting to reconnect.',
  4014: 'You sent a disallowed intent for a Gateway Intent, NOT attempting to reconnect.',
};

export { WSCloseCodes };
