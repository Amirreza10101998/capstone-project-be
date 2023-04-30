import { Sequelize } from "sequelize";
import config from "../config/index.js";

const { db, user, password, host, port } = config.database;

const sequelize = new Sequelize(db, user, password, {
    host: host,
    port: port,
    dialect: "postgres",
});

export const pgConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Successfully connected to Postgres!`);
        await sequelize.sync({ alter: true });
        console.log(`All models syncronized!`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default sequelize;
