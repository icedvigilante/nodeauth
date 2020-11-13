const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('errorhandler');
const PORT = 5000;

mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production'

const app = express();

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'passport-tutorial', cookie: {maxAge: 60000}, resave: false, saveUninitialized: false}));

if(!isProduction) {
    app.use(errorHandler());
}

// Mongoose Connect
mongoose.connect('mongodb://localhost/passport-tutorial', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('debug', true);

// error handler
if(!isProduction) {
    app.use((err, req, res) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}

app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});


app.listen(PORT, () => console.log("the server is running on http://localhost:" + PORT))