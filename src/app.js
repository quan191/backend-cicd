const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('./config/init');
const morgan = require('./config/morgan');
const routes = require('./routes');
const {errorConverter, errorHandler} = require('./middlewares/error');
const AppError = require('./utils/AppError');

const app = express();

if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(xss());

app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
// app.options('kawaii-islands.airight.io', cors());

app.use(routes);

app.use((req, res, next) => {
    next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to AppError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;

