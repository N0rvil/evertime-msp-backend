const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
	description: { type: String, required: true },
	duration: { type: Number, required: true },
	done: { type: Boolean, required: false },
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
	}
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
