import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPodType1729924400441 implements MigrationInterface {
    name = 'AddPodType1729924400441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`pod_type\` (
                \`id\` varchar(36) NOT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`type\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`pod_type\`
        `);
    }

}
