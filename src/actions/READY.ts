import ClientUser from '../structures/ClientUser';
import type Client from '../client/Client';

module.exports.handle = (client: Client, { session_id, user }: { session_id: string; user: any }) => {
    client.user = new ClientUser(client, user);
    client.users.cache.set(client.user.id, client.user);

    client.api.sessionId = session_id;

    setTimeout(() => {
        client.emit('ready', client.user);
        client.ready = true;
    }, client.options.intents === 0 ? 1 : 5000).unref();
};
