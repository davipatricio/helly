// @ts-nocheck
const { startMessageTests } = require('./message-test.js');
const { startRoleTests } = require('./role-test.js');

const { Client, IntentsBitField, Events } = require('../build/cjs/index');
const { token } = require('./config.json')

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

try {
    startMessageTests(client)
} catch (e) {
    console.log('   [Message Event Tests] ❌ Message event tests failed.')
    console.error(e)
}

try {
    startRoleTests(client)
} catch (e) {
    console.log('   [Role Tests] ❌ Role tests failed.')
    console.error(e)
}

client.on(Events.Ready, () => {
    console.log('   [Tests] 🤖 Bot connected.')
})

client.login(token)