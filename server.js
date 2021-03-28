/*
CSC3916 HW4
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
//var authController = require('./auth');
// var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var Review = require('./models/review');

const mongoose = require('mongoose');
require('dotenv').config();

let Movie;
Movie = require('./models/movie.model');



var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();



const uri = process.env.ATLAS_URI;

mongoose.Promise = global.Promise;

//mongoose.connect(process.env.DB, { useNewUrlParser: true });
try {
    mongoose.connect( process.env.ATLAS_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}
mongoose.set('useCreateIndex', true);

const moviesRouter = require('./routes/movies');
const usersRouter = require('./routes/users');
const reviewsRouter = require('./routes/reviews');
//const path = require("path");

// app.use(express.static(path.join(__dirname, 'build')));


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
app.use('/movies', moviesRouter);
app.use('/users', usersRouter);
app.use('/reviews', reviewsRouter);

// app.use(express.static(path.join(__dirname, 'build')));


// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


