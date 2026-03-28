const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function clone() {
    const host = process.env.RDS_HOST;
    const user = "urbannaps";
    const password = process.env.RDS_PASSWORD;
    const srcDb = process.env.RDS_DATABASE; // expected: urbannaps_prod_new
    const targetDb = 'urbannaps_dev';

    console.log(`Connecting to ${host} as ${user}...`);
    const connection = await mysql.createConnection({
        host, 
        user, 
        password,
        database: srcDb,
        multipleStatements: true
    });

    console.log(`Creating database ${targetDb} if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${targetDb}\``);
    
    // Switch to src to get tables
    await connection.query(`USE \`${srcDb}\``);
    const [tablesRow] = await connection.query('SHOW TABLES');
    const tableKey = Object.keys(tablesRow[0])[0];
    const tables = tablesRow.map(row => row[tableKey]);

    console.log(`Found ${tables.length} tables in ${srcDb}. Cloning to ${targetDb}...`);

    for (const table of tables) {
        console.log(`[${table}] Fetching schema...`);
        const [createTableResult] = await connection.query(`SHOW CREATE TABLE \`${table}\``);
        let createStmt = createTableResult[0]['Create Table'];
        
        // Execute create in target
        await connection.query(`USE \`${targetDb}\``);
        await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
        await connection.query(createStmt);
        
        // Copy data
        console.log(`[${table}] Copying data...`);
        try {
            await connection.query(`INSERT INTO \`${targetDb}\`.\`${table}\` SELECT * FROM \`${srcDb}\`.\`${table}\``);
            console.log(`[${table}] Successfully cloned schema and data.`);
        } catch(e) {
            console.error(`[${table}] Failed to copy data: ${e.message}`);
        }
    }

    console.log('');
    console.log('✅ Clone completely finished!');
    console.log('You can now update your .env to: RDS_DATABASE="urbannaps_dev"');
    await connection.end();
}

clone().catch(console.error);
