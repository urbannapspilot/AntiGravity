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
  poolSize: 10,
  supportBigNumbers: true,
  bigNumberStrings: false
});