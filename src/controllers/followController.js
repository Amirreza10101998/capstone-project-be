import Follow from "../models/follow.js";
import User from "../models/user.js";
import createError from "http-errors";

export const followUser = async (req, res, next) => {
    try {
        const followerId = req.user.id;
        const followeeId = req.params.userId;

        const follow = await Follow.create({ followerId, followeeId });

        if (follow) {
            res.status(200).json({ message: "Followed successfully" });
        } else {
            next(createError(400, "Failed to follow user"));
        }
    } catch (error) {
        next(error);
    }
};

export const unfollowUser = async (req, res, next) => {
    try {
        const followerId = req.user.id;
        const followeeId = req.params.userId;

        const rowsDeleted = await Follow.destroy({
            where: { followerId, followeeId },
        });

        if (rowsDeleted > 0) {
            res.status(200).json({ message: "Unfollowed successfully" });
        } else {
            next(createError(400, "Failed to unfollow user"));
        }
    } catch (error) {
        next(error);
    }
};

export const getFollowers = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId, {
            include: [{ model: User, as: 'Followers' }],
        });

        if (user) {
            res.status(200).json(user.Followers);
        } else {
            next(createError(404, `User with id ${userId} not found`));
        }
    } catch (error) {
        next(error);
    }
};

export const getFollowing = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId, {
            include: [{ model: User, as: 'Following' }],
        });

        if (user) {
            res.status(200).json(user.Following);
        } else {
            next(createError(404, `User with id ${userId} not found`));
        }
    } catch (error) {
        next(error);
    }
};
