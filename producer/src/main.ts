import { Kafka } from "kafkajs";

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;
const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(",") || [];
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || "";
const MESSAGE_FREQUENCY = Number(process.env.MESSAGE_FREQUENCY);

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
			messages: [{ value: `Teste ${count}` }],
		});

		console.log("Message sent.");

		await sleep(MESSAGE_FREQUENCY);
	}
})();
