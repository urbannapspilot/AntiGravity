import Fastify from "fastify";
import cors from "@fastify/cors";
import { appDataSource } from "./repo/datasource";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { organizationRoutes } from "./modules/organization/organization.routes";
import { podRoutes } from "./modules/pod/pod.routes";
import { locationRoutes } from "./modules/location/location.routes";
import { promotionRoutes } from "./modules/promotion/promotion.routes";
import { sessionRoutes } from "./modules/session/session.routes";

const app = Fastify({ logger: true });

const killPort = async (port: number) => {
    if (process.platform === 'win32') {
        const { execSync } = require('child_process');
        try {
            const stdout = execSync(`netstat -ano | findstr :${port}`).toString();
            const lines = stdout.split('\n');
            const pids = new Set<string>();
            lines.forEach((line: string) => {
                const parts = line.trim().split(/\s+/);
                const pid = parts[parts.length - 1];
                if (pid && pid !== '0' && !isNaN(Number(pid))) {
                    pids.add(pid);
                }
            });
            pids.forEach((pid: string) => {
                try {
                    execSync(`taskkill /F /PID ${pid}`);
                    console.log(`[Port Fix] Terminated PID ${pid} holding port ${port}`);
                } catch (e) {}
            });
        } catch (e) {
            // No process found or already cleared
        }
    }
};

app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
});

app.get('/health', async () => ({ status: 'admin-core active' }));

app.register(dashboardRoutes, { prefix: '/api/admin/dashboard' });
app.register(organizationRoutes, { prefix: '/api/admin/organizations' });
app.register(podRoutes, { prefix: '/api/admin/pods' });
app.register(locationRoutes, { prefix: '/api/admin/locations' });
app.register(promotionRoutes, { prefix: '/api/admin/promotions' });
app.register(sessionRoutes, { prefix: '/api/admin/sessions' });

const start = async () => {
    try {
        const PORT = Number(process.env.ADMIN_PORT) || 3001;
        await killPort(PORT);
        
        await appDataSource.initialize();
        app.log.info("Admin Database Connected ✅");
        await app.listen({ port: PORT, host: '0.0.0.0' });
        app.log.info(app.printRoutes());
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

// Graceful shutdown — always close DB connection on exit
const shutdown = async (signal: string) => {
    app.log.info(`[Shutdown] Received ${signal}. Closing server...`);
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
