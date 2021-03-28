const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: { type: String, required: true },
  yearReleased: { type: Date, required: true },
  genre: { type: String, required: true },
  // actors: [{actorName: {type: String, required: true}, characterName: {type: String, required: true}}]
  actors: {
    type: [Object],
   // minlength: 3,
    validate: [v => Array.isArray(v) && v.length >= 3, "You must inlude atleast 3 actors"]
  }

}, {
  timestamps: true,
  // typeKey: '$type'
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;