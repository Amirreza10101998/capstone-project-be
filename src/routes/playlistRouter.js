import express from 'express';
import {
    createPlaylist,
    getPlaylist,
    getPlaylists,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
} from '../controllers/playlistController.js';
import { jwtAuth } from '../middlewares/authMiddleware.js';

const playlistRouter = express.Router();

// CREATE
playlistRouter.post('/', jwtAuth, createPlaylist);

// READ (Single)
playlistRouter.get('/:id', jwtAuth, getPlaylist);

// READ (All)
playlistRouter.get('/', jwtAuth, getPlaylists);

// UPDATE
playlistRouter.put('/:id', jwtAuth, updatePlaylist);

// DELETE
playlistRouter.delete('/:id', jwtAuth, deletePlaylist);

//ADD SONG TO PLAYLIST
playlistRouter.post("/:id/addSong", jwtAuth, addSongToPlaylist);

export default playlistRouter;
