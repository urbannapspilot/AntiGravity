"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RfidRepo = void 0;
const urbannaps_orm_1 = require("@urbannaps/urbannaps-orm");
const datasource_1 = require("./datasource");
const error_1 = require("../util/error");
class RfidRepo {
    static async getRfidCardByRfidNumber(rfidNumber) {
        const rfid = await datasource_1.appDataSource.manager.findOne(urbannaps_orm_1.RfidCard, {
            where: {
                card_number: rfidNumber
            }
        });
        if (!rfid) {
            throw new error_1.IoTError('RFID_NOT_FOUND', `RFID Card ${rfidNumber} not found`);
        }
        return rfid;
    }
    static async isRfidAssociatedWithPod(rfidNumber, podSlug) {
        // Check if rfidNumber is associated with a pod
        const rfidAssociated = await datasource_1.appDataSource
            .createQueryBuilder(urbannaps_orm_1.RfidCard, 'rfid_card')
            .innerJoinAndSelect('rfid_card.organization', 'organization')
            .innerJoinAndSelect('organization.pods', 'pod')
            .where('rfid_card.cardNumber = :rfidNumber', { rfidNumber })
            .where('pod.slug = :podSlug', { podSlug })
            .getCount();
        return rfidAssociated > 0;
    }
    static async validateAndGetRfid(rfidNumber, podSlug) {
        const rfid = await RfidRepo.getRfidCardByRfidNumber(rfidNumber);
        const checkRfid = await RfidRepo.isRfidAssociatedWithPod(rfidNumber, podSlug);
        if (!checkRfid) {
            throw new error_1.IoTError('RFID_NOT_ASSOCIATED_WITH_POD', 'Given RFID Card is not assisiated with Pod', 403);
        }
        if (!rfid.is_active) {
            throw new error_1.IoTError('RFID_DISABLED', 'Given RFID Card is disabled', 403);
        }
        return rfid;
    }
}
exports.RfidRepo = RfidRepo;
