import { Sequelize } from "sequelize";
import { getEnv } from "./env.js";

const env = getEnv();

export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: "postgres",
  logging: false
});

export async function connectDb() {
  await sequelize.authenticate();
}

