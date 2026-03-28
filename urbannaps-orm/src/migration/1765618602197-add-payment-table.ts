import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentTable1765618602197 implements MigrationInterface {
    name = 'AddPaymentTable1765618602197';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`payment\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`booking_id\` varchar(36) NOT NULL,
                \`payment_gateway\` varchar(255) NOT NULL,
                \`payment_request\` json NULL,
                \`payment_response\` json NULL,
                \`metadata\` json NULL,
                UNIQUE INDEX \`idx_payment_booking_id\` (\`booking_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment\`
            ADD CONSTRAINT \`fk_payment_booking_id\` FOREIGN KEY (\`booking_id\`) REFERENCES \`booking\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`payment\` DROP FOREIGN KEY \`fk_payment_booking_id\`
        `);
        await queryRunner.query(`
            DROP INDEX \`idx_payment_booking_id\` ON \`payment\`
        `);
        await queryRunner.query(`
            DROP TABLE \`payment\`
        `);
    }

}
