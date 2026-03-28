"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetRfid = handleGetRfid;
const PodRepo_1 = require("../repo/PodRepo");
const error_1 = require("../util/error");
async function handleGetRfid(pod) {
    try {
        const rfids = await PodRepo_1.PodRepo.getRfidByThingName(pod.thing_name);
        const rfid = rfids.map(r => ({ card_number: r.card_number, card_type: r.card_type, usage_time: r.usage_time }));
        const expiresAt = Math.round((new Date().getTime() / 1000)) + (60 * 60 * 24 * 30);
        return {
            rfid, expiresAt
        };
    }
    catch (error) {
        throw error_1.IoTError.handleCatch(error);
    }
}
