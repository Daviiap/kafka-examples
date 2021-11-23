module.exports = {
	jsonParse: str => {
		try {
			return JSON.parse(str);
		} catch {
			return str;
		}
	},

	jsonStringify: jsonStr => {
		try {
			return JSON.stringify(jsonStr);
		} catch {
			return jsonStr;
		}
	},
};
