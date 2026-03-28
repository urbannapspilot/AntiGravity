import EventEmitter from "events";
import { mqttClient } from "./mqtt-client";
import { IoTError } from "../util/error";
import { Pod } from "@urbannaps/urbannaps-orm";
import { pendingRequestMap } from "../util/request-map";
import { BaseFormat } from "../communication/communication-types";

export function sendIotRequest<Req extends BaseFormat<any>, Res>(pod: Pod, req: Req, waitMs: number = 2000): Promise<Res> {
    return new Promise<Res>((resolve, reject) => {
        const emitter = new EventEmitter();
        const timeout = setTimeout(() => {
            emitter.emit('error', new IoTError('IOT_REQUEST_TIMEOUT', 'No Response received from pod', 408));
        }, waitMs);

        emitter.once('data', (message: Res) => {
            clearTimeout(timeout);
            emitter.removeAllListeners();
            resolve(message);
        });

        emitter.once('error', (error: IoTError) => {
            clearTimeout(timeout);
            emitter.removeAllListeners();
            reject(error);
        });

        pendingRequestMap.set(req.requestId, emitter);
        
        mqttClient.publish(`${pod.thing_name}/subscribe`, req).catch(reject);
    });
}
