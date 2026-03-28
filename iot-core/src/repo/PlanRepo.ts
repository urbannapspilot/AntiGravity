import { Plan } from "@urbannaps/urbannaps-orm";
import { appDataSource } from "./datasource";
import { IoTError } from "../util/error";

export class PlanRepo {
	public static async getPlanById(planId: string): Promise<Plan> {
		const plan = await appDataSource.getRepository(Plan).findOne({
			where: {
				id: planId
			}
		});
		if (!plan) {
			throw new IoTError('PLAN_NOT_FOUND', `Plan Id ${planId} not found`, 404);
		}
		if (!plan.is_active) {
			throw new IoTError('PLAN_DISABLED', `Plan Id ${planId} is disabled`, 403);
		}
		return plan;
	}
}