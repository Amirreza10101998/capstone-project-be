import { getSongRecommendations, getArtistRecommendations, getTracksFromPlaylist, getPlaylistsFromCategory } from './songCardController.js';
import User from '../models/user.js';
import SongCard from '../models/songCard.js';
import UserSongPreferences from '../models/userSongPreferences.js';


export const getDiscoveryFeed = async (req, res, next) => {
    try {
        // Get user's favorite genres and artists
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { favorite_genres, favorite_artists } = user;

        // Get playlists from different categories
        const categories = ['toplists', 'mood', 'party']; // Replace with desired categories
        const playlistsPromises = categories.map((category) => getPlaylistsFromCategory(category));
        const playlistsArray = await Promise.all(playlistsPromises);
        const playlists = playlistsArray.flat();

        // Get tracks from the playlists
        const tracksPromises = playlists.map((playlist) => getTracksFromPlaylist(playlist.id));
        const tracksArray = await Promise.all(tracksPromises);
        const uniqueRecommendations = tracksArray.flat();

        // Save the song cards and associate them with the user
        const savedSongCards = [];
        for (const recommendation of uniqueRecommendations) {
            console.log('Processing recommendation:', recommendation);
            if (!recommendation.spotify_id) {
                console.log('Skipping recommendation due to missing spotify_id');
                continue;
            }
            // Find or create a song card
            const [songCard, created] = await SongCard.findOrCreate({
                where: { spotify_id: recommendation.spotify_id },
                defaults: recommendation,
            });

            // Associate the song card with the user if not already associated
            if (created) {
                await UserSongPreferences.create({
                    user_id: req.user.id,
                    song_id: songCard.id,
                    liked: false, // Add a default value for liked
                    disliked: false, // Add a default value for disliked
                });
            } else {
                console.log('Song card already exists');
            }

            savedSongCards.push(songCard);
        }

        // Return the saved song cards to the front-end
        res.status(200).json({
            result: savedSongCards,
        });
    } catch (error) {
        next(error);
    }
};


