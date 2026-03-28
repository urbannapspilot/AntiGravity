// add order_id to booking table
import { MigrationInterface, QueryRunner } from "typeorm";


 export class AddOrderIdToBookingTable1724446069261 implements MigrationInterface {
    name = 'AddOrderIdToBookingTable1724446069261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`booking\` ADD \`order_id\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`booking\` DROP COLUMN \`order_id\`
        `);
    }
 }

  export class AddIndexOnOrderId1724446069261 implements MigrationInterface {
      name = 'AddIndexOnOrderId1724446069261'
  
      public async up(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query(`
              CREATE INDEX \`idx_booking_order_id\` ON \`booking\` (\`order_id\`)
          `);
      }
  
      public async down(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query(`
              DROP INDEX IF EXISTS \`idx_booking_order_id\` ON \`booking\`
          `);
      }
  }
