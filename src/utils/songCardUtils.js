import SongCard from "../models/songCard.js";
import { getAccessToken, searchTracks } from '../services/spotifyAPI.js';

const populateSongCards = async (query) => {
    try {
        const accessToken = await getAccessToken();
        const tracks = await searchTracks(query, accessToken);

        for (const track of tracks) {
            const songCard = {
                song_title: track.name,
                album_title: track.album.name,
                artist: track.artists.map((artist) => artist.name).join(', '),
                album_art: track.album.images[0]?.url || null,
                song_url: track.external_urls.spotify,
            };

            await SongCard.create(songCard);
        }
    } catch (error) {
        console.error(error);
    }
};

export default populateSongCards;
