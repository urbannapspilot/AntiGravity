import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAllTables1716556730197 implements MigrationInterface {
    name = 'AddAllTables1716556730197';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`rfid_card\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`card_number\` varchar(255) NOT NULL,
                \`card_type\` varchar(255) NOT NULL,
                \`usage_time\` bigint NOT NULL,
                \`organization_id\` varchar(36) NOT NULL,
                UNIQUE INDEX \`rfid_unique_card_number\` (\`card_number\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`feature\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`slug\` varchar(255) NOT NULL,
                \`title\` varchar(255) NOT NULL,
                \`pod_type\` varchar(255) NOT NULL,
                \`description\` varchar(1023) NOT NULL,
                UNIQUE INDEX \`feature_unique_slug\` (\`slug\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`pod_feature\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`pod_id\` varchar(36) NOT NULL,
                \`feature_id\` varchar(36) NOT NULL,
                \`is_enabled\` tinyint NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`booking\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`pod_id\` varchar(36) NOT NULL,
                \`plan_id\` varchar(36) NULL,
                \`start_time\` datetime NOT NULL,
                \`end_time\` datetime NOT NULL,
                \`effactive_end_time\` date NULL,
                \`booking_source\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`plan\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`plan_name\` varchar(255) NOT NULL,
                \`description\` varchar(1023) NULL,
                \`original_amount\` bigint NOT NULL,
                \`discounted_amount\` bigint NOT NULL,
                \`duration\` bigint NOT NULL,
                \`organization_id\` varchar(36) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`pod_plan\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`pod_id\` varchar(36) NOT NULL,
                \`plan_id\` varchar(36) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`pod\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`slug\` varchar(255) NOT NULL,
                \`title\` varchar(255) NOT NULL,
                \`description\` varchar(1023) NULL,
                \`type\` varchar(255) NOT NULL,
                \`master_chip_id\` varchar(255) NOT NULL,
                \`organization_id\` varchar(36) NOT NULL,
                UNIQUE INDEX \`pod_unique_slug\` (\`slug\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`organization\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`slug\` varchar(255) NOT NULL,
                \`description\` varchar(1023) NULL,
                \`title\` varchar(1023) NULL,
                \`type\` varchar(255) NOT NULL,
                \`website\` varchar(1023) NULL,
                \`address\` varchar(1023) NOT NULL,
                \`allowed_domains\` json NOT NULL,
                \`is_payment_enabled\` tinyint NOT NULL,
                \`logo_url\` varchar(1023) NULL,
                UNIQUE INDEX \`org_unique_slug\` (\`slug\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`user_organization\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`user_id\` varchar(36) NOT NULL,
                \`organization_id\` varchar(36) NOT NULL,
                \`role\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NULL,
                \`is_default_organization\` tinyint NOT NULL DEFAULT 0,
                \`is_initial_password_changed\` tinyint NOT NULL DEFAULT 0,
                UNIQUE INDEX \`user_organization_unique_user_id_organization_id\` (\`user_id\`, \`organization_id\`),
                UNIQUE INDEX \`user_organization_unique_email\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`first_name\` varchar(255) NULL,
                \`last_name\` varchar(255) NULL,
                \`mobile\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`reset_password\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`email\` varchar(255) NOT NULL,
                \`token\` varchar(255) NOT NULL,
                \`expires_at\` datetime NOT NULL,
                \`is_attempted\` tinyint NOT NULL DEFAULT 0,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`organization_type\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`type\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`rfid_card\`
            ADD CONSTRAINT \`fk_rfid_card_organization_id\` FOREIGN KEY (\`organization_id\`) REFERENCES \`organization\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`pod_feature\`
            ADD CONSTRAINT \`fk_podfeature_pod_id\` FOREIGN KEY (\`pod_id\`) REFERENCES \`pod\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`pod_feature\`
            ADD CONSTRAINT \`fk_podfeature_feature_id\` FOREIGN KEY (\`feature_id\`) REFERENCES \`feature\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`booking\`
            ADD CONSTRAINT \`fk_booking_pod_id\` FOREIGN KEY (\`pod_id\`) REFERENCES \`pod\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`booking\`
            ADD CONSTRAINT \`fk_booking_plan_id\` FOREIGN KEY (\`plan_id\`) REFERENCES \`plan\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`plan\`
            ADD CONSTRAINT \`fk_plan_organization_id\` FOREIGN KEY (\`organization_id\`) REFERENCES \`organization\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`pod_plan\`
            ADD CONSTRAINT \`fk_podplan_pod_id\` FOREIGN KEY (\`pod_id\`) REFERENCES \`pod\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`pod_plan\`
            ADD CONSTRAINT \`fk_podplan_plan_id\` FOREIGN KEY (\`plan_id\`) REFERENCES \`plan\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`pod\`
            ADD CONSTRAINT \`fk_pod_organization_id\` FOREIGN KEY (\`organization_id\`) REFERENCES \`organization\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_organization\`
            ADD CONSTRAINT \`fk_userorganization_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_organization\`
            ADD CONSTRAINT \`fk_userorganization_organization_id\` FOREIGN KEY (\`organization_id\`) REFERENCES \`organization\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user_organization\` DROP FOREIGN KEY \`fk_userorganization_organization_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_organization\` DROP FOREIGN KEY \`fk_userorganization_user_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`pod\` DROP FOREIGN KEY \`fk_pod_organization_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`pod_plan\` DROP FOREIGN KEY \`fk_podplan_plan_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`pod_plan\` DROP FOREIGN KEY \`fk_podplan_pod_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`plan\` DROP FOREIGN KEY \`fk_plan_organization_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`booking\` DROP FOREIGN KEY \`fk_booking_plan_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`booking\` DROP FOREIGN KEY \`fk_booking_pod_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`pod_feature\` DROP FOREIGN KEY \`fk_podfeature_feature_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`pod_feature\` DROP FOREIGN KEY \`fk_podfeature_pod_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`rfid_card\` DROP FOREIGN KEY \`fk_rfid_card_organization_id\`
        `);
        await queryRunner.query(`
            DROP TABLE \`organization_type\`
        `);
        await queryRunner.query(`
            DROP TABLE \`reset_password\`
        `);
        await queryRunner.query(`
            DROP TABLE \`user\`
        `);
        await queryRunner.query(`
            DROP INDEX \`user_organization_unique_email\` ON \`user_organization\`
        `);
        await queryRunner.query(`
            DROP INDEX \`user_organization_unique_user_id_organization_id\` ON \`user_organization\`
        `);
        await queryRunner.query(`
            DROP TABLE \`user_organization\`
        `);
        await queryRunner.query(`
            DROP INDEX \`org_unique_slug\` ON \`organization\`
        `);
        await queryRunner.query(`
            DROP TABLE \`organization\`
        `);
        await queryRunner.query(`
            DROP INDEX \`pod_unique_slug\` ON \`pod\`
        `);
        await queryRunner.query(`
            DROP TABLE \`pod\`
        `);
        await queryRunner.query(`
            DROP TABLE \`pod_plan\`
        `);
        await queryRunner.query(`
            DROP TABLE \`plan\`
        `);
        await queryRunner.query(`
            DROP TABLE \`booking\`
        `);
        await queryRunner.query(`
            DROP TABLE \`pod_feature\`
        `);
        await queryRunner.query(`
            DROP INDEX \`feature_unique_slug\` ON \`feature\`
        `);
        await queryRunner.query(`
            DROP TABLE \`feature\`
        `);
        await queryRunner.query(`
            DROP INDEX \`rfid_unique_card_number\` ON \`rfid_card\`
        `);
        await queryRunner.query(`
            DROP TABLE \`rfid_card\`
        `);
    }

}
