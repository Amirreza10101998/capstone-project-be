import jwt from "jsonwebtoken";
import UsersModel from "../models/user.js";
import createHttpError from "http-errors";
import GoogleStrategy from "passport-google-oauth20";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import config from "../config/config.js";

export const createAccessToken = (payload) =>
    new Promise((resolve, reject) =>
        jwt.sign(
            payload,
            config.jwtSecret,
            { expiresIn: "150m" },
            (err, token) => {
                if (err) reject(err);
                else resolve(token);
            }
        )
    );

export const verifyAccessToken = (token) =>
    new Promise((resolve, reject) =>
        jwt.verify(token, config.jwtSecret, (err, payload) => {
            if (err) reject(err);
            else resolve(payload);
        })
    );

export const createRefreshToken = (payload) =>
    new Promise((resolve, reject) =>
        jwt.sign(
            payload,
            config.refreshTokenSecret,
            { expiresIn: "150m" },
            (err, token) => {
                if (err) reject(err);
                else resolve(token);
            }
        )
    );

export const verifyRefreshToken = (token) =>
    new Promise((resolve, reject) =>
        jwt.verify(token, config.refreshTokenSecret, (err, payload) => {
            if (err) reject(err);
            else resolve(payload);
        })
    );

export const createTokens = async (user) => {
    console.log(user);
    const accessToken = await createAccessToken({ id: user.id });
    const refreshToken = await createRefreshToken({ id: user.id });

    user.refreshToken = refreshToken;
    await user.save();
    console.log(accessToken)

    return { accessToken, refreshToken };
};

export const verifyAndRefreshTokens = async (currentRefreshToken) => {
    try {
        console.log("bla", currentRefreshToken);
        const { id } = await verifyRefreshToken(currentRefreshToken);
        console.log(id);
        const user = await UsersModel.findByPk(id);
        console.log(user);
        if (!user) throw new createHttpError(404, `User with id ${id} not found.`);
        if (user.refreshToken && user.refreshToken === currentRefreshToken) {
            const { accessToken, refreshToken } = await createTokens(user);
            return { accessToken, refreshToken };
        } else {
            throw new createHttpError(401, "Invalid refresh token.");
        }
    } catch (error) {
        throw new createHttpError(401, "Please log in.");
    }
};

export const jwtAuth = async (req, res, next) => {
    if (!req.headers.authorization) {
        next(createHttpError(401, "No bearer token provided. 🐻"));
    } else {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        try {
            const payload = await verifyAccessToken(accessToken);
            req.user = { id: payload.id };
            next();
        } catch (error) {
            console.log(error);
            next(createHttpError(401, "Invalid token."));
        }
    }
};

export const googleStrategy = new GoogleStrategy(
    {
        clientID: config.googleId,
        clientSecret: config.googleSecret,
        callbackURL: `${config.backendUrl}/users/googlecallback`,
    },
    async (_, __, profile, pnext) => {
        try {
            const { email, given_name, family_name, sub, picture } = profile._json;
            const user = await UsersModel.findOne({ email });
            if (user) {
                const { accessToken, refreshToken } = await createTokens(user);
                pnext(null, { accessToken, refreshToken });
            } else {
                const newUser = await UsersModel({
                    name: given_name + " " + family_name,
                    email,
                    avatar: picture,
                    googleId: sub,
                });

                const created = await newUser.save();
                const { accessToken, refreshToken } = await createTokens(created);
                pnext(null, { accessToken, refreshToken });
            }
        } catch (error) {
            pnext(error);
        }
    }
);

export const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "capstone/HERTZ/avatars",
        },
    }),
}).single("avatar");
