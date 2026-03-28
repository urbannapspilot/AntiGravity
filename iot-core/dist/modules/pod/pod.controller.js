"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = exports.postBooking = exports.putRemote = exports.getRemote = void 0;
const crypto_1 = require("crypto");
const date_fns_1 = require("date-fns");
const urbannaps_orm_1 = require("@urbannaps/urbannaps-orm");
const error_1 = require("../../../src/util/error");
const iot_pubsub_1 = require("../../iot/iot-pubsub");
const PodRepo_1 = require("../../repo/PodRepo");
const BookingRepo_1 = require("../../repo/BookingRepo");
const PlanRepo_1 = require("../../repo/PlanRepo");
const datasource_1 = require("../../repo/datasource");
const getRemote = async (req, reply) => {
    try {
        const pod = await PodRepo_1.PodRepo.getPodById(req.params.podId);
        const remote = await (0, iot_pubsub_1.sendIotRequest)(pod, {
            requestId: (0, crypto_1.randomUUID)(),
            requestType: "GET_REMOTE",
            data: null
        });
        reply.status(200).send({ status: { success: true }, data: { remote: remote.remote } });
    }
    catch (err) {
        reply.status(200).send({ status: error_1.IoTError.getHttpErrorResponse(err) });
    }
};
exports.getRemote = getRemote;
const putRemote = async (req, reply) => {
    try {
        const pod = await PodRepo_1.PodRepo.getPodById(req.params.podId);
        const remoteAction = await (0, iot_pubsub_1.sendIotRequest)(pod, {
            requestId: (0, crypto_1.randomUUID)(),
            requestType: "PUT_ONLINE_REMOTE_ACTION",
            data: { remote: req.body, generatedAt: Math.round(Date.now() / 1000) }
        });
        reply.status(200).send({ status: { success: true }, data: { remote: remoteAction.remote } });
    }
    catch (err) {
        reply.status(200).send({ status: error_1.IoTError.getHttpErrorResponse(err) });
    }
};
exports.putRemote = putRemote;
const postBooking = async (req, reply) => {
    let booking = new urbannaps_orm_1.Booking();
    try {
        const pod = await PodRepo_1.PodRepo.getPodById(req.params.podId);
        const plan = await PlanRepo_1.PlanRepo.getPlanById(req.body.planId);
        const startTime = new Date();
        const endTime = (0, date_fns_1.addMinutes)(startTime, plan.duration);
        if (await BookingRepo_1.BookingRepo.getActiveBookingForPod(pod.id)) {
            throw new error_1.IoTError('ALREADY_ACTIVE_BOOKING', 'Pod has active booking within given time range', 409);
        }
        booking.plan_id = plan.id;
        booking.pod_id = pod.id;
        booking.booking_source = "online";
        booking.start_time = startTime;
        booking.end_time = endTime;
        booking = await datasource_1.appDataSource.manager.save(booking);
        await (0, iot_pubsub_1.sendIotRequest)(pod, {
            requestId: (0, crypto_1.randomUUID)(),
            requestType: "POST_ONLINE_BOOKING",
            data: { startTime: Math.round(startTime.getTime() / 1000), endTime: Math.round(endTime.getTime() / 1000), bookingId: booking.id }
        });
        reply.status(201).send({ status: { success: true }, data: { booking } });
    }
    catch (err) {
        if (booking.id)
            BookingRepo_1.BookingRepo.markBookingInactive(booking);
        reply.status(200).send({ status: error_1.IoTError.getHttpErrorResponse(err) });
    }
};
exports.postBooking = postBooking;
const getStatus = async (req, reply) => {
    try {
        const pod = await PodRepo_1.PodRepo.getPodById(req.params.podId);
        const status = await (0, iot_pubsub_1.sendIotRequest)(pod, {
            requestId: (0, crypto_1.randomUUID)(),
            requestType: "GET_POD_STATUS",
            data: null
        });
        reply.status(200).send({ status: { success: true }, data: { status: status.booking === false ? "online" : "unavailable" } });
    }
    catch (err) {
        if (err instanceof error_1.IoTError && err.reason === 'IOT_REQUEST_TIMEOUT') {
            reply.status(200).send({ status: { success: true }, data: { status: "offline" } });
        }
        else {
            reply.status(200).send({ status: { success: false, errorCode: err.statusCode || 500, errorMessage: err.reason || err.message } });
        }
    }
};
exports.getStatus = getStatus;
