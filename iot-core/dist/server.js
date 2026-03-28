"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const datasource_1 = require("./repo/datasource");
const pod_routes_1 = require("./modules/pod/pod.routes");
const booking_routes_1 = require("./modules/booking/booking.routes");
const mqtt_client_1 = require("./iot/mqtt-client");
const iot_handler_1 = require("./iot/iot-handler");
const app = (0, fastify_1.default)({ logger: true });
app.register(pod_routes_1.podRoutes, { prefix: '/pod' });
app.register(booking_routes_1.bookingRoutes, { prefix: '/booking' });
app.get('/health', async () => ({ status: 'ok' }));
const start = async () => {
    try {
        await datasource_1.appDataSource.initialize();
        app.log.info("Database Connected");
        mqtt_client_1.mqttClient.start();
        const suback = await mqtt_client_1.mqttClient.addSubscription("+/publish");
        app.log.info(`Subscribed to +/publish: ${JSON.stringify(suback)}`);
        (0, iot_handler_1.registerIotMessageHandler)();
        await app.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
        app.log.info(app.printRoutes());
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
