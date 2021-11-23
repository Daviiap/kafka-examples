const axios = require("axios");
const { v4 } = require("uuid");

const dbConnection = axios.create({
	baseURL: "http://localhost:9000",
});

const orders = {};

const ordersRepository = {
	create: async data => {
		try {
			const { data: response } = await dbConnection.post("/query", {
				method: "create",
				query: { data },
			});
			return response;
		} catch (error) {
			console.log(error);
		}
	},
	update: async (orderId, data) => {
		try {
			const { data: response } = await dbConnection.post("/query", {
				method: "update",
				query: { orderId, data },
			});
			return response;
		} catch (error) {
			console.log(error);
		}
	},
	delete: async orderId => {
		try {
			const { data: response } = await dbConnection.post("/query", {
				method: "delete",
				query: { orderId },
			});
			return response;
		} catch (error) {
			console.log(error);
		}
	},
	get: async orderId => {
		try {
			const { data: response } = await dbConnection.post("/query", {
				method: "get",
				query: { orderId },
			});
			return response;
		} catch (error) {
			console.log(error);
		}
	},
	list: async () => {
		try {
			const { data: response } = await dbConnection.post("/query", {
				method: "list",
				query: {},
			});
			return response;
		} catch (error) {
			console.log(error);
		}
	},
};

module.exports = ordersRepository;
