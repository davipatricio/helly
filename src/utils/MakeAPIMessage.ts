import { MessageEmbed, RawMessageEmbed } from '../structures/MessageEmbed';

function makeAPIMessage(data: any) {
	if (data.embeds) {
		data.embeds = data.embeds.map((embed: (MessageEmbed | RawMessageEmbed)[]) => {
			return embed instanceof MessageEmbed ? embed.toJSON() : embed;
		});
	}
	return data;
}

export { makeAPIMessage };
