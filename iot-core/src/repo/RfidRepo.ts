import { RfidCard } from "@urbannaps/urbannaps-orm";
import { appDataSource } from "./datasource";
import { IoTError } from "../util/error";

export class RfidRepo {
  public static async getRfidCardByRfidNumber(rfidNumber: string): Promise<RfidCard> {

    const rfid = await appDataSource.manager.findOne(RfidCard, {
      where: {
        card_number: rfidNumber
      }
    });

    if (!rfid) {
      throw new IoTError('RFID_NOT_FOUND', `RFID Card ${rfidNumber} not found`);
    }

    return rfid;

  }

  public static async isRfidAssociatedWithPod(rfidNumber: String, podSlug: String): Promise<Boolean> {

    // Check if rfidNumber is associated with a pod
    const rfidAssociated = await appDataSource
      .createQueryBuilder(RfidCard, 'rfid_card')
      .innerJoinAndSelect('rfid_card.organization', 'organization')
      .innerJoinAndSelect('organization.pods', 'pod')
      .where('rfid_card.cardNumber = :rfidNumber', { rfidNumber })
      .where('pod.slug = :podSlug', { podSlug })
      .getCount();

    return rfidAssociated > 0;
  }

  public static async validateAndGetRfid(rfidNumber: string, podSlug: string): Promise<RfidCard> {
    const rfid = await RfidRepo.getRfidCardByRfidNumber(rfidNumber);
    const checkRfid = await RfidRepo.isRfidAssociatedWithPod(rfidNumber, podSlug);

    if (!checkRfid) {
      throw new IoTError('RFID_NOT_ASSOCIATED_WITH_POD', 'Given RFID Card is not assisiated with Pod', 403);
    }
    if (!rfid.is_active) {
      throw new IoTError('RFID_DISABLED', 'Given RFID Card is disabled', 403);
    }

    return rfid;
  }



}