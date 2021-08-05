const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const profileRouterDB = require('./routesDB/profileRouter');
const toDoListsRouterDB = require('./routesDB/toDoListsRouter');
const usersRouterDB = require('./routesDB/usersRouter');

const profileRouterLocal = require('./routesLocal/profileRouter');
const toDoListsRouterLocal = require('./routesLocal/toDoListsRouter');
const usersRouterLocal = require('./routesLocal/usersRouter');

const mongoose = require('mongoose');

const config = require('./config');

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

if(config.memoryType === 'Persistent') {
    const url = config.mongoUrl;
    const connect = mongoose.connect(url);

    connect.then((db) => {
        console.log("Connected correctly to server!");
    }, (err) => {
        console.log(err);
    });
    app.use('/profile', profileRouterDB);
    app.use('/toDoLists', toDoListsRouterDB);
    app.use('/users', usersRouterDB);
} else {
    app.use('/profile', profileRouterLocal);
    app.use('/toDoLists', toDoListsRouterLocal);
    app.use('/users', usersRouterLocal);
}

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