import express from 'express';
import { createPost, getPost, getPosts, updatePost, deletePost } from '../controllers/postController.js';
import { jwtAuth } from '../middlewares/authMiddleware.js';

const postRouter = express.Router();

postRouter.post('/', jwtAuth, createPost);
postRouter.get('/', getPosts);
postRouter.get('/:id', getPost);
postRouter.put('/:id', jwtAuth, updatePost);
postRouter.delete('/:id', jwtAuth, deletePost);

export default postRouter;
