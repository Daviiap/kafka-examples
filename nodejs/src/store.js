const server = require("./common/server");
const ordersRepository = require("./common/ordersRepository");
const { v4 } = require("uuid");
const kafka = require("./common/kafka");
const utils = require("./common/utils");

/**
 * Body example:
 *
 * {
 *   "productId": "1",
 *   "paymentInfos": {
 *       "method": "creditCard",
 *       "cardInfos": {
 *           "number": "4111111111111111",
 *           "cvv": "123",
 *           "holder": "Jacinto Pinto",
 *           "valid": "01/24"
 *       }
 *   },
 *   "customerInfos": {
 *       "name": "Jacinto Pinto",
 *       "email": "jacinto@email.com"
 *   }
 * }
 *
 */
server.post("/buy", async (req, res) => {
	try {
		const { body } = req;

		const paymentId = v4();

		const order = await ordersRepository.create({
			...body,
			payment: {
				method: body.paymentInfos.method,
				id: paymentId,
				status: "processing",
			},
			paymentInfos: undefined,
		});

		const kafkaProducer = kafka.producer();
		await kafkaProducer.connect();
		await kafkaProducer.send({
			topic: "buy-events",
			messages: [
				{
					value: utils.jsonStringify({
						...body.paymentInfos,
						id: paymentId,
						orderId: order.id,
					}),
				},
			],
		});
		kafkaProducer.disconnect();

		return res
			.status(200)
			.send({ status: 200, message: "Pedido feito com sucesso." });
	} catch (error) {
		return res.status(500).send({
			status: 500,
			message: "Erro ao processar pedido.",
			error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
		});
	}
});

server.get("/", async (_, res) => {
	try {
		const orders = Object.values(await ordersRepository.list());
		return res.send({ count: orders.length, orders });
	} catch (error) {
		return res.status(500).send();
	}
});

server.listen(3000, () => {
	(async () => {
		const kafkaAdmin = kafka.admin();

		await kafkaAdmin.connect();

		const topics = await kafkaAdmin.listTopics();

		if (topics.indexOf("buy-events") === -1) {
			console.log('[INFO][KAFKA] Creating "buy-events" topic.');
			await kafkaAdmin.createTopics({
				topics: [
					{
						topic: "buy-events",
						numPartitions: 2,
					},
				],
			});
			console.log('[INFO][KAFKA] "buy-events" topic created.');
		}

		if (topics.indexOf("processed-payment-events") === -1) {
			console.log('[INFO][KAFKA] Creating "processed-payment-events" topic.');
			await kafkaAdmin.createTopics({
				topics: [
					{
						topic: "processed-payment-events",
						numPartitions: 1,
					},
				],
			});
			console.log('[INFO][KAFKA] "processed-payment-events" topic created.');
		}

		await kafkaAdmin.disconnect();

		console.log("[INFO][SERVER] Store server running on port 3000.");
	})();
});
