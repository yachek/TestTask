const express = require('express');
const bodyParser = require('body-parser');

const profileRouter = express.Router();

const auth = require('../auth/authenticateDB')

const User = require('../models/user');

profileRouter.use(bodyParser.json());

profileRouter
    .route("/")

    .get(auth.auth, (req, res, next) => {
        User.findById(req.user._id)
            .then((user) => {
                user.password = '';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(auth.auth, (req, res, next) => {
        User.findByIdAndUpdate(req.user._id, {
            $set: req.body
        })
            .then((user) => {
                user.password = '';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(auth.auth, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /profile');
    })

    .delete(auth.auth, (req, res, next) => {
        User.findByIdAndDelete(req.user._id)
            .then((user) => {
                res.statusCode = 200;
                res.end('Success!')
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = profileRouter