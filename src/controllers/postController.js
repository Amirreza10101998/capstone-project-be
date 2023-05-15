import Post from '../models/post.js';

// CREATE
export const createPost = async (req, res) => {
    try {
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.user.id,
        });

        res.status(201).send(post);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// READ (Single)
export const getPost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);

        if (post) {
            res.send(post);
        } else {
            res.status(404).send({ message: 'Post not found.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// READ (All)
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.send(posts);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// UPDATE
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);

        if (post) {
            if (post.user_id !== req.user.id) {
                return res.status(403).send({ message: 'You can only update your own posts.' });
            }

            post.title = req.body.title || post.title;
            post.content = req.body.content || post.content;
            await post.save();

            res.send(post);
        } else {
            res.status(404).send({ message: 'Post not found.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// DELETE
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);

        if (post) {
            if (post.user_id !== req.user.id) {
                return res.status(403).send({ message: 'You can only delete your own posts.' });
            }

            await post.destroy();
            res.send({ message: 'Post deleted.' });
        } else {
            res.status(404).send({ message: 'Post not found.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
