const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: 'https://avatars.mds.yandex.net/get-pdb/4477580/46906ff3-b2d5-4d1d-af98-f5a9349d75ee/s1200',
  },
  trailer: {
    type: String,
    required: true,

  },
  thumbnail: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
  },
});

module.exports = mongoose.model('movie', movieSchema);
