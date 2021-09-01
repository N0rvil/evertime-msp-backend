const mongoose = require("mongoose");
const { Schema } = mongoose;

const user = new mongoose.Schema({
<<<<<<< HEAD
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: [
    {
      task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
      },
      done: { type: Boolean, required: true }
      }
    
  ]
  
  });
=======
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
>>>>>>> 20e5ebb6281b9ef3a69d3a2a10718caa81f8d2d6

const User = mongoose.model("User", user);

module.exports = User;
