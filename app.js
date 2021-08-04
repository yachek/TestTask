const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const authenticate = require('./authenticate');

const profileRouter = require('./routes/profileRouter');
const toDoListsRouter = require('./routes/toDoListsRouter');
const usersRouter = require('./routes/usersRouter');

const mongoose = require('mongoose');

const config = require('./config');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server!");
}, (err) => {
    console.log(err);
});

const app = express();

app.all('*', (req, res, next) => {
    if (req.secure) {
        return next();
    }
    else {
        res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
    }
});

app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/profile', profileRouter);
app.use('/toDoLists', toDoListsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;