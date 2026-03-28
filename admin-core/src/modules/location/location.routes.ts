import { FastifyInstance } from "fastify";
import { getLocations, createLocation } from "./location.controller";

export async function locationRoutes(fastify: FastifyInstance) {
    fastify.get('/', getLocations);
    fastify.post('/', createLocation);
}
