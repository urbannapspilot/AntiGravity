import { FastifyPluginAsync } from "fastify";
import { getDashboardMetrics } from "./dashboard.controller";

export const dashboardRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', getDashboardMetrics);
};
