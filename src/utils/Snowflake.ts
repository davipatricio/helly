const epoch = new Date('2015-01-01T00:00:00.000Z').getTime();

class Snowflake extends null {
	static deconstruct(id: string | bigint) {
		const bigIntSnowflake = BigInt(id);
		return Number(bigIntSnowflake >> 22n) + epoch;
	}
}

export { Snowflake };