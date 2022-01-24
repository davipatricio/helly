const epoch = new Date('2015-01-01T00:00:00.000Z').getTime();
let INCREMENT = BigInt(0);

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
	static generate(timestamp = Date.now() as number) {
		if (INCREMENT >= 4095n) INCREMENT = BigInt(0);

		// Assign WorkerId as 1 and ProcessId as 0:
		return ((BigInt(timestamp - epoch) << 22n) | (1n << 17n) | INCREMENT++).toString();
	}

}

export { Snowflake };