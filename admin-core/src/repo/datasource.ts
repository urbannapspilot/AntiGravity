import { getDataSource } from "@urbannaps/urbannaps-orm";
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../.env') });

export const appDataSource = getDataSource({
  type: "mysql",
  host: process.env.RDS_HOST || "localhost",
  port: Number(process.env.RDS_PORT) || 3306,
  username: process.env.RDS_USERNAME || "root",
  password: process.env.RDS_PASSWORD || "",
  database: process.env.RDS_DATABASE || "urbannaps",
  timezone: 'Z',
  poolSize: 5,
  supportBigNumbers: true,
  bigNumberStrings: false,
  extra: {
    connectionLimit: 5,
    acquireTimeout: 10000,
    connectTimeout: 10000,
    waitForConnections: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  }
});
