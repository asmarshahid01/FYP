import Query from '../models/queries.js';

// Create a new query
const createQuery = async (req, res) => {
	try {
		const { content } = req.body;
		const authorId = req.user.id;
		const authorModel = req.user.usertype || req.user.role || 'Student';

		const newQuery = new Query({
			author: authorId,
			authorModel,
			content,
		});
		await newQuery.save();
		res
			.status(201)
			.json({ message: 'Query submitted successfully', query: newQuery });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ error: 'Internal server error', details: error.message });
	}
};

// Get all queries by the current user
const getUserQueries = async (req, res) => {
	try {
		const authorId = req.user.id;
		const queries = await Query.find({ author: authorId }).sort({
			createdAt: -1,
		});
		res.status(200).json(queries);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Internal server error', details: error.message });
	}
};

// Reply to a query (by coordinator)
const replyToQuery = async (req, res) => {
	try {
		const { queryId } = req.params;
		const { reply } = req.body;
		const coordinatorId = req.user.id;

		const updatedQuery = await Query.findByIdAndUpdate(
			queryId,
			{
				reply,
				repliedBy: coordinatorId,
				resolved: true,
			},
			{ new: true }
		);

		if (!updatedQuery) {
			return res.status(404).json({ error: 'Query not found' });
		}
		res.status(200).json({ message: 'Reply sent', query: updatedQuery });
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Internal server error', details: error.message });
	}
};

// Get all queries (for admin/coordinator) - unresolved first
const getAllQueries = async (req, res) => {
	try {
		const queries = await Query.find()
			.populate('author')
			.sort({ resolved: 1, createdAt: -1 }); // unresolved first, then newest
		res.status(200).json(queries);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Internal server error', details: error.message });
	}
};

export { createQuery, getUserQueries, getAllQueries, replyToQuery };
