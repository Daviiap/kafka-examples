const kafka = require("../common/kafka");
const { jsonParse, jsonStringify } = require("../common/utils");

const consumer = kafka.consumer({ groupId: "acquirers" });

const processPayment = async paymentInfos => {
	const magicNumber = Math.floor(Math.random() * 10) + 1;

	await new Promise(r => setTimeout(r, Math.floor(Math.random() * 1000) + 1));

	let processingResult;

	if (magicNumber < 3) {
		processingResult = "fail";
	} else {
		processingResult = "success";
	}

	return {
		status: processingResult,
	};
};

const startServer = async () => {
	await consumer.subscribe({ topic: "buy-events", fromBeginning: true });

	await consumer.connect();

	const kafkaProducer = kafka.producer();
	await kafkaProducer.connect();

	await consumer.run({
		eachMessage: async ({ message }) => {
			try {
				const paymentInfos = jsonParse(message.value.toString());
				const paymentProcessingResult = await processPayment(paymentInfos);

				console.log("[INFO][ACQUIRER] Payment processed.");

				await kafkaProducer.send({
					topic: "processed-payment-events",
					messages: [
						{
							value: jsonStringify({
								orderId: paymentInfos.orderId,
								status: paymentProcessingResult.status,
							}),
						},
					],
				});
			} catch (error) {
				console.log(error);
				//TODO: Criar lógica para um caso de erro
			}
		},
	});
};

startServer();
