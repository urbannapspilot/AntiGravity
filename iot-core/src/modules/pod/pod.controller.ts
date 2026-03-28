import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import { addMinutes } from "date-fns";
import { Booking } from "@urbannaps/urbannaps-orm";
import { IoTError } from "../../../src/util/error";
import { sendIotRequest } from "../../iot/iot-pubsub";
import { PodRepo } from "../../repo/PodRepo";
import { BookingRepo } from "../../repo/BookingRepo";
import { PlanRepo } from "../../repo/PlanRepo";
import { appDataSource } from "../../repo/datasource";
import { 
    GetRemoteRequest, 
    GetRemoteData, 
    PutOnlineRemoteActionRequest, 
    PutOnlineRemoteActionResponseData, 
    PostOnlineBookingRequest, 
    GetPodStatusRequest, 
    GetPodStatusResponseData 
} from "../../communication/communication-types";

export const getRemote = async (req: FastifyRequest<{ Params: { podId: string } }>, reply: FastifyReply) => {
    try {
        const pod = await PodRepo.getPodById(req.params.podId);
        const remote = await sendIotRequest<GetRemoteRequest, GetRemoteData>(pod, {
            requestId: randomUUID(),
            requestType: "GET_REMOTE",
            data: null
        });
        reply.status(200).send({ status: { success: true }, data: { remote: remote.remote } });
    } catch (err: any) {
        reply.status(200).send({ status: IoTError.getHttpErrorResponse(err) });
    }
};

export const putRemote = async (req: FastifyRequest<{ Params: { podId: string }, Body: { fan?: number; music?: number; massage?: number; light?: number; oxygen?: number; heat?: number; door?: number; seat?: number; } }>, reply: FastifyReply) => {
    try {
        const pod = await PodRepo.getPodById(req.params.podId);
        const remoteAction = await sendIotRequest<PutOnlineRemoteActionRequest, PutOnlineRemoteActionResponseData>(pod, {
            requestId: randomUUID(),
            requestType: "PUT_ONLINE_REMOTE_ACTION",
            data: { remote: req.body, generatedAt: Math.round(Date.now() / 1000) }
        });
        reply.status(200).send({ status: { success: true }, data: { remote: remoteAction.remote } });
    } catch (err: any) {
        reply.status(200).send({ status: IoTError.getHttpErrorResponse(err) });
    }
};

export const postBooking = async (req: FastifyRequest<{ Params: { podId: string }, Body: { planId: string } }>, reply: FastifyReply) => {
    let booking = new Booking();
    try {
        const pod = await PodRepo.getPodById(req.params.podId);
        const plan = await PlanRepo.getPlanById(req.body.planId);
        
        const startTime = new Date();
        const endTime = addMinutes(startTime, plan.duration);

        if (await BookingRepo.getActiveBookingForPod(pod.id)) {
            throw new IoTError('ALREADY_ACTIVE_BOOKING', 'Pod has active booking within given time range', 409);
        }

        booking.plan_id = plan.id;
        booking.pod_id = pod.id;
        booking.booking_source = "online";
        booking.start_time = startTime;
        booking.end_time = endTime;
        booking = await appDataSource.manager.save(booking);

        await sendIotRequest<PostOnlineBookingRequest, null>(pod, {
            requestId: randomUUID(),
            requestType: "POST_ONLINE_BOOKING",
            data: { startTime: Math.round(startTime.getTime() / 1000), endTime: Math.round(endTime.getTime() / 1000), bookingId: booking.id }
        });

        reply.status(201).send({ status: { success: true }, data: { booking } });
    } catch (err: any) {
        if (booking.id) BookingRepo.markBookingInactive(booking);
        reply.status(200).send({ status: IoTError.getHttpErrorResponse(err) });
    }
};

export const getStatus = async (req: FastifyRequest<{ Params: { podId: string } }>, reply: FastifyReply) => {
    try {
        const pod = await PodRepo.getPodById(req.params.podId);
        const status = await sendIotRequest<GetPodStatusRequest, GetPodStatusResponseData>(pod, {
            requestId: randomUUID(),
            requestType: "GET_POD_STATUS",
            data: null
        });
        reply.status(200).send({ status: { success: true }, data: { status: status.booking === false ? "online" : "unavailable" } });
    } catch (err: any) {
        if (err instanceof IoTError && err.reason === 'IOT_REQUEST_TIMEOUT') {
            reply.status(200).send({ status: { success: true }, data: { status: "offline" } });
        } else {
            reply.status(200).send({ status: { success: false, errorCode: err.statusCode || 500, errorMessage: err.reason || err.message } });
        }
    }
};
