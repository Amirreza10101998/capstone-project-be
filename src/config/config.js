import dotenv from "dotenv";

dotenv.config();

const config = {
    server: {
        port: process.env.PORT || 3001,
    },
    database: {
        db: process.env.PG_DB,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        host: process.env.PG_HOST,
        port: parseInt(process.env.PG_PORT, 10),
    },
    frontendUrl: process.env.FE_URL,
    backendUrl: process.env.BE_URL,
    jwtSecret: process.env.JWT_SECRET,
    refreshTokenSecret: process.env.REFRESH_SECRET,
    cloudinaryUrl: process.env.CLOUDINARY_URL,
    googleId: process.env.GOOGLE_ID,
    googleSecret: process.env.GOOGLE_SECRET,
    spotify: {
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    },
};

export default config;
