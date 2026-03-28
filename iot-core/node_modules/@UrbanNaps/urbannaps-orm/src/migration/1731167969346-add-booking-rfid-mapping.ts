import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookingRfidMapping1731167969346 implements MigrationInterface {
    name = 'AddBookingRfidMapping1731167969346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`booking\`
            ADD \`rfid_card_id\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`booking\`
            ADD CONSTRAINT \`fk_booking_rfid_card_id\` FOREIGN KEY (\`rfid_card_id\`) REFERENCES \`rfid_card\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`booking\` DROP FOREIGN KEY \`fk_booking_rfid_card_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`booking\` DROP COLUMN \`rfid_card_id\`
        `);
    }

}
