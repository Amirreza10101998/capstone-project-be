import express from "express";
import {
    getAllSongCards,
    getSongCardById,
    createSongCard,
    updateSongCard,
    deleteSongCard,
} from "../controllers/songCardController.js";

const songCardRouter = express.Router();

songCardRouter.get("/", getAllSongCards);
songCardRouter.get("/:songCardId", getSongCardById);
songCardRouter.post("/", createSongCard);
songCardRouter.put("/:songCardId", updateSongCard);
songCardRouter.delete("/:songCardId", deleteSongCard);

export default songCardRouter;
