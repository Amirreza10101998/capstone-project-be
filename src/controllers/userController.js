import { Op } from "sequelize";
import passport from "passport";
import UsersModel from "../models/user.js";
import createError from "http-errors";
import {
    createTokens,
    verifyAndRefreshTokens,
} from "../middlewares/authMiddleware.js";

export const googleLogin = passport.authenticate("google", { scope: ["profile", "email"] });

export const googleCallback = (req, res, next) => {
    try {
        res.redirect(
            `${process.env.FE_URL}/main?accessToken=${req.user.accessToken}&refreshToken=${req.user.refreshToken}`
        );
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const { q } = req.query;
        let query = {};

        if (q) {
            query = {
                [Op.or]: [
                    { name: { [Op.iRegexp]: q } },
                    { email: { [Op.iRegexp]: q } },
                ],
            };
        }

        const users = await UsersModel.findAll({ where: query });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await UsersModel.findOne({
            where: { id: req.user.id },
        });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send(user);
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updatedUser = await UsersModel.update(req.body, {
            where: { id: userId },
        });

        if (updatedUser[0] === 1) {
            const updatedUserData = await UsersModel.findByPk(userId);
            res.status(200).send(updatedUserData);
        } else {
            res.status(404).send({ message: "User not found or not updated" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export const uploadAvatar = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { filename } = req.file;
        const updatedUser = await UsersModel.update(
            { avatar: filename },
            { where: { id } }
        );
        if (updatedUser[0] === 1) {
            res.status(200).json({ message: 'Avatar updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found or not updated' });
        }
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await UsersModel.findByPk(req.params.userId);
        if (user) {
            res.send(user);
        } else {
            next(createError(404, `User with id ${req.params.userId} not found`));
        }
    } catch (error) {
        next(error);
    }
};

export const createAccount = async (req, res, next) => {
    try {
        const newUser = new UsersModel(req.body);
        const { id } = await newUser.save();
        const { accessToken, refreshToken } = await createTokens(newUser);

        res.send({ id, accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
};

export const createSession = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await UsersModel.checkCredentials(email, password);
        if (user) {
            const { accessToken, refreshToken } = await createTokens(user);
            res.send({ accessToken, refreshToken });
            console.log(accessToken)
        } else {
            next(createError(401, "Invalid credentials"));
        }
    } catch (error) {
        next(error);
    }
};

export const deleteSession = async (req, res, next) => {
    try {
        const user = await UsersModel.update(
            { refreshToken: null }, // or { refreshToken: undefined }
            { where: { id: req.user.id } }
        );
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const refreshSession = async (req, res, next) => {
    try {
        const { currentRefreshToken } = req.body;
        const { accessToken, refreshToken } = await verifyAndRefreshTokens(
            currentRefreshToken
        );
        res.send({ accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
};

export const setFavoriteArtistsAndGenres = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { favoriteArtists, favoriteGenres } = req.body;

        const updatedUser = await UsersModel.update(
            { favoriteArtists, favoriteGenres },
            { where: { id: userId } }
        );

        if (updatedUser[0] === 1) {
            const updatedUserData = await UsersModel.findByPk(userId);
            res.status(200).send(updatedUserData);
        } else {
            res.status(404).send({ message: "User not found or not updated" });
        }
    } catch (error) {
        next();
    }
};