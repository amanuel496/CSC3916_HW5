const router = require('express').Router();
let Movie = require('../models/movie.model');
let Review = require('../models/review');
var authJwtController = require('./auth_jwt.js');

router.route('/').get((req, res) => {
    console.log(req.query.review)

    if (req.query.review) {
        console.log("this is inside the if");
        Movie.aggregate([
            {
                $lookup: {
                    from: "reviews",
                    localField: "title",
                    foreignField: "movie",
                    as: "review"
                }
            }
        ]).exec((err, result) => {
            if (err) {
                res.status(400).json('Error: ' + err);

            } else {
                res.send({Movielist: result});
            }
        });
    }
    else {
        console.log("this is inside the else");
        // Movie.find({}, function (err, movies) {
        //     if (err) throw {err: err};
        //     res.send({Movielist: movies})
        // })

        Movie.find()
            .then(movies => res.json(movies))
            .catch(err => res.status(400).json('Error: ' + err));
    }
});

router.route('/').post(authJwtController.isAuthenticated, (req, res) => {
    const title = req.body.title;
    const yearReleased = req.body.yearReleased;
    const genre = req.body.genre;
    const actors =  req.body.actors;

    const newMovie = new Movie({
        title,
        yearReleased,
        genre,
        actors
    });
    newMovie.save()
        .then(() => res.json('Movie added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:title').get(authJwtController.isAuthenticated, (req, res) => {
    Movie.find({title: req.params.title})
        .then(movie => {
            if (movie.length === 0)
            {
                res.status(400).json("Movie doesn't exist")
            }
            else {
                res.json(movie);
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
    // console.log("this is inside the title")
    // console.log(req.params.title);
});

router.route('/').delete(authJwtController.isAuthenticated, (req, res) => {
    Movie.deleteOne({title: req.body.title})
        .then(() => res.json('Movie deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').put(authJwtController.isAuthenticated, (req, res) => {
    Movie.find({title: req.body.title})
        .then(movie => {
            newMovie = new Movie({
                title: req.body.title,
                yearReleased: req.body.yearReleased,
                genre: req.body.genre,
                actors: req.body.actors
            });
            newMovie.save()
                .then(() => res.json('Movie updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
            Movie.deleteOne({title: req.body.title})
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;