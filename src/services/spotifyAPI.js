import SpotifyWebApi from 'spotify-web-api-node';
import config from '../config/config.js';

const { client_id, client_secret, redirectUri } = config.spotify;

const spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirectUri,
});

const initSpotifyApi = async () => {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        const accessToken = data.body['access_token'];
        console.log('Successfully retrieved access token from Spotify API');
        spotifyApi.setAccessToken(accessToken);

        // Set a timeout to refresh the token before it expires
        setTimeout(async () => {
            await initSpotifyApi();
        }, (data.body['expires_in'] - 60) * 1000); // Refresh the token 60 seconds before expiration
    } catch (error) {
        console.error('Failed to retrieve access token from Spotify API:', error);
    }
};

export default spotifyApi;
export { initSpotifyApi };
