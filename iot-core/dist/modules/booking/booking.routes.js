"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const booking_controller_1 = require("./booking.controller");
const bookingRoutes = async (fastify) => {
    fastify.post('/:bookingId/checkout', booking_controller_1.checkoutBooking);
};
exports.bookingRoutes = bookingRoutes;
