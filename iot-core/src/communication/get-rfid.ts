import { Pod } from "@urbannaps/urbannaps-orm";
import { PodRepo } from "../repo/PodRepo";
import { IoTError } from "../util/error";
import { GetRfidResponseData } from "./communication-types";

export async function handleGetRfid(pod: Pod): Promise<GetRfidResponseData> {
  try {
    const rfids = await PodRepo.getRfidByThingName(pod.thing_name);
    const rfid = rfids.map(r => ({ card_number: r.card_number, card_type: r.card_type, usage_time: r.usage_time }));
    const expiresAt = Math.round((new Date().getTime() / 1000)) + (60 * 60 * 24 * 30);

    return {
      rfid, expiresAt
    };
  }
  catch (error) {
    throw IoTError.handleCatch(error);
  }

}
