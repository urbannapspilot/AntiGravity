import { MigrationInterface, QueryRunner } from "typeorm";

export class LoginFlagThingName1728811851068 implements MigrationInterface {
    name = 'LoginFlagThingName1728811851068';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`pod\`
            ADD \`thing_name\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            UPDATE \`pod\`
            SET \`thing_name\` = \`slug\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`pod_unique_thing_name\` ON \`pod\` (\`thing_name\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`pod_unique_thing_name\` ON \`pod\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`pod\` DROP COLUMN \`thing_name\`
        `);
    }

}
