const { Kafka } = require("kafkajs");
const express = require("express");
const { json } = require("express");

const jsonParse = str => {
	try {
		return JSON.parse(str);
	} catch {
		return str;
	}
};

const jsonStringify = jsonStr => {
	try {
		return JSON.stringify(jsonStr);
	} catch {
		return jsonStr;
	}
};

const kafka = new Kafka({
	clientId: "my-app",
	brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group" });

const messages = [];

const server = express();

server.use(json());

server.get("/", (req, res) => {
	return res.json(messages);
});

server.post("/", async (req, res) => {
	const messages = req.body;
	const producer = kafka.producer();
	await producer.connect();
	await producer.send({
		topic: "quickstart-events",
		messages: messages.map(message => ({
			...message,
			value: jsonStringify(message.value),
		})),
	});
	producer.disconnect();
	res.json(messages);
});

(async () => {
	await consumer.subscribe({ topic: "quickstart-events", fromBeginning: true });

	await consumer.connect();

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			messages.push(jsonParse(message.value.toString()));
			console.log(messages);
		},
	});

	server.listen(3000, () => {
		console.log("Server listening on port 3000.");
	});
})();
