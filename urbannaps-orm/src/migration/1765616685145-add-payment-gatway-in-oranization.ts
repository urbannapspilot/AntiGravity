import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentGatwayInOranization1765616685145 implements MigrationInterface {
    name = 'AddPaymentGatwayInOranization1765616685145';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`organization\`
            ADD \`payment_gateway\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`organization\`
            ADD \`metadata\` json NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`organization\` DROP COLUMN \`metadata\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`organization\` DROP COLUMN \`payment_gateway\`
        `);
    }

}
