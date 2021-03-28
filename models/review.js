const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  movie: { type: String, required: true },
  nameOfReviewer: { type: String, required: true },
  quote: { type: String, required: true },
  rating: { type: Number, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);