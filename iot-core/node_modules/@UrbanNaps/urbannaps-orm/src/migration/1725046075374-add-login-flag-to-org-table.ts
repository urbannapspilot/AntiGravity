// add order_id to booking table
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLoginFlagToOrgTable1725046075374 implements MigrationInterface {
    name = 'AddLoginFlagToOrgTable1725046075374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`organization\` ADD \`login_enabled\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`organization\` DROP COLUMN \`login_enabled\`
        `);
    }
}

export class AddIndexOnLoginEnabled1725046075374 implements MigrationInterface {
    name = 'AddIndexOnLoginEnabled1725046075374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX \`idx_org_login_enabled\` ON \`organization\` (\`login_enabled\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX IF EXISTS \`idx_org_login_enabled\` ON \`organization\`
        `);
    }
}
