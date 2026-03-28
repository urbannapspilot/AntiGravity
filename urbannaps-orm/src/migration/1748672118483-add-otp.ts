import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOtp1748672118483 implements MigrationInterface {
    name = 'AddOtp1748672118483';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`otp\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`otp\` int NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`expires_at\` datetime NOT NULL,
                \`retry_counter\` int NULL,
                \`cooldown_time\` datetime NULL,
                INDEX \`idx_opt_email\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`idx_opt_email\` ON \`otp\`
        `);
        await queryRunner.query(`
            DROP TABLE \`otp\`
        `);
    }

}
