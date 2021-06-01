const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/moviesdb';
const mongoObject = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

module.exports = { mongoUrl, mongoObject };
