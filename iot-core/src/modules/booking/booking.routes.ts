import { FastifyPluginAsync } from "fastify";
import { checkoutBooking } from "./booking.controller";

export const bookingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/:bookingId/checkout', checkoutBooking);
};
