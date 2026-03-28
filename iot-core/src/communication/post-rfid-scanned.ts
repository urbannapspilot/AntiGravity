
import { IoTError } from "../util/error";
import { PostRfidScannedRequest, PostRfidScannedRequestData } from "./communication-types";
import { RfidRepo } from "../repo/RfidRepo";
import { addSeconds } from "date-fns";
import { Booking, Pod, Session } from "@urbannaps/urbannaps-orm";
import { BookingRepo } from "../repo/BookingRepo";
import { appDataSource } from "../repo/datasource";


export async function handlePostRfidScanned(pod: Pod, request: PostRfidScannedRequest) {
  let booking = new Booking();
  try {
    const rfidNumber = (request.data as PostRfidScannedRequestData).rfidNumber;
    const rfid = await RfidRepo.validateAndGetRfid(rfidNumber, pod.thing_name);
    switch (rfid.card_type) {
      case 'BOOKING':
        const startTime = new Date();
        const endTime = addSeconds(startTime, rfid.usage_time);

        // Check if there is existing booking for pod
        const currentBooking = await BookingRepo.getActiveBookingForPod(pod.id);
        if (currentBooking) {
          throw new IoTError('ALREADY_ACTIVE_BOOKING', 'Pod has active booking', 409);
        }

        const session = new Session();
        session.metadata = {
          requestId: request.requestId
        };

        appDataSource.manager.save(session);

        booking.pod_id = pod.id;
        booking.booking_source = "rfid";
        booking.start_time = startTime;
        booking.end_time = endTime;
        booking.rfid = rfid;
        booking.session = session;

        booking = await appDataSource.manager.save(booking);
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
      BookingRepo.markBookingInactive(booking);
    }
    const err = IoTError.handleCatch(error);
    return {
      status: 0,
      reson: err.reason
    };
  }

}

