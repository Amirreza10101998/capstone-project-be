import dotenv from "dotenv";

dotenv.config();

const config = {
    server: {
        port: process.env.PORT || 3001,
    },
    database: {
        db: process.env.PG_DB,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        host: process.env.PG_HOST,
        port: parseInt(process.env.PG_PORT, 10),
    },
};


export default config;