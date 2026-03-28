import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEffactiveEndTimeDt1727868571926 implements MigrationInterface {
    name = 'ChangeEffactiveEndTimeDt1727868571926';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`booking\` DROP COLUMN \`effactive_end_time\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`booking\`
            ADD \`effactive_end_time\` datetime NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`booking\` DROP COLUMN \`effactive_end_time\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`booking\`
            ADD \`effactive_end_time\` date NULL
        `);
    }

}
