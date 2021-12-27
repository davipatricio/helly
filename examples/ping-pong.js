import Helly from 'helly';

const client = new Helly.Client({
	intents: ['GUILDS', 'GUILD_MESSAGES'],
});

client.on('message', message => {
	if (message.content === '!ping') {
		message.reply(`Pong! ${client.ping}ms.`)
			.then(msg => console.log(`Sent message ${msg.content} with ID: ${msg.id}`))
			.catch(console.err);
	}
});

client.login('Token');