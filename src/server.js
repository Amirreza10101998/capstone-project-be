import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import config from "./config/config.js";
import {
    badRequestHandler,
    forbiddenErrorHandler,
    genericErrorHandler,
    notfoundHandler,
    unauthorizedHandler,
} from "./middlewares/errorMiddleware.js";

import { googleStrategy } from "./middlewares/authMiddleware.js";
import passport from "passport";
import sequelize from './config/database.js';
import associateModels from './models/associateModels.js';
import usersRouter from "./routes/userRouter.js";
import songCardRouter from "./routes/songCardRouter.js";
import discoveryFeedRouter from "./routes/discoveryFeedRouter.js";
import createHttpError from "http-errors";
import spotifyRouter from "./routes/spotifyRouter.js";
import postRouter from "./routes/postRouter.js";



const server = express();

/*---------- MIDDLEWARES ----------*/
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];
server.use(
    cors({
        origin: (currentOrigin, corsNext) => {
            if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
                corsNext(null, true);
            } else {
                corsNext(
                    createHttpError(
                        400,
                        `Origin ${currentOrigin} is not in the whitelist!`
                    )
                );
            }
        },
    })
);

server.use(express.json());
server.use(passport.initialize());

passport.use("google", googleStrategy);

/*---------- ENDPOINTS ----------*/
server.use("/users", usersRouter)
server.use("/songs", songCardRouter)
server.use("/feed", discoveryFeedRouter)
server.use("/api", spotifyRouter)
server.use("/post", postRouter)

/*---------- ERRORHANDLERS ----------*/
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenErrorHandler);
server.use(notfoundHandler);
server.use(genericErrorHandler);


associateModels();


sequelize.sync()
    .then(() => {
        server.listen(config.server.port, () => {
            console.table(listEndpoints(server));
            console.log(`Server is running on port ${config.server.port}`);
        });
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });



