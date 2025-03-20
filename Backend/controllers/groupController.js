import Fypgroup from '../models/fypgroup.js';
import Student from '../models/student.js';

const findGroupByStudentId = async (req, res) => {
	try {
		const studentId = req.user.id;
		const group = await Fypgroup.findOne({ studentsId: studentId }).populate(
			'studentsId'
		);
		if (!group) {
			return res.status(200).json({ message: 'Group not found' });
		}
		res.status(200).json({ message: 'Success', group });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

const updateGroupById = async (req, res) => {
	try {
		const groupId = req.params.id;
		const { title, type } = req.body;
		const group = await Fypgroup.findByIdAndUpdate(
			groupId,
			{ title, type },
			{ new: true }
		);
		if (!group) {
			return res.status(404).json({ message: 'Group not found' });
		}
		res.status(200).json({ message: 'Group updated', group });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

const leaveGroup = async (req, res) => {
	try {
		const studentId = req.user.id;
		console.log('Leaver:', studentId);
		const group = await Fypgroup.findOne({ studentsId: studentId }).populate(
			'studentsId'
		);
		if (!group) {
			return res.status(404).json({ message: 'Group not found' });
		}
		console.log(group);
		group.studentsId = group.studentsId.filter(
			(student) => student._id.toString() !== studentId
		);
		console.log(group);
		const student = await Student.findById(studentId);
		student.role = true;
		await student.save();
		await group.save();
		res.status(200).json({ message: 'Left group successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

export { findGroupByStudentId, updateGroupById, leaveGroup };
