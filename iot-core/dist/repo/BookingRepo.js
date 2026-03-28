"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepo = void 0;
const datasource_1 = require("./datasource");
const Booking_1 = require("@urbannaps/urbannaps-orm/build/entity/Booking");
const error_1 = require("../util/error");
class BookingRepo {
    static async getBookingById(bookingId) {
        const booking = await datasource_1.appDataSource.getRepository(Booking_1.Booking).findOne({
            where: {
                id: bookingId
            }
        });
        if (!booking) {
            throw new error_1.IoTError('BOOKING_NOT_FOUND', `Booking Id ${bookingId} does not exists`, 404);
        }
        return booking;
    }
    static async getActiveBookingForPod(podId) {
        const currentBooking = await datasource_1.appDataSource.getRepository(Booking_1.Booking)
            .createQueryBuilder("booking")
            .where("booking.pod_id = :podId", { podId })
            .andWhere("booking.is_active = :isActive", { isActive: true })
            .andWhere("COALESCE(booking.effactive_end_time, booking.end_time) >= NOW()")
            .getOne();
        return currentBooking;
    }
    static async markBookingCompleted(booking, endTime) {
        booking.effactive_end_time = endTime;
        booking.status = "completed";
        return datasource_1.appDataSource.manager.save(booking);
    }
    static async markBookingInactive(booking) {
        booking.is_active = false;
        await datasource_1.appDataSource.manager.save(booking);
    }
}
exports.BookingRepo = BookingRepo;
