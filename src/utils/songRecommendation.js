import spotifyApi from '../services/spotifyAPI.js';
import { initSpotifyApi } from '../services/spotifyAPI.js';

const getRandomSubset = (arr, count) => {
    const shuffled = arr.slice(0);
    for (let i = arr.length - 1; i > 0; i--) {
        const index = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[index]] = [shuffled[index], shuffled[i]];
    }
    return shuffled.slice(0, count);
};

export const getGenreBasedRecommendations = async (favoriteGenres) => {
    try {
        await initSpotifyApi();

        const seedGenresSubset = getRandomSubset(favoriteGenres, 20);
        const seedGenres = seedGenresSubset.join(',');

        const recommendations = await spotifyApi.getRecommendations({
            seed_genres: seedGenres,
            limit: 100,
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
        console.error('Error fetching genre-based recommendations:', error);
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

export const getArtistBasedRecommendations = async (favoriteArtists) => {
    try {
        await initSpotifyApi();

        const seedArtistsSubset = getRandomSubset(favoriteArtists, 20);
        const seedArtists = await searchArtists(seedArtistsSubset);

        const recommendations = await spotifyApi.getRecommendations({
            seed_artists: seedArtists.join(','),
            limit: 50,
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
        console.error('Error fetching artist-based recommendations:', error);
    }
};

/*export const getPlaylistsFromCategory = async (category_id) => {
    try {
        await initSpotifyApi();

        const playlists = await spotifyApi.getPlaylistsForCategory(category_id, {
            country: 'US', // Change this to the desired country code
            limit: 10,
        });

        return playlists.body.playlists.items;
    } catch (error) {
        console.error('Error fetching playlists from category:', error);
    }
};

export const getTracksFromPlaylist = async (playlist_id) => {
    try {
        await initSpotifyApi();

        const tracks = await spotifyApi.getPlaylistTracks(playlist_id, {
            limit: 100,
        });

        return tracks.body.items.map((item) => ({
            spotify_id: item.track.id,
            song_title: item.track.name,
            album_title: item.track.album.name,
            artist: item.track.artists.map((artist) => artist.name).join(', '),
            album_art: item.track.album.images[0]?.url,
            song_url: item.track.external_urls.spotify,
        }));
    } catch (error) {
        console.error('Error fetching tracks from playlist:', error);
    }
};
*/