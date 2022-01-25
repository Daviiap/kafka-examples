import { Kafka } from "kafkajs";

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;
const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(",") || [];
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || "";
const CONSUMER_GROUP_ID = process.env.CONSUMER_GROUP_ID;

const kafka = new Kafka({
	clientId: KAFKA_CLIENT_ID,
	brokers: KAFKA_BROKERS,
});

const consumer = kafka.consumer({ groupId: "my-group" });

(async () => {
	await consumer.connect();

	await consumer.subscribe({ topic: KAFKA_TOPIC });

	await consumer.run({
		eachMessage: async ({ message }) => {
			console.log({ value: message.value?.toString() });
		},
	});
})();
