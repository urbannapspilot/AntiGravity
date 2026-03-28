import { FastifyInstance } from "fastify";
import { getSessionState, getClientHistory } from "./session.controller";

export async function sessionRoutes(fastify: FastifyInstance) {
    fastify.get('/', getSessionState);
    fastify.get('/client/:id', getClientHistory);
}
