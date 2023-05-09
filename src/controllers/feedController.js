import { getGenreBasedRecommendations, getArtistBasedRecommendations } from '../utils/songRecommendation.js';
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

        // Fetch song recommendations
        let uniqueRecommendations = [];
        let maxAttempts = 1;
        let attempts = 0;

        while (uniqueRecommendations.length < 5 && attempts < maxAttempts) {
            // Fetch song recommendations based on favorite genres
            const genreRecommendations = await getGenreBasedRecommendations(favorite_genres);

            // Fetch song recommendations based on favorite artists
            const artistRecommendations = await getArtistBasedRecommendations(favorite_artists);

            // Combine the recommendations
            const combinedRecommendations = [...genreRecommendations, ...artistRecommendations];

            // Filter out duplicates
            uniqueRecommendations = combinedRecommendations.filter(
                (track, index, self) => self.findIndex((t) => t.spotify_id === track.spotify_id) === index
            );

            attempts++;
        }

        // Save the song cards and associate them with the user
        const savedSongCards = [];
        for (const recommendation of uniqueRecommendations) {
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

