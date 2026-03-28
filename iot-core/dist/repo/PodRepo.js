"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodRepo = void 0;
const urbannaps_orm_1 = require("@urbannaps/urbannaps-orm");
const datasource_1 = require("./datasource");
const error_1 = require("../util/error");
class PodRepo {
    static async getFeaturesByThingName(thingName) {
        const pod = await datasource_1.appDataSource.getRepository(urbannaps_orm_1.Pod).findOne({
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
            return pod.features.reduce((p, v) => ({ ...p, [v.feature.slug]: v.is_enabled ? 1 : 0 }), {});
        }
        else {
            throw new error_1.IoTError('POD_NOT_FOUND', `Pod ${thingName} not found`);
        }
    }
    static async getRfidByThingName(thingName) {
        const podExists = await datasource_1.appDataSource.manager.exists(urbannaps_orm_1.Pod, {
            where: {
                thing_name: thingName
            }
        });
        if (!podExists) {
            throw new error_1.IoTError('POD_NOT_FOUND', `Pod ${thingName} not found`);
        }
        const rfidCards = await datasource_1.appDataSource
            .createQueryBuilder(urbannaps_orm_1.RfidCard, 'rfid_card')
            .innerJoin('rfid_card.organization', 'organization')
            .innerJoin('organization.pods', 'pod')
            .where('pod.thing_name = :thingName', { thingName })
            .getMany();
        return rfidCards;
    }
    static async getPodByThingName(thingName) {
        const pod = await datasource_1.appDataSource.getRepository(urbannaps_orm_1.Pod).findOne({
            where: {
                thing_name: thingName
            },
            cache: true
        });
        if (!pod) {
            throw new error_1.IoTError('POD_NOT_FOUND', `Pod ${thingName} not found`, 404);
        }
        return pod;
    }
    static async getPodById(podId) {
        const pod = await datasource_1.appDataSource.getRepository(urbannaps_orm_1.Pod).findOne({
            where: {
                id: podId
            },
            cache: true
        });
        if (!pod) {
            throw new error_1.IoTError('POD_NOT_FOUND', `Pod ${pod} not found`, 404);
        }
        return pod;
    }
}
exports.PodRepo = PodRepo;
