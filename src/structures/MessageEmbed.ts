export interface MessageEmbedFooter {
	text: string;
	icon_url?: string;
	proxy_url?: string;
}

export interface MessageEmbedImage {
	url: string;
	height?: number;
	width?: number;
	proxy_url?: string;
}

export interface MessageEmbedThumbnail {
	url: string;
	height?: number;
	width?: number;
	proxy_url?: string;
}

export interface MessageEmbedAuthor {
	name: string;
	url?: string;
	icon_url?: string;
	proxy_icon_url?: string;
}

export interface MessageEmbedField {
	name: string;
	value: string;
	inline?: boolean;
}

export interface RawMessageEmbed {
	title?: string;
	description?: string | null;
	url?: string | null;
	timestamp?: number | null;
	color?: number | null;
	footer?: MessageEmbedFooter | null;
	image?: MessageEmbedImage | null;
	thumbnail?: MessageEmbedThumbnail | null;
	author?: MessageEmbedAuthor | null;
	fields?: MessageEmbedField[];
}

class MessageEmbed {
	title?: string;
	description?: string | null;
	url?: string | null;
	timestamp?: number | null;
	color?: number | null;
	footer?: MessageEmbedFooter | null;
	image?: MessageEmbedImage | null;
	thumbnail?: MessageEmbedThumbnail | null;
	author?: MessageEmbedAuthor | null;
	fields?: MessageEmbedField[];
	constructor(data = {} as RawMessageEmbed | MessageEmbed) {
		this.title = data.title;
		this.description = data.description;
		this.url = data.url;
		this.timestamp = data.timestamp;
		this.color = data.color;
		this.footer = data.footer;
		this.image = data.image;
		this.thumbnail = data.thumbnail;
		this.author = data.author;
		this.fields = data.fields ?? [];
	}

	setAuthor(name?: string, icon_url?: string, url?: string): MessageEmbed {
		this.author = name ? { name, icon_url, url } : null;
		return this;
	}

	setTitle(title?: string): MessageEmbed {
		this.title = title;
		return this;
	}

	setDescription(description?: string): MessageEmbed {
		this.description = description;
		return this;
	}

	setURL(url?: string): MessageEmbed {
		this.url = url;
		return this;
	}

	setTimestamp(timestamp = Date.now() as number): MessageEmbed {
		this.timestamp = timestamp;
		return this;
	}

	setColor(color?: number): MessageEmbed {
		this.color = color;
		return this;
	}

	setFooter(text?: string, icon_url?: string): MessageEmbed {
		this.footer = text ? { text, icon_url } : null;
		return this;
	}

	setImage(url?: string): MessageEmbed {
		this.image = url ? { url } : null;
		return this;
	}

	setThumbnail(url?: string): MessageEmbed {
		this.thumbnail = url ? { url } : null;
		return this;
	}

	addField(name: string, value: string, inline = false as boolean): MessageEmbed {
		if (!this.fields) this.fields = [];
		this.fields.push({ name, value, inline });
		return this;
	}

	toJSON(): RawMessageEmbed {
		return {
			title: this.title,
			description: this.description,
			url: this.url,
			timestamp: this.timestamp,
			color: this.color,
			footer: this.footer,
			image: this.image,
			thumbnail: this.thumbnail,
			fields: this.fields,
		};
	}
}

export { MessageEmbed };
