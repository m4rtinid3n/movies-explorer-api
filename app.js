require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { limiter } = require('./utils/limiter');
const { apiLogger, errLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const errorServer = require('./errors/ErrorServer');
const mongoDbLocal = require('./utils/config');

const { PORT = 3000 } = process.env;
const app = express();

const mongoDB = process.env.NODE_ENV === 'production' ? process.env.MONGO_URL : mongoDbLocal;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const allowedCors = [
  'https://api.m4rtinid3n.movies.nomoredomains.icu',
  'https://m4rtinid3n.movies.nomored.nomoredomains.icu',
  'http://api.m4rtinid3n.movies.nomoredomains.icu',
  'http://m4rtinid3n.movies.nomored.nomoredomains.icu',
  'http://localhost:3001',
  'http://localhost:3000',
];
const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 204,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
};

app.use(apiLogger);
app.use(limiter);
app.use('*', cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.use(errLogger);
app.use(errors());
app.use(errorServer);

app.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});
