import { FastifyPluginAsync } from "fastify";
import { getRemote, postBooking, getStatus, putRemote } from "./pod.controller";

export const podRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/:podId/remote', getRemote);
  fastify.put('/:podId/remote', putRemote);
  fastify.post('/:podId/booking', postBooking);
  fastify.get('/:podId/status', getStatus);
};
