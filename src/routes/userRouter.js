import express from "express";
import passport from "passport";
import {
    googleCallback,
    getUsers,
    getMe,
    updateMe,
    uploadAvatar,
    getUserById,
    createAccount,
    createSession,
    deleteSession,
    refreshSession,
    setFavoriteArtistsAndGenres,
} from "../controllers/userController.js";
import { jwtAuth, cloudinaryUploader } from "../middlewares/authMiddleware.js";

const usersRouter = express.Router();

usersRouter.get("/googlelogin", passport.authenticate("google", { scope: ["profile", "email"] }));
usersRouter.get("/googlecallback", passport.authenticate("google", { session: false }), googleCallback);
usersRouter.get("/", getUsers);
usersRouter.get("/me", jwtAuth, getMe);
usersRouter.put("/me", jwtAuth, updateMe);
usersRouter.post("/me/avatar", jwtAuth, cloudinaryUploader, uploadAvatar);
usersRouter.get("/:userId", getUserById);
usersRouter.post("/account", createAccount);
usersRouter.post("/session", createSession);
usersRouter.delete("/session", jwtAuth, deleteSession);
usersRouter.post("/session/refresh", refreshSession);
usersRouter.post("/me/favorites", jwtAuth, setFavoriteArtistsAndGenres);

export default usersRouter;
