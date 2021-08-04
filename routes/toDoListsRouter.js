const express = require('express');
const bodyParser = require('body-parser');

const toDoListsRouter = express.Router();

toDoListsRouter.use(bodyParser.json());

toDoListsRouter
    .route("/")
    .get()
    .put()
    .post()
    .delete()

toDoListsRouter
    .route("/:userId")
    .get()
    .put()
    .post()
    .delete()

module.exports = toDoListsRouter