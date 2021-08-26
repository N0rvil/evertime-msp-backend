const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const Task = require('./models/task');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.log(error));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
const PORT = 3005;

app.listen(PORT, ()=> {
  console.log('server started')
});

app.post('/signin', async (req, res) => {
    // from frontend is passed username and password
    User.findOne({email: req.body.username})
    // if user doesnt exist it will create new one
        .then(user => {
            req.user = user;
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
    console.log(req.user)
    const task = new Task({
        description: description,
        duration: new Date().getTime() + (duration * 24 * 3600000),
        done: false,
        userId: "61253b20f83af946946bdfd0"
    })
    task
        .populate('userId')
        .execPopulate()
        .save()
        .then(() => {
            res.json({ note:"task created "})
        })
        .catch(err => console.log(err))
});

app.post("/fetch-tasks", async (req, res, next) => {
    const user = req.body.userId;
    const tasks = await Task.find();
    console.log(tasks)
    console.log("backend")
    if (tasks !== null) {
        res.json({ tasks: tasks })
    }
});