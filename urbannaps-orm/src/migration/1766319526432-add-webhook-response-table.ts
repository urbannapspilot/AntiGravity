import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWebhookResponseTable1766319526432 implements MigrationInterface {
    name = 'AddWebhookResponseTable1766319526432';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`webhook_response\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`response\` json NOT NULL,
                \`metadata\` json NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`webhook_response\`
        `);
    }

}
