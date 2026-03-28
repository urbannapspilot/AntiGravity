import { mqttClient } from "./mqtt-client";
import { BaseFormat, GetFeaturesResponse, GetPodStatusResponse, GetRemoteResponse, PostRfidScannedRequest } from "../communication/communication-types";
import { toUtf8 } from "@aws-sdk/util-utf8-browser";
import { IoTError } from "../../src/util/error";
import { PodRepo } from "../repo/PodRepo";
import { pendingRequestMap } from "../util/request-map";
import { handleGetFeatures } from "../communication/get-features";
import { handleGetRfid } from "../communication/get-rfid";
import { handlePostRfidScanned } from "../communication/post-rfid-scanned";
import { handlePostVacantSeat } from "../communication/post-vacant-seat";

export const registerIotMessageHandler = () => {
    mqttClient.addEventListener(async (topic: string, payload: ArrayBuffer) => {
        const thingName = topic.split('/')[0];
        let data: BaseFormat<any>;
        try {
            data = JSON.parse(toUtf8(new Uint8Array(payload)));
        } catch (e) {
            console.error("Failed to parse incoming MVP payload", e);
            return;
        }

        let responseData: any = undefined;
        let toPublish = false; // MUST default to false to not spam pods with empty responses!

        try {
            const pod = await PodRepo.getPodByThingName(thingName);

            switch (data.requestType) {
                case "GET_FEATURES":
                    responseData = await handleGetFeatures(pod);
                    toPublish = true;
                    break;
                case "GET_RFID_LIST":
                    responseData = await handleGetRfid(pod);
                    toPublish = true;
                    break;
                case "GET_REMOTE":
                case "PUT_ONLINE_REMOTE_ACTION":
                    toPublish = false;
                    pendingRequestMap.get(data.requestId)?.emit('data', (data as GetRemoteResponse).data);
                    break;
                case "POST_RFID_SCANNED":
                    responseData = await handlePostRfidScanned(pod, data as PostRfidScannedRequest);
                    toPublish = true;
                    break;
                case "POST_ONLINE_BOOKING":
                case "POST_RESET_BOOKING":
                    toPublish = false;
                    pendingRequestMap.get(data.requestId)?.emit('data', "");
                    break;
                case "POST_VACANT_SEAT":
                    await handlePostVacantSeat(pod);
                    responseData = null;
                    break;
                case "GET_POD_STATUS":
                    toPublish = false;
                    pendingRequestMap.get(data.requestId)?.emit('data', (data as GetPodStatusResponse).data);
                    break;
            }
        } catch (error) {
            if (error instanceof IoTError) {
                responseData = error;
                toPublish = error.reason !== 'POD_NOT_FOUND';
            } else {
                responseData = { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred', statusCode: 500 };
            }
        }

        if (toPublish) {
            const response: GetFeaturesResponse = { requestId: data.requestId, requestType: data.requestType, data: responseData };
            await mqttClient.publish(`${thingName}/subscribe`, response)
                .then(puback => console.log(`[MQTT] Published to ${thingName}/subscribe`))
                .catch(e => console.error("[MQTT] Publish failed", e));
        }
    });
};
