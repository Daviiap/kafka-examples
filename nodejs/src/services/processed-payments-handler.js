const kafka = require("../common/kafka");
const { jsonParse } = require("../common/utils");
const ordersRepository = require("../common/ordersRepository");

const consumer = kafka.consumer({ groupId: "processed-payment-handler" });

const startServer = async () => {
	await consumer.subscribe({
		topic: "processed-payment-events",
		fromBeginning: true,
	});

	await consumer.connect();

	await consumer.run({
		eachMessage: async ({ message }) => {
			try {
				const paymentProcessingResults = jsonParse(message.value.toString());

				const order = await ordersRepository.get(
					paymentProcessingResults.orderId
				);

				order.payment.status = paymentProcessingResults.status;

				await ordersRepository.update(paymentProcessingResults.orderId, order);

				console.log(`Order ${order.id} updated.`);
			} catch (error) {
				console.log(error);
				//TODO: Criar lógica para um caso de erro
			}
		},
	});
};

startServer();
