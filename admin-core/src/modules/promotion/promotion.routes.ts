import { FastifyInstance } from "fastify";
import { getPromotions, createPromotion } from "./promotion.controller";

export async function promotionRoutes(fastify: FastifyInstance) {
    fastify.get('/', getPromotions);
    fastify.post('/', createPromotion);
}
