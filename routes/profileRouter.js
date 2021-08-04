const express = require('express');
const bodyParser = require('body-parser');

const profileRouter = express.Router();

profileRouter.use(bodyParser.json());

profileRouter
    .route("/")
    .get()
    .put()
    .post()
    .delete()

module.exports = profileRouter