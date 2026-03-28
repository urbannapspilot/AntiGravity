import { Pod } from "@urbannaps/urbannaps-orm";
import { PodRepo } from "../repo/PodRepo";
import { IoTError } from "../util/error";
import { GetFeaturesResponseData } from "./communication-types";

export async function handleGetFeatures(pod: Pod): Promise<GetFeaturesResponseData> {
  try {
    const features = await PodRepo.getFeaturesByThingName(pod.thing_name);
    const expiresAt = Math.round((new Date().getTime() / 1000)) + (60 * 60 * 24);

    return {
      features, expiresAt
    };
  }
  catch (error) {
    throw IoTError.handleCatch(error);
  }
}