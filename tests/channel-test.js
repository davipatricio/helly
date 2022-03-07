// @ts-nocheck
const { Events, Channel, ChannelType } = require('../build/cjs/index');
 
module.exports.startChannelTests = (client) => {
    client.on(Events.Ready, async () => {
        const randomNumber = Math.floor(Math.random() * (2500 - 500 + 1) + 500)
        const channel = client.caches.channels.get('949804142048727050');

        if (!channel) throw new Error('Channel not found.');
        if (!(channel instanceof Channel)) throw new Error('Test channel is not instance of Channel.');
        if (channel.type !== ChannelType.GuildText) throw new Error('Test channel is not a text channel.');

        if (channel.id !== '949804142048727050') throw new Error('Role ID is not equal to \'949804142048727050\'.');

        await channel.setName(`auto-helly-test-${randomNumber}`).then(channel => {
            if (channel.name !== `auto-helly-test-${randomNumber}`) throw new Error(`Channel name is not equal to \'auto-helly-test-${randomNumber}\'`);
        })

        console.log('   [Channel Tests] ✅ Channel tests passed.')
    })
}