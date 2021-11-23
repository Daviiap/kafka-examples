const { Kafka } = require("kafkajs");

const kafka = new Kafka({
	clientId: "my-app",
	brokers: ["localhost:9092"],
});

module.exports = kafka;
