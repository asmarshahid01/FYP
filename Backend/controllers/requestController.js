import Request from '../models/requests.js';
import Student from '../models/student.js';
import Supervisor from '../models/supervisor.js';
import Notification from '../models/notifications.js';
import Fypgroup from '../models/fypgroup.js';

const createRequest = async (req, res) => {
	try {
		const { message, receiverId, receiverModel } = req.body;
		const sender = req.user.id;

		const request = new Request({
			message,
			sender,
			receiver: receiverId,
			receiverModel,
		});

		await request.save();

		// const notification = new Notification({
		//   requestType: "request",
		//   message,
		//   sender,
		//   receiver: receiverId,
		//   receiverModel,
		// });

		// await notification.save();

		res.status(201).json({ message: 'Request sent successfully' });
	} catch (err) {
		console.error('Create Request Error: ', err);
		res.status(500).json({ message: 'Server error' });
	}
};

const getRequests = async (req, res) => {
	try {
		const userId = req.user.id;

		const requests = await Request.find({
			receiver: userId,
		})
			.populate('sender')
			.sort({ createdAt: -1 });

		res.status(200).json({ message: 'Success', requests });
	} catch (err) {
		console.error('Get Requests Error: ', err);
		res.status(500).json({ message: 'Server error' });
	}
};

const getPendingRequests = async (req, res) => {
	try {
		const userId = req.user.id;

		const requests = await Request.find({
			sender: userId,
		})
			.populate('receiver')
			.sort({ createdAt: -1 });
		res.status(200).json({ message: 'Success', requests });
	} catch (err) {
		console.error('Get Requests Error: ', err);
		res.status(500).json({ message: 'Server error' });
	}
};

const deleteRequest = async (req, res) => {
	try {
		console.log('inside');
		const requestId = req.params.id;
		const userId = req.user.id;

		const request = await Request.findById(requestId);
		if (!request) {
			return res.status(404).json({ message: 'Request not found' });
		}

		await request.deleteOne();

		res.status(200).json({ message: 'Request deleted successfully' });
	} catch (err) {
		console.error('Delete Request Error: ', err);
		res.status(500).json({ message: 'Server error' });
	}
};

const acceptRequest = async (req, res) => {
	try {
		const requestId = req.params.id;
		const userId = req.user.id;

		const request = await Request.findById(requestId);
		if (!request) {
			return res.status(404).json({ message: 'Request not found' });
		}

		if (request.receiver.toString() !== userId) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const sender = await Student.findById(request.sender);
		const receiver = await Student.findById(request.receiver);

		console.log(sender, receiver, request);

		if (!sender || !receiver) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (request.receiverModel === 'Student') {
			sender.role = false;
			receiver.role = true;
			const receivergroup = await Fypgroup.findOne({ studentsId: sender._id });
			if (receivergroup) {
				if (receivergroup.studentsId.length < 3) {
					receivergroup.studentsId.push(receiver._id);
					await receivergroup.save();
					await Request.deleteMany({ sender: sender._id });
				} else {
					return res.status(400).json({ message: 'Your group is full' });
				}
			} else {
				console.log('Creating new group');
				const group = new Fypgroup({
					studentsId: [sender._id, receiver._id],
				});
				console.log('Group created: ', group);
				await group.save();
				await Request.deleteMany({ sender: sender._id });
				await Request.deleteMany({
					receiver: receiver._id,
				});
			}
		} else {
			console.log;
		}

		await receiver.save();
		await sender.save();
		await request.deleteOne();
		res.status(200).json({ message: 'Request accepted successfully' });
	} catch (err) {
		console.error('Accept Request Error: ', err);
		res.status(500).json({ message: 'Server error' });
	}
};

export {
	createRequest,
	getRequests,
	deleteRequest,
	acceptRequest,
	getPendingRequests,
};
