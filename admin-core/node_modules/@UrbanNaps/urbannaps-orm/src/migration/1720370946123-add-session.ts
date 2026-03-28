import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSession1720370946123 implements MigrationInterface {
    name = 'AddSession1720370946123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`session\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`email\` varchar(255) NULL,
                \`metadata\` json NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`booking\`
            ADD \`session_id\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`booking\`
            ADD CONSTRAINT \`fk_booking_session_id\` FOREIGN KEY (\`session_id\`) REFERENCES \`session\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`booking\` DROP FOREIGN KEY \`fk_booking_session_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`booking\` DROP COLUMN \`session_id\`
        `);
        await queryRunner.query(`
            DROP TABLE \`session\`
        `);
    }

}
