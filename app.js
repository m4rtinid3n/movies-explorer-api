require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('./utils/limiter');

const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { mongoUrl, mongoObject } = require('./utils/mongo');
const { appListen } = require('./utils/answers');

const { PORT = 4000 } = process.env;
const app = express();

mongoose.connect(mongoUrl, mongoObject);

app.use(cors());
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(appListen, PORT);
});
