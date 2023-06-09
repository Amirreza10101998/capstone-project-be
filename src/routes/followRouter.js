import express from "express";
import { jwtAuth } from "../middlewares/authMiddleware.js";
import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
} from "../controllers/followController.js";

const followRouter = express.Router();

followRouter.post("/:userId/follow", jwtAuth, followUser);
followRouter.delete("/:userId/unfollow", jwtAuth, unfollowUser);
followRouter.get("/:userId/followers", getFollowers);
followRouter.get("/:userId/following", getFollowing);

export default followRouter;
