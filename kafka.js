const { Kafka } = require("kafkajs");

const jsonParse = (str) => {
    try {
        return JSON.parse(str);
    } catch {
        return str;
    }
}

(async () => {
	const kafka = new Kafka({
		clientId: "my-app",
		brokers: ["localhost:9092"],
	});

	const producer = kafka.producer();

	await producer.connect();
	await producer.send({
		topic: "quickstart-events",
		messages: [{ value: "Hello KafkaJS user!" }],
	});

	const consumer = kafka.consumer({ groupId: "test-group" });
	await consumer.connect();
	await consumer.subscribe({ topic: "quickstart-events", fromBeginning: true });

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			console.log({
                topic,
                partition,
				value: jsonParse(message.value.toString()),
			});
		},
	});
})();
