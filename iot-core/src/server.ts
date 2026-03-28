import Fastify from "fastify";
import { appDataSource } from "./repo/datasource";
import { podRoutes } from "./modules/pod/pod.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";
import { mqttClient } from "./iot/mqtt-client";
import { registerIotMessageHandler } from "./iot/iot-handler";

const app = Fastify({ logger: true });

app.register(podRoutes, { prefix: '/pod' });
app.register(bookingRoutes, { prefix: '/booking' });

app.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
    try {
        await appDataSource.initialize();
        app.log.info("Database Connected ✅");

        mqttClient.start();
        const suback = await mqttClient.addSubscription("+/publish");
        app.log.info(`Subscribed to +/publish: ${JSON.stringify(suback)}`);
        
        registerIotMessageHandler();

        await app.listen({ port: Number(process.env.IOT_PORT) || 3000, host: '0.0.0.0' });
        app.log.info(app.printRoutes());
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

// Graceful shutdown — always close DB connection on exit
const shutdown = async (signal: string) => {
    app.log.info(`[Shutdown] Received ${signal}. Closing iot-core...`);
    mqttClient.stop?.();
    await app.close();
    if (appDataSource.isInitialized) {
        await appDataSource.destroy();
        app.log.info("[Shutdown] Database connection closed ✅");
    }
    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
