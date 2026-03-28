// add order_id to booking table
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookingStatusColumnBookingTable1724449069879 implements MigrationInterface {
    name = 'AddBookingStatusColumnBookingTable1724449069879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`booking\` ADD \`status\` varchar(255) NOT NULL DEFAULT 'pending'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`booking\` DROP COLUMN \`status\`
        `);
    }
}

export class AddIndexOnStatus1724449069879 implements MigrationInterface {
    name = 'AddIndexOnStatus1724449069879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX \`idx_booking_status\` ON \`booking\` (\`status\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX IF EXISTS \`idx_booking_status\` ON \`booking\`
        `);
    }
}
