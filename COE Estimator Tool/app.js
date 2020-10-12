const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://dbadmin:dbadmin@cluster0.jqunl.mongodb.net/coeEstimator?retryWrites=true&w=majority', {
    useNewUrlParser: true
});
//Routes to Handle Request
const productRoutes = require('./api/routes/products');
const coeEstimator = require('./api/routes/coeEstimator');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', "GET,POST");
        return res.status(200).json();
    }
    next();
});

app.use('/coeEstimator', coeEstimator)

app.use((req, res, next) => {
    const error = new Error('API Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status = error.status || 500;
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;