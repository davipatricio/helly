// @ts-nocheck
const { ButtonStyle } = require('discord-api-types/v10');
const { Events, Message, ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require('../build/cjs/index');

const embed = new EmbedBuilder().setTitle('Abc').setDescription('Def');

module.exports.startMessageTests = (client) => {
    client.on(Events.Ready, () => {
        const channel = client.caches.channels.get('949804142048727050');
        if (!channel) throw new Error('Channel not found.');
        const row = new ActionRowBuilder();
        const firstButton = new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel('Test button').setCustomId('test_id');
        const linkButton = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Link button').setURL('https://google.com');
        row.addComponents(firstButton, linkButton)

        channel.send({ content: 'Hello World!', embeds: [embed], components: [row] }).then(message => {
            if (!(message instanceof Message)) throw new Error('Sent message is not instance of Message.');
            if (message.channel.id !== channel.id) throw new Error('Message channel is not equal to channel.');
            if (message.author.id !== client.user.id) throw new Error('Message sender ID is not equal to client user ID.');
            if (message.guild.id !== '542107745785217065') throw new Error('Message guild ID is not equal to \'542107745785217065\'.');

            if (message.content !== 'Hello World!') throw new Error('Message content is not equal to \'Hello World!\'.');

            if (message.embeds.length !== 1) throw new Error('Message embeds length is not equal to 1.');
            if (!(message.embeds[0] instanceof EmbedBuilder)) throw new Error('Message embed is not instance of EmbedBuilder.');
            if (message.embeds[0].data.title !== 'Abc') throw new Error('Message embed title is not equal to \'Abc\'.');
            if (message.embeds[0].data.description !== 'Def') throw new Error('Message embed description is not equal to \'Def\'.');

            console.log('   [Message Event Tests] ✅ Message event tests passed.')
        }).catch(e => {
            throw e
        })
    })
}