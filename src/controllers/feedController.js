import { getSongRecommendations, getArtistRecommendations } from './songCardController.js';
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

        console.log('Favorite genres:', favorite_genres);
        console.log('Favorite artists:', favorite_artists);

        // Fetch song recommendations based on favorite genres
        const genreRecommendations = await getSongRecommendations(favorite_genres);

        console.log('Genre recommendations:', genreRecommendations);

        // Fetch song recommendations based on favorite artists
        const artistRecommendations = await getArtistRecommendations(favorite_artists);

        console.log('Artist recommendations:', artistRecommendations);

        // Combine the recommendations
        const combinedRecommendations = [...genreRecommendations, ...artistRecommendations];

        console.log('Combined recommendations:', combinedRecommendations);

        // Filter out duplicates
        const uniqueRecommendations = combinedRecommendations.filter(
            (track, index, self) => self.findIndex((t) => t.id === track.id) === index
        );

        console.log('Unique recommendations:', uniqueRecommendations);

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

            console.log('Song card:', songCard);
            console.log('Created:', created);

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

        console.log('Saved song cards:', savedSongCards);

        // Return the saved song cards to the front-end
        res.status(200).json(savedSongCards);
    } catch (error) {
        next(error);
    }
};

