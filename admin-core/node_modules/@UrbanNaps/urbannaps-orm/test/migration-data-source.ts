import { config } from 'dotenv';
import { getDataSource } from "../src/data-source";

config();

const appDataSource = getDataSource({
  type: "mysql",
  host: process.env.RDS_HOST,
  port: 3306,
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  migrations: ['./src/migration/*.ts'],
  logging: true
});

export default appDataSource;