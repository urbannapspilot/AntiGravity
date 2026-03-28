import { MigrationInterface, QueryRunner } from "typeorm";

export class BookingUniqueOrderId1766319703054 implements MigrationInterface {
    name = 'BookingUniqueOrderId1766319703054';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`idx_booking_order_id\` ON \`booking\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`idx_booking_order_id\` ON \`booking\` (\`order_id\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`idx_booking_order_id\` ON \`booking\`
        `);
        await queryRunner.query(`
            CREATE INDEX \`idx_booking_order_id\` ON \`booking\` (\`order_id\`)
        `);
    }

}
