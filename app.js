const express = require('express');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require('cors');

const mongoose = require('mongoose');
const User = require('./models/user');
const Task = require('./models/task');
require('dotenv').config()

const PORT = 3005;
MONGOSE_URI = process.env.MONGO_URI;

const app = express();
const store = new MongoDBStore({
	uri: MONGOSE_URI,
	collection: "sessions",
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: "my secret",
		resave: false,
		saveUninitialized: false,
		store: store
	})
);

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	};
    User.findById(req.session.user._id)
		.then((user) => {
            req.user = user;
            console.log(req.user)
            console.log(req.session.user)
			next()
    }).catch((err) => console.log(err));
});


mongoose
	.connect(MONGOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		app.listen(PORT);
	})
	.catch((err) => {
		console.log(err);
	});

app.post('/signin', async (req, res) => {
    // from frontend is passed username and password
    User.findOne({email: req.body.username})
    // if user doesnt exist it will create new one
        .then(user => {
            req.session.user = user;
            console.log(req.user)
            if (user === null) {
                User.create({ 
                    email: req.body.username,
                    password: req.body.password,
                    tasks: []
                }, (err) => {
                if (err) console.log(err);
                });
                res.json({ note: 'created' });
            } else {
                // if user password doesnt match it will response wrong password else it will loged the user
                if (user.password === req.body.password) {
                    res.json({ note: 'loged' })

                } else {
                    res.json({ note: 'wrong password' })
                }   
            }        
    })

});

app.post("/add-task", async (req, res, next) => {
    const description = req.body.description;
    const duration = req.body.duration;
    console.log(description, duration)
    const task = new Task({
        description: description,
        duration: new Date().getTime() + (duration * 24 * 3600000),
        done: false,
        userId: "61253b20f83af946946bdfd0"
    })
    task
        .save()
        .then(() => {
            res.json({ note:"task created "})
        })
        .catch(err => console.log(err))
});

app.post("/fetch-tasks", async (req, res, next) => {
    const user = req.session.user;
    const tasks = await Task.find( {userId: "61253b20f83af946946bdfd0"} );
    console.log(tasks)
    console.log("backend")
    if (tasks !== null) {
        res.json({ tasks: tasks })
    }
});