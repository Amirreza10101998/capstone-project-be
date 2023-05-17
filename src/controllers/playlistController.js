import Playlist from '../models/playlist.js';
import User from '../models/user.js';
import SongCard from '../models/songCard.js';

// CREATE
export const createPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.create({
            name: req.body.name,
            description: req.body.description,
            user_id: req.user.id,
        });

        res.status(201).send(playlist);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// READ (Single)
export const getPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['id', 'username', 'avatar'] }, // include User
                { model: SongCard, through: 'playlist_song_cards', as: 'songs' }, // include SongCards
            ],
        });

        if (playlist) {
            res.send(playlist);
        } else {
            res.status(404).send({ message: 'Playlist not found.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// READ (All)
export const getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.findAll({
            where: { user_id: req.user.id },
            include: [
                { model: User, attributes: ['id', 'username', 'avatar'] },
                { model: SongCard, through: 'playlist_song_cards', as: 'songs' },
            ],
        });
        res.send(playlists);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// UPDATE
export const updatePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findByPk(req.params.id);

        if (playlist) {
            if (playlist.user_id !== req.user.id) {
                return res.status(403).send({ message: 'You can only update your own playlists.' });
            }

            playlist.name = req.body.name || playlist.name;
            playlist.description = req.body.description || playlist.description;
            await playlist.save();

            res.send(playlist);
        } else {
            res.status(404).send({ message: 'Playlist not found.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// DELETE
export const deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findByPk(req.params.id);

        if (playlist) {
            if (playlist.user_id !== req.user.id) {
                return res.status(403).send({ message: 'You can only delete your own playlists.' });
            }

            await playlist.destroy();
            res.send({ message: 'Playlist deleted.' });
        } else {
            res.status(404).send({ message: 'Playlist not found.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// ADD SONG TO PLAYLIST
export const addSongToPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findByPk(req.params.playlistId);
        const songCard = await SongCard.findByPk(req.body.songCardId);

        if (playlist && songCard) {
            await playlist.addSongCard(songCard);
            res.status(201).send({ message: 'Song added to playlist.' });
        } else {
            res.status(404).send({ message: 'Playlist or Song not found.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

