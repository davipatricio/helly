import { ActivityType, GatewayActivityUpdateData, GatewayIdentify, GatewayOpcodes, GatewayPresenceUpdateData, GatewayResume, GatewayUpdatePresence, PresenceUpdateStatus } from 'discord-api-types/v10';
import { Events } from '../../constants';
import type { Client } from '../Client';

function sendIdentify(client: Client) {
  const data: GatewayIdentify = {
    op: GatewayOpcodes.Identify,
    d: {
      token: client.token,
      intents: client.options.intents.bitfield,
      compress: false,
      large_threshold: client.options.ws.largeThreshold,
      properties: {
        $browser: 'helly',
        $device: 'helly',
        $os: process.platform,
      },
    },
  };

  client.emit(Events.Debug, `[DEBUG] Sending Identify payload to the Gateway.`);
  client.ws.send(JSON.stringify(data));
}

function sendResume(client: Client): void {
  const ResumePayload: GatewayResume = {
    op: GatewayOpcodes.Resume,
    d: {
      token: client.token,
      session_id: client.api.sessionId as string,
      seq: client.api.sequence as number,
    },
  };

  client.emit(Events.Debug, `[DEBUG] Sending Resume payload to the Gateway.`);
  client.ws.send(JSON.stringify(ResumePayload));
}

function setAFK(client: Client, afk: boolean) {
  const UpdatePresencePayload: GatewayUpdatePresence = {
    op: GatewayOpcodes.PresenceUpdate,
    d: {
      since: null,
      activities: [],
      status: PresenceUpdateStatus.Online,
      afk,
    },
  };

  client.emit(Events.Debug, `[DEBUG] Sending Update Presence payload to the Gateway.`);
  client.ws.send(JSON.stringify(UpdatePresencePayload));
}

function setStatus(client: Client, status: PresenceUpdateStatus) {
  const UpdatePresencePayload: GatewayUpdatePresence = {
    op: GatewayOpcodes.PresenceUpdate,
    d: {
      since: null,
      activities: [],
      status,
      afk: false,
    },
  };

  client.emit(Events.Debug, `[DEBUG] Sending Update Presence payload to the Gateway.`);
  client.ws.send(JSON.stringify(UpdatePresencePayload));
}

function setActivity(client: Client, activity: GatewayActivityUpdateData) {
  const UpdatePresencePayload: GatewayUpdatePresence = {
    op: GatewayOpcodes.PresenceUpdate,
    d: {
      since: null,
      activities: [
        {
          name: activity.name ?? '',
          type: activity.type ?? ActivityType.Playing,
          url: activity.url ?? null,
        },
      ],
      status: PresenceUpdateStatus.Online,
      afk: false,
    },
  };

  client.emit(Events.Debug, `[DEBUG] Sending Update Presence payload to the Gateway.`);
  client.ws.send(JSON.stringify(UpdatePresencePayload));
}

function setPresence(client: Client, data: GatewayPresenceUpdateData) {
  if (!data.activities) data.activities = [];
  const UpdatePresencePayload: GatewayUpdatePresence = {
    op: GatewayOpcodes.PresenceUpdate,
    d: {
      since: null,
      activities: [
        {
          name: data.activities[0]?.name ?? '',
          type: data.activities[0]?.type ?? ActivityType.Playing,
          url: data.activities[0]?.url ?? null,
        },
      ],
      status: data.status ?? PresenceUpdateStatus.Online,
      afk: data.afk ?? false,
    },
  };

  client.emit(Events.Debug, `[DEBUG] Sending Update Presence payload to the Gateway.`);
  client.ws.send(JSON.stringify(UpdatePresencePayload));
}

export { sendIdentify, sendResume, setAFK, setStatus, setPresence, setActivity };
