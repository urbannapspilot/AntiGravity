"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.podRoutes = void 0;
const pod_controller_1 = require("./pod.controller");
const podRoutes = async (fastify) => {
    fastify.get('/:podId/remote', pod_controller_1.getRemote);
    fastify.put('/:podId/remote', pod_controller_1.putRemote);
    fastify.post('/:podId/booking', pod_controller_1.postBooking);
    fastify.get('/:podId/status', pod_controller_1.getStatus);
};
exports.podRoutes = podRoutes;
