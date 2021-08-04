const express = require('express');
const bodyParser = require('body-parser');

const profileRouter = express.Router();

const User = require('../models/user');

profileRouter.use(bodyParser.json());

profileRouter
    .route("/")

    .get((req, res, next) => {
        User.findById(req.user._id)
            .then((user) => {
                user.password = '';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put((req, res, next) => {
        User.findByIdAndUpdate(req.user._id, req.body)
            .then((user) => {
                user.password = '';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /profile');
    })

    .delete((req, res, next) => {
        User.findByIdAndDelete(req.user._id)
            .then((user) => {
                res.statusCode = 200;
                res.end('Deleting successful!')
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = profileRouter