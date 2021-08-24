const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).
catch(error => handleError(error));

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
    const user = await User.findOne({username: req.body.username});
    // if user doesnt exist it will create new one
    if (user === null) {
        User.create({ 
            username: req.body.username,
            password: req.body.password,
          }, (err) => {
        if (err) return handleError(err);
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
});