const express = require('express');
const bodyParser = require('body-parser');

const User = require('../models/user');

const authenticate = require('../authenticate');

const usersRouter = express.Router();

usersRouter.use(bodyParser.json());

usersRouter
    .route("/")
    .get()
    .put()
    .post()
    .delete()

usersRouter
    .route("/:userId")
    .get()
    .put()
    .post()
    .delete()

module.exports = usersRouter