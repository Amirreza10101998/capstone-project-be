import SongCard from "../models/songCard.js";

export const getAllSongCards = async (req, res, next) => {
    try {
        const songCards = await SongCard.findAll();
        res.status(200).json(songCards);
    } catch (error) {
        next(error);
    }
};

export const getSongCardById = async (req, res, next) => {
    try {
        const songCard = await SongCard.findByPk(req.params.songCardId);
        if (songCard) {
            res.status(200).json(songCard);
        } else {
            res.status(404).send({ message: `SongCard with id ${req.params.songCardId} not found` });
        }
    } catch (error) {
        next(error);
    }
};

export const createSongCard = async (req, res, next) => {
    try {
        const newSongCard = await SongCard.create(req.body);
        res.status(201).json(newSongCard);
    } catch (error) {
        next(error);
    }
};

export const updateSongCard = async (req, res, next) => {
    try {
        const updatedSongCard = await SongCard.update(req.body, {
            where: { id: req.params.songCardId },
        });

        if (updatedSongCard[0] === 1) {
            const updatedSongCardData = await SongCard.findByPk(req.params.songCardId);
            res.status(200).json(updatedSongCardData);
        } else {
            res.status(404).send({ message: "SongCard not found or not updated" });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteSongCard = async (req, res, next) => {
    try {
        const deletedSongCard = await SongCard.destroy({
            where: { id: req.params.songCardId },
        });

        if (deletedSongCard === 1) {
            res.status(204).send();
        } else {
            res.status(404).send({ message: "SongCard not found or not deleted" });
        }
    } catch (error) {
        next(error);
    }
};





