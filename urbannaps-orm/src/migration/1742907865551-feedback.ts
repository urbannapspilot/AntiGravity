import { MigrationInterface, QueryRunner } from "typeorm";

export class Feedback1742907865551 implements MigrationInterface {
    name = 'Feedback1742907865551';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`feedback\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`booking_id\` varchar(36) NULL,
                \`product_feedback_rating\` int NULL,
                \`product_feedback_tags\` json NULL,
                \`service_feedback_rating\` int NULL,
                \`service_feedback_tags\` json NULL,
                \`feedback_text\` text NULL,
                \`images\` json NULL,
                UNIQUE INDEX \`idx_feedback_booking_id\` (\`booking_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`feedback\`
            ADD CONSTRAINT \`fk_feedback_booking_id\` FOREIGN KEY (\`booking_id\`) REFERENCES \`booking\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`feedback\` DROP FOREIGN KEY \`fk_feedback_booking_id\`
        `);
        await queryRunner.query(`
            DROP INDEX \`idx_feedback_booking_id\` ON \`feedback\`
        `);
        await queryRunner.query(`
            DROP TABLE \`feedback\`
        `);
    }

}
