import express from "express"
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import config from "./config/index.js";
import { pgConnect } from "./utils/database.js";

const server = express()

/*---------- MIDDLEWARES ----------*/
server.use(cors());
server.use(express.json());

/*---------- ENDPOINTS ----------*/

/*---------- ERRORHANDLERS ----------*/

await pgConnect()

server.listen(config.server.port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${config.server.port}`)
})