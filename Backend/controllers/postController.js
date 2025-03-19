import Post from '../models/posts.js';

const createPost = async (req, res) => {
	try {
		const { authorModel, content } = req.body;
		const authorId = req.user.id;

		const newPost = new Post({
			author: authorId,
			authorModel,
			content,
		});

		await newPost.save();
		res
			.status(201)
			.json({ message: 'Post created successfully', post: newPost });
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ error: 'Internal server error', details: error.message });
	}
};

const getPostsByAuthor = async (req, res) => {
	try {
		const { authorId } = req.params;
		const page = parseInt(req.query.page) || 1;
		const limit = 10;
		const skip = (page - 1) * limit;

		if (!authorId) {
			return res.status(400).json({ error: 'Author ID is required' });
		}

		const posts = await Post.find({ author: authorId })
			.populate('author')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);
		res.status(200).json(posts);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Internal server error', details: error.message });
	}
};

const getPosts = async (req, res) => {
	console.log("Error Here");
	try {
		const page = parseInt(req.query.page) || 1;
		console.log("Error Here1");
		const limit = 10;
		console.log("Error Here2");
		const skip = (page - 1) * limit;
		console.log("Error Here3");

		const posts = await Post.find()
			.populate('author')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);
			// console.log("Posts->",posts);
		res.json(posts);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Internal server error', details: error.message });
	}
};

export { createPost, getPostsByAuthor, getPosts };
