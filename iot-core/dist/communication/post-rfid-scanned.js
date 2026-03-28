"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePostRfidScanned = handlePostRfidScanned;
const error_1 = require("../util/error");
const RfidRepo_1 = require("../repo/RfidRepo");
const date_fns_1 = require("date-fns");
const urbannaps_orm_1 = require("@urbannaps/urbannaps-orm");
const BookingRepo_1 = require("../repo/BookingRepo");
const datasource_1 = require("../repo/datasource");
async function handlePostRfidScanned(pod, request) {
    let booking = new urbannaps_orm_1.Booking();
    try {
        const rfidNumber = request.data.rfidNumber;
        const rfid = await RfidRepo_1.RfidRepo.validateAndGetRfid(rfidNumber, pod.thing_name);
        switch (rfid.card_type) {
            case 'BOOKING':
                const startTime = new Date();
                const endTime = (0, date_fns_1.addSeconds)(startTime, rfid.usage_time);
                // Check if there is existing booking for pod
                const currentBooking = await BookingRepo_1.BookingRepo.getActiveBookingForPod(pod.id);
                if (currentBooking) {
                    throw new error_1.IoTError('ALREADY_ACTIVE_BOOKING', 'Pod has active booking', 409);
                }
                const session = new urbannaps_orm_1.Session();
                session.metadata = {
                    requestId: request.requestId
                };
                datasource_1.appDataSource.manager.save(session);
                booking.pod_id = pod.id;
                booking.booking_source = "rfid";
                booking.start_time = startTime;
                booking.end_time = endTime;
                booking.rfid = rfid;
                booking.session = session;
                booking = await datasource_1.appDataSource.manager.save(booking);
                return {
                    status: 1,
                    reason: 'VALID_BOOKING',
                    bookingId: booking.id,
                    startTime: Math.round(startTime.getTime() / 1000),
                    endTime: Math.round(endTime.getTime() / 1000)
                };
        }
    }
    catch (error) {
        if (booking.id) {
            BookingRepo_1.BookingRepo.markBookingInactive(booking);
        }
        const err = error_1.IoTError.handleCatch(error);
        return {
            status: 0,
            reson: err.reason
        };
    }
}
