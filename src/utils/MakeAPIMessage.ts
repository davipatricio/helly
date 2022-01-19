import { MessageEmbed, RawMessageEmbed } from '../structures/MessageEmbed';

function makeAPIMessage(data: any) {
	const finalData = data;
	if (data.embeds) {
		finalData.embeds = data.embeds.map((embed: (MessageEmbed | RawMessageEmbed)[]) => {
			return embed instanceof MessageEmbed ? embed.toJSON() : embed;
		});
	}
	return finalData;
}

export {makeAPIMessage};