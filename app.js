<<<<<<< HEAD
const express = require('express');
// const session = require("express-session");
// const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require('cors');
=======
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
>>>>>>> 20e5ebb6281b9ef3a69d3a2a10718caa81f8d2d6

const mongoose = require("mongoose");
const User = require("./models/user");
const Task = require("./models/task");
require("dotenv").config();

const PORT = 3005;
MONGOSE_URI = process.env.MONGO_URI;

let listOfOnGoingTasks = [];
let listOfDoneOrFaildTasks = [];

const app = express();
<<<<<<< HEAD
// const store = new MongoDBStore({
// 	uri: MONGOSE_URI,
// 	collection: "sessions",
// })
=======
const store = new MongoDBStore({
	uri: MONGOSE_URI,
	collection: "sessions",
});
>>>>>>> 20e5ebb6281b9ef3a69d3a2a10718caa81f8d2d6

let corsOptions = {
	origin: ["http://localhost:3000", MONGOSE_URI],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
<<<<<<< HEAD
// app.use(
// 	session({
// 		secret: "my secret",
// 		resave: false,
// 		saveUninitialized: false,
// 		store: store
// 	})
// );

////// WE DONT NEED SESSIONS ! ////////////

// app.use((req, res, next) => {
//     console.log(req.session.user)
// 	if (!req.session.user) {
// 		return next();
// 	};
//     User.findById(req.session.user._id)
// 		.then((user) => {
//             req.user = user;
//             // console.log(req.user)
//             // console.log(req.session.user)
// 			next()
//     }).catch((err) => console.log(err));
// });

// CONNECT TO THE MONGODB DATABASE
mongoose
	.connect(MONGOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		app.listen(PORT);
	})
	.catch((err) => {
		console.log(err);
	});

// POSTS REQUESTS

app.post('/signin', async (req, res) => {
    // from frontend is passed username and password
    User.findOne({email: req.body.email})
    // if user doesnt exist it will create new one
        .then(async user => {
            // req.session.user = user;
            // console.log(req.user)
            if (user === null) {
                User.create({ 
                    email: req.body.email,
                    password: req.body.password,
                    username: req.body.username,
                    tasks: [],
                }, (err) => {
                if (err) console.log(err);
                });
                const user = await User.findOne({ email: req.body.email });
                res.json({ note: 'created', userId: user.id });
            } else {
                // if user password doesnt match it will response wrong password else it will loged the user
                if (user.password === req.body.password) {
                    res.json({ note: 'loged', userId: user.id })

                } else {
                    res.json({ note: 'wrong password' })
                }   
            }        
    })

});

app.post("/add-task", async (req, res, next) => {
    listOfOnGoingTasks = [];
    listOfDoneOrFaildTasks = [];
    const description = req.body.description;
    const duration = req.body.duration;
    // console.log(description, duration)
    const task = new Task({
        description: description,
        duration: new Date().getTime() + (duration * 24 * 3600000),
        done: false,
        userId: req.body.userId,
    })
    task
        .save()
        .then(async () => {
            const tasks = await Task.find({ userId: req.body.userId });
            tasks.forEach(task => {
                if (task.done === true || task.duration < new Date().getTime()) {
                    // console.log("done or expired");
                    listOfDoneOrFaildTasks.push(task)
                } else {
                    // console.log("not done tasks or nonexpored");
                    listOfOnGoingTasks.push(task)
                }
                
            })
            res.json({ listOfOnGoingTasks, listOfDoneOrFaildTasks });
        })
        .catch(err => console.log(err))
});

app.post("/fetch-tasks", async (req, res, next) => {
    listOfOnGoingTasks = [];
    listOfDoneOrFaildTasks = [];
    // const user = req.session.user;
    const tasks = await Task.find({ userId: req.body.userId });
    tasks.forEach(task => {
        if (task.done === true || task.duration < new Date().getTime()) {
            // console.log("done or expired");
            listOfDoneOrFaildTasks.push(task)
        } else {
            // console.log("not done tasks or nonexpored");
            listOfOnGoingTasks.push(task)
        }
        
    })
    res.json({ listOfOnGoingTasks, listOfDoneOrFaildTasks });
});

app.post("/done", async (req, res, next) => {
    Task.findById(req.body.taskId)
    .then(task => {
        task.done = !task.done;
        return task.save();
    })
    .then(result => {
        // console.log("changed")
        res.json({note: "success"})
    }).catch(err => console.log(err));
=======
app.use(
	session({
		secret: "my secret",
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});

app.post("/signin", async (req, res) => {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	// from frontend is passed username and password
	User.findOne({ email: email })
		// if user doesnt exist it will create new one
		.then((user) => {
			if (user === null) {
				User.create(
					{
						username: username,
						email: email,
						password: password,
						tasks: { tasks: [] },
					},
					(err) => {
						if (err) console.log(err);
					}
				);
				res.json({ note: "created" });
			} else {
				// if user password doesnt match it will response wrong password else it will loged the user
				if (user.password === req.body.password) {
					res.json({ note: "loged" });
				} else {
					res.json({ note: "wrong password" });
				}
			}
		});
});

app.post("/add-task", async (req, res, next) => {
	listOfOnGoingTasks = [];
	listOfDoneOrFaildTasks = [];
	const description = req.body.description;
	const duration = req.body.duration;
	const user_id = "612d2352062cf0331cf296b2";
	const task = new Task({
		description: description,
		duration: new Date().getTime() + duration * 24 * 3600000,
		done: false,
		userId: user_id,
	});
	task.save()
		.then(async () => {
			const tasks = await Task.find({
				userId: user_id,
			});
			tasks.forEach((task) => {
				if (
					task.done === true ||
					task.duration < new Date().getTime()
				) {
					listOfDoneOrFaildTasks.push(task);
				} else {
					listOfOnGoingTasks.push(task);
				}
			});
			res.json({ listOfOnGoingTasks, listOfDoneOrFaildTasks });
		})
		.catch((err) => console.log(err));
});

app.post("/fetch-tasks", async (req, res, next) => {
	listOfOnGoingTasks = [];
	listOfDoneOrFaildTasks = [];
	const user_id = "612d2352062cf0331cf296b2";
	const tasks = await Task.find({ userId: user_id });
	tasks.forEach((task) => {
		if (task.done === true || task.duration < new Date().getTime()) {
			listOfDoneOrFaildTasks.push(task);
		} else {
			listOfOnGoingTasks.push(task);
		}
	});
	res.json({ listOfOnGoingTasks, listOfDoneOrFaildTasks });
});

app.post("/done", async (req, res, next) => {
	const idOfTaskToChange = req.body.done;
	console.log(req.body.done);
	Task.findById(idOfTaskToChange)
		.then((task) => {
			task.done = !task.done;
			return task.save();
		})
		.then((result) => {
			console.log("changed");
			res.json({ note: "Good job!" });
		})
		.catch((err) => console.log(err));
>>>>>>> 20e5ebb6281b9ef3a69d3a2a10718caa81f8d2d6
});

mongoose
	.connect(MONGOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		app.listen(PORT);
	})
	.catch((err) => {
		console.log(err);
	});
