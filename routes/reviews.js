const router = require('express').Router();
let Review = require('../models/review');
let Movie = require('../models/movie.model');
var authJwtController = require('./auth_jwt.js');
var jwt = require('jsonwebtoken');

router.route('/').get(authJwtController.isAuthenticated, (req, res) => {
    Review.find()
        .then(reviews => res.json(reviews))
        .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/').post((req, res) => {
//     const movie = req.body.movie;
//     const nameOfReviewer = req.body.nameOfReviewer;
//     const quote = req.body.quote;
//     const rating =  req.body.rating;
//
//     const newReview = new Review({
//         movie,
//         nameOfReviewer,
//         quote,
//         rating
//     });
//     newReview.save()
//         .then(() => res.json('Review added!'))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

router.route('/').post(authJwtController.isAuthenticated, (req, res) => {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], process.env.SECRET_KEY);
    console.log(decoded);

    Movie.find({_id: req.body.movie})
        .then(movie => {
            if (movie.length === 0)
            {
                res.status(400).json("Movie doesn't exist")
            }
            else {
                const movie = req.body.movie;
                const nameOfReviewer = decoded.name;
                const quote = req.body.quote;
                const rating =  req.body.rating;
                const newReview = new Review({
                    movie,
                    nameOfReviewer,
                    quote,
                    rating
                });
                newReview.save()
                    .then(() => res.json('Review added!'))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));


});

// router.route('/:title').get(authJwtController.isAuthenticated, (req, res) => {
//     Movie.find({title: req.params.title})
//         .then(movie => res.json(movie))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// router.route('/').delete(authJwtController.isAuthenticated, (req, res) => {
//     Movie.deleteOne({title: req.body.title})
//         .then(() => res.json('Movie deleted.'))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// router.route('/').put(authJwtController.isAuthenticated, (req, res) => {
//     Movie.find({title: req.body.title})
//         .then(movie => {
//             newMovie = new Movie({
//                 title: req.body.title,
//                 yearReleased: req.body.yearReleased,
//                 genre: req.body.genre,
//                 actors: req.body.actors
//             });
//             newMovie.save()
//                 .then(() => res.json('Movie updated!'))
//                 .catch(err => res.status(400).json('Error: ' + err));
//             Movie.deleteOne({title: req.body.title})
//         })
//         .catch(err => res.status(400).json('Error: ' + err));
// });

module.exports = router;
