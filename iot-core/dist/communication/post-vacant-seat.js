"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePostVacantSeat = handlePostVacantSeat;
const BookingRepo_1 = require("../repo/BookingRepo");
const error_1 = require("../util/error");
async function handlePostVacantSeat(pod) {
    const currentBooking = await BookingRepo_1.BookingRepo.getActiveBookingForPod(pod.id);
    try {
        if (currentBooking) {
            await BookingRepo_1.BookingRepo.markBookingCompleted(currentBooking, new Date());
        }
    }
    catch (error) {
        throw error_1.IoTError.handleCatch(error);
    }
}
