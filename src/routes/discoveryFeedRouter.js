import express from 'express';
import { getDiscoveryFeed } from '../controllers/feedController.js';
import { jwtAuth } from '../middlewares/authMiddleware.js';

const discoveryFeedRouter = express.Router();

discoveryFeedRouter.get('/discovery', jwtAuth, getDiscoveryFeed);

export default discoveryFeedRouter;
