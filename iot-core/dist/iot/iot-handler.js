"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIotMessageHandler = void 0;
const mqtt_client_1 = require("./mqtt-client");
const util_utf8_browser_1 = require("@aws-sdk/util-utf8-browser");
const error_1 = require("../../src/util/error");
const PodRepo_1 = require("../repo/PodRepo");
const request_map_1 = require("../util/request-map");
const get_features_1 = require("../communication/get-features");
const get_rfid_1 = require("../communication/get-rfid");
const post_rfid_scanned_1 = require("../communication/post-rfid-scanned");
const post_vacant_seat_1 = require("../communication/post-vacant-seat");
const registerIotMessageHandler = () => {
    mqtt_client_1.mqttClient.addEventListener(async (topic, payload) => {
        const thingName = topic.split('/')[0];
        let data;
        try {
            data = JSON.parse((0, util_utf8_browser_1.toUtf8)(new Uint8Array(payload)));
        }
        catch (e) {
            console.error("Failed to parse incoming MVP payload", e);
            return;
        }
        let responseData = undefined;
        let toPublish = true;
        try {
            const pod = await PodRepo_1.PodRepo.getPodByThingName(thingName);
            switch (data.requestType) {
                case "GET_FEATURES":
                    responseData = await (0, get_features_1.handleGetFeatures)(pod);
                    break;
                case "GET_RFID_LIST":
                    responseData = await (0, get_rfid_1.handleGetRfid)(pod);
                    break;
                case "GET_REMOTE":
                case "PUT_ONLINE_REMOTE_ACTION":
                    toPublish = false;
                    request_map_1.pendingRequestMap.get(data.requestId)?.emit('data', data.data);
                    break;
                case "POST_RFID_SCANNED":
                    responseData = await (0, post_rfid_scanned_1.handlePostRfidScanned)(pod, data);
                    break;
                case "POST_ONLINE_BOOKING":
                case "POST_RESET_BOOKING":
                    toPublish = false;
                    request_map_1.pendingRequestMap.get(data.requestId)?.emit('data', "");
                    break;
                case "POST_VACANT_SEAT":
                    await (0, post_vacant_seat_1.handlePostVacantSeat)(pod);
                    responseData = null;
                    break;
                case "GET_POD_STATUS":
                    toPublish = false;
                    request_map_1.pendingRequestMap.get(data.requestId)?.emit('data', data.data);
                    break;
            }
        }
        catch (error) {
            if (error instanceof error_1.IoTError) {
                responseData = error;
                toPublish = error.reason !== 'POD_NOT_FOUND';
            }
            else {
                responseData = { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred', statusCode: 500 };
            }
        }
        if (toPublish) {
            const response = { requestId: data.requestId, requestType: data.requestType, data: responseData };
            await mqtt_client_1.mqttClient.publish(`${thingName}/subscribe`, response)
                .then(puback => console.log(`[MQTT] Published to ${thingName}/subscribe`))
                .catch(e => console.error("[MQTT] Publish failed", e));
        }
    });
};
exports.registerIotMessageHandler = registerIotMessageHandler;
