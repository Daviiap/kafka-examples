const express = require("express");
const { json } = require("express");
const { v4 } = require("uuid");
const server = express();

server.use(json());

const orders = {};

const methods = {
	create: query => {
		const { data } = query;
		const id = v4();
		const order = { ...data, id };
		orders[id] = order;
		return order;
	},
	update: query => {
		const { orderId, data } = query;
		let order = orders[orderId];
		if (order) {
			orders[orderId] = { ...orders[orderId], ...data };
			return order;
		} else {
			return null;
		}
	},
	delete: query => {
		const { orderId } = query;
		delete orders[orderId];
	},
	get: query => {
		const { orderId } = query;
		return orders[orderId];
	},
	list: () => {
		return orders;
	},
};

server.post("/query", (req, res) => {
	try {
		const { method, query } = req.body;
		console.log("query", method);
		return res.status(200).send(methods[method](query));
	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
});

server.listen(9000, () => {
	console.log("Database running on port 9000.");
});
