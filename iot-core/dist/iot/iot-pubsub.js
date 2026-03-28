"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendIotRequest = sendIotRequest;
const events_1 = __importDefault(require("events"));
const mqtt_client_1 = require("./mqtt-client");
const error_1 = require("../util/error");
const request_map_1 = require("../util/request-map");
function sendIotRequest(pod, req, waitMs = 2000) {
    return new Promise((resolve, reject) => {
        const emitter = new events_1.default();
        const timeout = setTimeout(() => {
            emitter.emit('error', new error_1.IoTError('IOT_REQUEST_TIMEOUT', 'No Response received from pod', 408));
        }, waitMs);
        emitter.once('data', (message) => {
            clearTimeout(timeout);
            emitter.removeAllListeners();
            resolve(message);
        });
        emitter.once('error', (error) => {
            clearTimeout(timeout);
            emitter.removeAllListeners();
            reject(error);
        });
        request_map_1.pendingRequestMap.set(req.requestId, emitter);
        mqtt_client_1.mqttClient.publish(`${pod.thing_name}/subscribe`, req).catch(reject);
    });
}
