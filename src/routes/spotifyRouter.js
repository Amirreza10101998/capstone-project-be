import express from "express";
import { exchangeCodeForToken, getAccessToken } from '../services/spotifyAPI.js';


const spotifyRouter = express.Router();

spotifyRouter.post("/token", async (req, res) => {
    const { code } = req.body;

    try {
        const { accessToken } = await exchangeCodeForToken(code);
        res.json({ accessToken });
    } catch (error) {
        console.error("Error in token route:", error);
        res.status(500).json({ error: error.message });
    }
});

spotifyRouter.get("/token", getAccessToken);

export default spotifyRouter
