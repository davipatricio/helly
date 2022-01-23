const epoch = new Date('2015-01-01T00:00:00.000Z').getTime();

/**
 * Utility class for working with Snowflakes
 */
class Snowflake extends null {
	/**
	 * Deconstructs a Discord snowflake.
	 * @param {string | bigint} id - The snowflake to deconstruct
	 * @example
	 * const timestamp = Snowflake.deconstruct('934675087108481044');
	 * @returns {number}
	 */
	static deconstruct(id: string | bigint) {
		const bigIntSnowflake = BigInt(id);
		return Number(bigIntSnowflake >> 22n) + epoch;
	}
}

export { Snowflake };