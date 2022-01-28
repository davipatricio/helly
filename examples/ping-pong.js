const { Client } = require('helly')

const client = new Client({
	intents: ['GUILDS', 'GUILD_MESSAGES'],
});

client.on('messageCreate', message => {
	if (message.content === '!ping') {
		message.reply(`Pong! ${client.ping}ms.`)
			.then(msg => console.log(`Sent message ${msg.content} with ID: ${msg.id}`))
			.catch(console.err);
	}
});

client.login('Token');