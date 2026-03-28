import { MigrationInterface, QueryRunner } from "typeorm";

export class MasterChipIdNullable1718109102981 implements MigrationInterface {
    name = 'MasterChipIdNullable1718109102981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`pod\` CHANGE \`master_chip_id\` \`master_chip_id\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`pod\` CHANGE \`master_chip_id\` \`master_chip_id\` varchar(255) NOT NULL
        `);
    }

}
