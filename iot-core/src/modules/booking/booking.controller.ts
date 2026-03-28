import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import { BookingRepo } from "../../repo/BookingRepo";
import { PodRepo } from "../../repo/PodRepo";
import { IoTError } from "../../../src/util/error";
import { sendIotRequest } from "../../iot/iot-pubsub";
import { PostResetBookingRequest, PostResetBookingRequestData } from "../../communication/communication-types";

export const checkoutBooking = async (req: FastifyRequest<{ Params: { bookingId: string } }>, reply: FastifyReply) => {
    try {
        let booking = await BookingRepo.getBookingById(req.params.bookingId);
        const pod = await PodRepo.getPodById(booking.pod_id);
        const endTime = new Date();

        await sendIotRequest<PostResetBookingRequest, null>(pod, {
            requestId: randomUUID(),
            requestType: "POST_RESET_BOOKING",
            data: { bookingId: booking.id, generatedAt: Math.round(endTime.getTime() / 1000) }
        });

        booking = await BookingRepo.markBookingCompleted(booking, endTime);
        reply.status(200).send({ status: { success: true } });
    } catch (err: any) {
        reply.status(200).send({ status: IoTError.getHttpErrorResponse(err) });
    }
};
