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
        console.log(accessToken)
        spotifyApi.setAccessToken(accessToken);

        setTimeout(async () => {
            await initSpotifyApi();
        }, (data.body['expires_in'] - 60) * 1000);
    } catch (error) {
        console.error('Failed to retrieve access token from Spotify API:', error);
    }
};

const exchangeCodeForToken = async (code) => {
    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];

        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error exchanging code for access token:', error);
        throw new Error('Failed to exchange code for access token');
    }
};

const getAccessToken = (req, res) => {
    const accessToken = spotifyApi.getAccessToken();

    if (accessToken) {
        res.status(200).json({ access_token: accessToken });
    } else {
        res.status(500).json({ error: 'Failed to get access token' });
    }
};

const refreshAccessToken = async () => {
    try {
        const data = await spotifyApi.refreshAccessToken();
        const newAccessToken = data.body['access_token'];

        spotifyApi.setAccessToken(newAccessToken);

        console.log('Successfully refreshed access token');
        return { access_token: newAccessToken };
    } catch (error) {
        console.error('Failed to refresh access token:', error);
    }
};

export default spotifyApi;
export { initSpotifyApi, exchangeCodeForToken, getAccessToken, refreshAccessToken };
