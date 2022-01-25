import { Kafka } from "kafkajs";

const env = {
	KAFKA_CLIENT_ID: "producer-js",
	KAFKA_BROKERS: "localhost:9092",
	KAFKA_TOPIC: "measurements",
	MESSAGE_FREQUENCY: 2000,
};

const KAFKA_CLIENT_ID = env.KAFKA_CLIENT_ID;
const KAFKA_BROKERS = env.KAFKA_BROKERS.split(",");
const KAFKA_TOPIC = env.KAFKA_TOPIC;
const MESSAGE_FREQUENCY = env.MESSAGE_FREQUENCY;

const kafka = new Kafka({
	clientId: KAFKA_CLIENT_ID,
	brokers: KAFKA_BROKERS,
});

const producer = kafka.producer();

const sleep = (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

(async () => {
	await producer.connect();
	let count = 0;

	while (true) {
		count++;

		await producer.send({
			topic: KAFKA_TOPIC,
			messages: [{ value: `Teste ${count}`, key: String(count) }],
		});

		console.log("Message sent.");

		await sleep(MESSAGE_FREQUENCY);
	}
})();
