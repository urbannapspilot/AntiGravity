"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutBooking = void 0;
const crypto_1 = require("crypto");
const BookingRepo_1 = require("../../repo/BookingRepo");
const PodRepo_1 = require("../../repo/PodRepo");
const error_1 = require("../../../src/util/error");
const iot_pubsub_1 = require("../../iot/iot-pubsub");
const checkoutBooking = async (req, reply) => {
    try {
        let booking = await BookingRepo_1.BookingRepo.getBookingById(req.params.bookingId);
        const pod = await PodRepo_1.PodRepo.getPodById(booking.pod_id);
        const endTime = new Date();
        await (0, iot_pubsub_1.sendIotRequest)(pod, {
            requestId: (0, crypto_1.randomUUID)(),
            requestType: "POST_RESET_BOOKING",
            data: { bookingId: booking.id, generatedAt: Math.round(endTime.getTime() / 1000) }
        });
        booking = await BookingRepo_1.BookingRepo.markBookingCompleted(booking, endTime);
        reply.status(200).send({ status: { success: true } });
    }
    catch (err) {
        reply.status(200).send({ status: error_1.IoTError.getHttpErrorResponse(err) });
    }
};
exports.checkoutBooking = checkoutBooking;
