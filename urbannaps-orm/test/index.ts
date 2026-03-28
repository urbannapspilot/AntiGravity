
import { config } from 'dotenv';
import { Feature, Organization, Pod, PodFeature, User } from "../src";
import { getDataSource } from "../src";


config();

const appDataSource = getDataSource({
	type: "mysql",
	host: process.env.RDS_HOST,
	port: 3306,
	username: process.env.RDS_USERNAME,
	password: process.env.RDS_PASSWORD,
	database: process.env.RDS_DATABASE,
});

appDataSource.initialize().then(async () => {

	console.log("Inserting a new user into the database...");
	const user = new User().build({
		first_name: "Timber",
		last_name: "Saw",
		mobile: "1234567890",
	});
	await appDataSource.manager.save(user);
	console.log("Saved a new user with id: " + user.id);


	console.log("Loading users from the database...");
	const users = await appDataSource.manager.find(User);
	console.log("Loaded users: ", users);

	const feature = new Feature().build({
		slug: 'O2',
		description: 'Oxygen Therapy',
		title: 'O2 Therapy',
		pod_type: 'NapPod',
	});
	await appDataSource.manager.save(feature);

	const organization = new Organization().build({
		slug: "TEST_ORG_01",
		title: "TEST ORG 1",
		description: "This is the test organization",
		type: "NapPod",
		address: "Test Address",
		allowed_domains: ["test.com"],
		is_payment_enabled: true,
	});
	
	await appDataSource.manager.save(organization);


	const podFeature = new PodFeature().build({
		pod_id: "1",
		feature_id: "1",
		is_enabled: false,
		is_active: true,
	});


	const pod = new Pod().build({
		slug: "TEST_POD_01",
		description: "This is the test Pod",
		title: "TEST POD 1",
		type: "NapPod",
		master_chip_id: "AA:BB:CC:DD",
		organization_id: organization.id,
		is_active: true,
	});

	await appDataSource.manager.save(pod);

	const pods = await appDataSource.manager.find(Pod, {
		relations: {
			features: {
				feature: true
			}
		}
	});

	console.log("Loaded Pods: ", pods);


	console.log("Here you can setup and run express / fastify / any other framework.");

	process.exit(0);
}).catch(error => {
	console.log(error);
	process.exit(1);
});
