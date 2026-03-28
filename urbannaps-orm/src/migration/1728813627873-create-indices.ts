import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIndices1728813627873 implements MigrationInterface {
    name = 'CreateIndices1728813627873';

    public async up(queryRunner: QueryRunner): Promise<void> {
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`idx_booking_order_id\` ON \`booking\`
        `);
        await queryRunner.query(`
            DROP INDEX \`idx_booking_status\` ON \`booking\`
        `);
        await queryRunner.query(`
            DROP INDEX \`idx_org_login_enabled\` ON \`organization\`
        `);
    }

}
