import axios from 'axios';
import config from '../config/config.js';

const client_id = config.spotify.client_id;
const client_secret = config.spotify.client_secret;

const getAccessToken = async () => {
    const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },
        data: 'grant_type=client_credentials',
    });

    return response.data.access_token;
};

const searchTracks = async (query, accessToken) => {
    const response = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&market=US&limit=10`,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return response.data.tracks.items;
};

export { getAccessToken, searchTracks };
