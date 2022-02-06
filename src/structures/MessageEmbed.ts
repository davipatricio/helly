/**
 * Represents the footer field of a {@link MessageEmbed}
 * @typedef {Object} MessageEmbedFooter
 * @property {string} [text] - The text of this footer
 * @property {string} [icon_url] - URL of the icon for this footer
 * @property {string} [proxy_url] - Proxied URL of the icon for this footer
 */
export interface MessageEmbedFooter {
	text: string;
	icon_url?: string;
	proxy_url?: string;
}

/**
 * Represents the image of a {@link MessageEmbed}
 * @typedef {Object} MessageEmbedImage
 * @property {string} [url] - URL for this image
 * @property {number} [height] - Height of this image
 * @property {number} [width] - Width of this image
 * @property {string} [proxy_url] - ProxyURL for this image
 */
export interface MessageEmbedImage {
	url: string;
	height?: number;
	width?: number;
	proxy_url?: string;
}


/**
 * Represents the thumbnail of a {@link MessageEmbed}
 * @typedef {Object} MessageEmbedThumbnail
 * @property {string} [url] - URL for this thumbnail
 * @property {number} [height] - Height of this thumbnail
 * @property {number} [width] - Width of this thumbnail
 * @property {string} [proxy_url] - ProxyURL for this thumbnail
 */
export interface MessageEmbedThumbnail {
	url: string;
	height?: number;
	width?: number;
	proxy_url?: string;
}

/**
 * The options to provide for setting an author for a {@link MessageEmbed}
 * @typedef {Object} MessageEmbedAuthor
 * @property {string} [text] - The name of this author
 * @property {string} [url] - The URL of this author
 * @property {string} [icon_url] - The icon URL of this author
 * @property {string} [proxy_icon_url] - The Proxied icon URL of this author
 */
export interface MessageEmbedAuthor {
	name: string;
	url?: string;
	icon_url?: string;
	proxy_icon_url?: string;
}

/**
 * Represents a field of a {@link MessageEmbed}
 * @typedef {Object} MessageEmbedField
 * @property {string} [name] - The name of this field
 * @property {string} [value] - The value of this field
 * @property {boolean} [inline] - If this field will be displayed inline
 */
export interface MessageEmbedField {
	name: string;
	value: string;
	inline?: boolean;
}

/**
 * Represents a Raw{@link MessageEmbed}
 * @typedef {Object} RawMessageEmbed
 * @property {?string} [title] - The title of this embed
 * @property {?string} [description] - The description of this embed
 * @property {string} [url] - The URL of this embed
 * @property {number} [timestamp] - The timestamp of this embed
 * @property {number} [color] - The color of this embed
 * @property {MessageEmbedFooter} [footer] - The footer of this embed
 * @property {MessageEmbedImage} [image] - The image of this embed
 * @property {MessageEmbedThumbnail} [thumbnail] - The thumbnail of this embed
 * @property {MessageEmbedAuthor} [author] - The author of this embed
 * @property {MessageEmbedField[]} [fields] - The fields of this embed
 */
export interface RawMessageEmbed {
	// String types
	title?: string | null;
	description?: string | null;
	url?: string | null;
	// Number types
	timestamp?: number | null;
	color?: number | null;
	// Classes types
	footer?: MessageEmbedFooter | null;
	image?: MessageEmbedImage | null;
	thumbnail?: MessageEmbedThumbnail | null;
	author?: MessageEmbedAuthor | null;
	fields?: MessageEmbedField[];
}

/**
 * Represents an embed in a message (image/video preview, rich embed, etc)
 * @param {RawMessageEmbed|MessageEmbed} [embed] - MessageEmbed to clone or raw embed data
 */
class MessageEmbed {
	title: string | null;
	description: string | null;
	url: string | null;
	timestamp: number | null;
	color: number | null;
	footer: MessageEmbedFooter | null;
	image: MessageEmbedImage | null;
	thumbnail: MessageEmbedThumbnail | null;
	author: MessageEmbedAuthor | null;
	fields: MessageEmbedField[];
	constructor(data = {} as RawMessageEmbed | MessageEmbed) {
		this.title = data.title ?? null;
		this.description = data.description ?? null;
		this.url = data.url ?? null;
		this.timestamp = data.timestamp ?? null;
		this.color = data.color ?? null;
		this.footer = data.footer ?? null;
		this.image = data.image ?? null;
		this.thumbnail = data.thumbnail ?? null;
		this.author = data.author ?? null;
		this.fields = data.fields ?? [];
	}

	/**
	 * Sets the author of this embed
	 * @param {?MessageEmbedAuthor} options - The options to provide for the author. Provide `null` to remove the author data
	 * @returns {MessageEmbed}
	 */
	setAuthor(options: MessageEmbedAuthor | null): this {
		if (options === null) {
			this.author = null;
			return this;
		}
		this.author = { name: options.name, icon_url: options.icon_url, url: options.url };
		return this;
	}

	/**
	 * Sets the title of this embed
	 * @param {string} title - The title
	 * @returns {MessageEmbed}
	 */
	setTitle(title?: string): this {
		this.title = title ?? null;
		return this;
	}

	/**
	 * Sets the description of this embed
	 * @param {string} description - The description
	 * @returns {MessageEmbed}
	 */
	setDescription(description?: string): this {
		this.description = description?? null;
		return this;
	}

	/**
	 * Sets the URL of this embed
	 * @param {string} url - The URL
	 * @returns {MessageEmbed}
	 */
	setURL(url?: string): this {
		this.url = url ?? null;
		return this;
	}

	/**
	 * Sets the timestamp of this embed
	 * @param {string} [description=Date.now()] - The timestamp
	 * @returns {MessageEmbed}
	 */
	setTimestamp(timestamp = Date.now() as number): this {
		this.timestamp = timestamp;
		return this;
	}

	/**
	 * Sets the color of this embed
	 * @param {number} [color] - The hex color
	 * @returns {MessageEmbed}
	 */
	setColor(color?: number): this {
		this.color = color ?? null;
		return this;
	}

	/**
	 * Sets the footer of this embed
	 * @param {?MessageEmbedFooter} [options] - The options to provide for the footer. Provide `null` to remove the footer data
	 * @returns {MessageEmbed}
	 */
	setFooter(options: MessageEmbedFooter | null): this {
		if (options === null) {
			this.footer = null;
			return this;
		}
		this.footer = { text: options.text, icon_url: options.icon_url, proxy_url: options.proxy_url };
		return this;
	}

	/**
	 * Sets the image of this embed
	 * @param {string} [url] - The image URL
	 * @returns {MessageEmbed}
	 */
	setImage(url?: string): this {
		this.image = url ? { url } : null;
		return this;
	}

	/**
	 * Sets the thumbnail of this embed
	 * @param {string} [url] - The thumbnail URL
	 * @returns {MessageEmbed}
	 */
	setThumbnail(url?: string): this {
		this.thumbnail = url ? { url } : null;
		return this;
	}

	/**
	 * Adds a field to the embed (max 25)
	 * @param {MessageEmbedField} [options] - The options to provide for the field
	 * @returns {MessageEmbed}
	 */
	addField(options: MessageEmbedField): this {
		if (!this.fields) this.fields = [];
		this.fields.push({ name: options.name, value: options.value, inline: options.inline ?? false });
		return this;
	}

	/**
	 * Sets the embed's fields (max 25)
	 * @param {MessageEmbedField[]} [options] - The fields to set
	 * @returns {MessageEmbed}
	 */
	setFields(options = [] as MessageEmbedField[]): this {
		if(!Array.isArray(options)) throw new TypeError('Expected an array of fields.');
		this.fields = options;
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
			author: this.author,
			fields: this.fields,
		};
	}
}

export { MessageEmbed };
