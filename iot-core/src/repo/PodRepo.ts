import { Pod, RfidCard } from "@urbannaps/urbannaps-orm";
import { appDataSource } from "./datasource";
import { Remote } from "../communication/communication-types";
import { IoTError } from "../util/error";


export class PodRepo {

  public static async getFeaturesByThingName(thingName: string): Promise<Remote> {
    const pod = await appDataSource.getRepository(Pod).findOne({
      where: {
        thing_name: thingName
      },
      relations: {
        features: {
          feature: true
        }
      }
    });
    if (pod) {
      return pod.features.reduce((p: any, v) => ({ ...p, [v.feature.slug]: v.is_enabled ? 1 : 0 }), {});
    }
    else {
      throw new IoTError('POD_NOT_FOUND', `Pod ${thingName} not found`);
    }
  }

  public static async getRfidByThingName(thingName: string): Promise<RfidCard[]> {
    const podExists = await appDataSource.manager.exists(Pod, {
      where: {
        thing_name: thingName
      }
    });

    if (!podExists) {
      throw new IoTError('POD_NOT_FOUND', `Pod ${thingName} not found`);
    }

    const rfidCards = await appDataSource
      .createQueryBuilder(RfidCard, 'rfid_card')
      .innerJoin('rfid_card.organization', 'organization')
      .innerJoin('organization.pods', 'pod')
      .where('pod.thing_name = :thingName', { thingName })
      .getMany();

    return rfidCards;
  }

  public static async getPodByThingName(thingName: string): Promise<Pod> {
    const pod = await appDataSource.getRepository(Pod).findOne({
      where: {
        thing_name: thingName
      },
      cache: true
    });
    if (!pod) {
      throw new IoTError('POD_NOT_FOUND', `Pod ${thingName} not found`, 404);
    }

    return pod;
  }

  public static async getPodById(podId: string): Promise<Pod> {
    const pod = await appDataSource.getRepository(Pod).findOne({
      where: {
        id: podId
      },
      cache: true
    });
    if (!pod) {
      throw new IoTError('POD_NOT_FOUND', `Pod ${pod} not found`, 404);
    }
    return pod;
  }

}