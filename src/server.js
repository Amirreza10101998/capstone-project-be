import express from "express"
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import config from "./config/config.js";
import { pgConnect } from "./config/database.js";
import { badRequestHandler, forbiddenErrorHandler, genericErrorHandler, notfoundHandler, unauthorizedHandler } from "./middlewares/errorMiddleware.js";
import { googleStrategy } from "./middlewares/authMiddleware.js"
import passport from "passport";

const server = express()
const whitelist = [config.server.FE_URL]

/*---------- MIDDLEWARES ----------*/
server.use(cors({
    origin: (currentOrigin, corsNext) => {
        if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
            corsNext(null, true)
        } else {
            corsNext(createHttpError(400, `Origin ${currentOrigin} is not whitelisted.`))
        }
    }
}))

server.use(express.json());
server.use(passport.initialize())


passport.use("google", googleStrategy)

/*---------- ENDPOINTS ----------*/

/*---------- ERRORHANDLERS ----------*/
server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(forbiddenErrorHandler)
server.use(notfoundHandler)
server.use(genericErrorHandler)

await pgConnect()

server.listen(config.server.port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${config.server.port}`)
})