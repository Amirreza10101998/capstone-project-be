import SongCard from "../models/songCard.js";
import spotifyApi from '../services/spotifyAPI.js';
import { initSpotifyApi } from '../services/spotifyAPI.js';

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

export const getSongRecommendations = async (favoriteGenres) => {
    try {

        await initSpotifyApi();

        const seedGenres = favoriteGenres.join(',');

        const recommendations = await spotifyApi.getRecommendations({
            seed_genres: seedGenres,
            limit: 20,
        });

        return recommendations.body.tracks.map((track) => ({
            spotify_id: track.id,
            song_title: track.name,
            album_title: track.album.name,
            artist: track.artists.map((artist) => artist.name).join(', '),
            album_art: track.album.images[0]?.url,
            song_url: track.external_urls.spotify,
            song_genre: favoriteGenres,
        }));
    } catch (error) {
        console.error('Error fetching song recommendations:', error);
    }
};


const searchArtists = async (artists) => {
    try {
        const searchResults = await Promise.all(
            artists.map(async (artist) => {
                const result = await spotifyApi.searchArtists(artist);
                console.log(`Search query: ${artist}`);
                console.log("Artist search result:", result);
                return result.body.artists.items[0]?.id;
            })
        );
        return searchResults.filter((id) => id);
    } catch (error) {
        console.error("Error fetching artist IDs:", error);
    }
};

export const getArtistRecommendations = async (favoriteArtists) => {
    try {
        await initSpotifyApi();

        const seedArtists = await searchArtists(favoriteArtists);

        const recommendations = await spotifyApi.getRecommendations({
            seed_artists: seedArtists.join(','),
            limit: 20,
        });

        console.log("Recommendations request parameters:", {
            seed_artists: seedArtists.join(','),
            limit: 20,
        });

        return recommendations.body.tracks.map((track) => ({
            spotify_id: track.id,
            song_title: track.name,
            album_title: track.album.name,
            artist: track.artists.map((artist) => artist.name).join(', '),
            album_art: track.album.images[0]?.url,
            song_url: track.external_urls.spotify,
            song_artists: favoriteArtists,
        }));
    } catch (error) {
        console.error('Error fetching artist recommendations:', error);
    }
};



