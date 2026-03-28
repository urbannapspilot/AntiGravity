import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./entity/User";
import { Organization } from "./entity/Organization";
import { Feature } from "./entity/Feature";
import { Pod } from "./entity/Pod";
import { PodFeature } from "./entity/PodFeature";
import { UserOrganization } from "./entity/UserOrganization";
import { RfidCard } from "./entity/RfidCard";
import { ResetPassword } from "./entity/ResetPassword";
import { Plan } from "./entity/Plan";
import { PodPlan } from "./entity/PodPlan";
import { OrganizationType } from "./entity/OrganizationType";
import { Booking } from "./entity/Booking";
import { Session } from "./entity/Session";
import { PodType } from "./entity/PodType";
import { Feedback } from "./entity/Feedback";
import { Otp } from "./entity/Otp";
import { Payment } from "./entity/Payment";
import { WebhookResponse } from "./entity/WebhookRespinse";
import { Location } from "./entity/Location";
import { Promotion } from "./entity/Promotion";
export function getDataSource(options: DataSourceOptions): DataSource {

	const dsOptions = { ...options };

	// Disabling DB Schema synchronization for dependent apps
	dsOptions.synchronize = false;
	dsOptions.dropSchema = false;

	if (dsOptions.type === 'mysql') {
		dsOptions.supportBigNumbers = true;
		dsOptions.bigNumberStrings = false;
	}

	dsOptions.entities = [User, Organization, UserOrganization, Feature, Pod, PodFeature, RfidCard, ResetPassword
		, Plan, PodPlan, OrganizationType, Booking, Session, PodType, Feedback, Otp, Payment, WebhookResponse, Location, Promotion];

	return new DataSource(dsOptions);
}

export { DataSourceOptions, DataSource };