"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetFeatures = handleGetFeatures;
const PodRepo_1 = require("../repo/PodRepo");
const error_1 = require("../util/error");
async function handleGetFeatures(pod) {
    try {
        const features = await PodRepo_1.PodRepo.getFeaturesByThingName(pod.thing_name);
        const expiresAt = Math.round((new Date().getTime() / 1000)) + (60 * 60 * 24);
        return {
            features, expiresAt
        };
    }
    catch (error) {
        throw error_1.IoTError.handleCatch(error);
    }
}
