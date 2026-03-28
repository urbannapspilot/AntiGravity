import { appDataSource } from "../src/repo/datasource";

async function syncDb() {
    try {
        console.log("Connecting to the database and forcing schema synchronization...");
        
        // This is safe because we are connected to the isolated AWS RDS Sandbox.
        // It will physically construct Location and Promotion tables!
        appDataSource.setOptions({ synchronize: true });
        
        await appDataSource.initialize();
        console.log("Database initialized and schema successfully synchronized!");
        
        // Let's print the tables out of curiosity
        const tables = await appDataSource.query("SHOW TABLES");
        console.log("Current Tables:", tables);
        
        await appDataSource.destroy();
        console.log("Connection closed.");
    } catch (e) {
        console.error("Failed to sync database:", e);
    }
}

syncDb();
