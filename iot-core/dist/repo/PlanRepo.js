"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanRepo = void 0;
const urbannaps_orm_1 = require("@urbannaps/urbannaps-orm");
const datasource_1 = require("./datasource");
const error_1 = require("../util/error");
class PlanRepo {
    static async getPlanById(planId) {
        const plan = await datasource_1.appDataSource.getRepository(urbannaps_orm_1.Plan).findOne({
            where: {
                id: planId
            }
        });
        if (!plan) {
            throw new error_1.IoTError('PLAN_NOT_FOUND', `Plan Id ${planId} not found`, 404);
        }
        if (!plan.is_active) {
            throw new error_1.IoTError('PLAN_DISABLED', `Plan Id ${planId} is disabled`, 403);
        }
        return plan;
    }
}
exports.PlanRepo = PlanRepo;
