const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
	clientId: "my-app",
	brokers: ["kafka:9092"],
	logLevel: logLevel.ERROR
});

module.exports = kafka;
