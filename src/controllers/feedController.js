import { getSongRecommendations, getArtistRecommendations } from './songCardController.js';
import User from '../models/user.js';
import SongCard from '../models/songCard.js';
import UserSongPreferences from '../models/userSongPreferences.js';

export const getDiscoveryFeed = async (req, res, next) => {
    try {
        // Get user's favorite genres and artists
        const user = await User.findByPk(req.user.id);
        const { favorite_genres, favorite_artists } = user;

        // Fetch song recommendations based on favorite genres
        const genreRecommendations = await getSongRecommendations(favorite_genres);

        // Fetch song recommendations based on favorite artists
        const artistRecommendations = await getArtistRecommendations(favorite_artists);

        // Combine the recommendations
        const combinedRecommendations = [...genreRecommendations, ...artistRecommendations];

        // Filter out duplicates
        const uniqueRecommendations = combinedRecommendations.filter(
            (track, index, self) => self.findIndex((t) => t.id === track.id) === index
        );

        // Save the song cards and associate them with the user
        const savedSongCards = [];
        for (const recommendation of uniqueRecommendations) {
            // Find or create a song card
            const [songCard, created] = await SongCard.findOrCreate({
                where: { id: recommendation.id },
                defaults: recommendation,
            });

            // Associate the song card with the user if not already associated
            if (created) {
                await UserSongPreferences.create({
                    user_id: req.user.id,
                    song_id: songCard.id,
                });
            }

            savedSongCards.push(songCard);
        }

        // Return the saved song cards to the front-end
        res.status(200).json(savedSongCards);
    } catch (error) {
        next(error);
    }
};
