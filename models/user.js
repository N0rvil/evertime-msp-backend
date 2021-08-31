const mongoose = require("mongoose");
const { Schema } = mongoose;

const user = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	score: {
		type: Number,
		required: false,
	},
	checkBoard: {
		tasks: [
			{
				task: {
					type: Schema.Types.ObjectId,
					ref: "Task",
					required: true,
				},
				done: { type: Boolean, required: true }
			},
		],
	},
});

const User = mongoose.model("User", user);

module.exports = User;
