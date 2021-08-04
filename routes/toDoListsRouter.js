const express = require('express');
const bodyParser = require('body-parser');
const User = require("../models/user");

const ToDoList = require('../models/toDoList');

const toDoListsRouter = express.Router();

toDoListsRouter.use(bodyParser.json());

toDoListsRouter
    .route("/")

    .get((req, res, next) => {
        ToDoList.find({user: req.user._id})
            .then((toDoLists) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(toDoLists);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /toDoList');
    })

    .post((req, res, next) => {
        ToDoList.create({
            name: req.body.name,
            description: req.body.description,
            user: req.user._id
        })
            .then((toDoList) => {
                console.log('list Created ', toDoList);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(toDoList);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(( req, res, next) => {
        ToDoList.findByIdAndDelete(req.body._id)
            .then((user) => {
                res.statusCode = 200;
                res.end('Deleting successful!')
            }, (err) => next(err))
            .catch((err) => next(err));
    })

toDoListsRouter
    .route("/:listId")

    .get((req, res, next) => {
        ToDoList.findById(req.params.listId)
            .then((toDoList) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(toDoList);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put((req, res, next) => {
        ToDoList.findByIdAndUpdate(req.params.listId, {
            $set: req.body
        })
            .then((toDoList) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(toDoList);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post((req, res, next) => {
        ToDoList.findById(req.params.listId)
            .then((toDoList) => {
                toDoList.itemsArr.push(req.body);
                toDoList.save()
                    .then((toDoList) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(toDoList);
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete((req, res, next) => {
        User.findByIdAndDelete(req.params.listId)
            .then((user) => {
                res.statusCode = 200;
                res.end('Deleting successful!')
            }, (err) => next(err))
            .catch((err) => next(err));
    })
/*
toDoListsRouter
    .route("/:listId/:itemId")

    .get((req, res, next) => {
        ToDoList.findById(req.params.listId)
            .then((toDoList) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(toDoList.itemsArr._id(req.params.itemId));
                /*for(let i in toDoList.itemsArr) {
                    if (i._id === req.params.itemId) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(i);
                        break;
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put((req, res, next) => {
        ToDoList.findById(req.params.listId)
            .then((toDoList) => {
                toDoList.itemsArr._id(req.params.itemId).name = req.body.name;
                toDoList.itemsArr._id(req.params.itemId).description = req.body.description;
                toDoList.itemsArr._id(req.params.itemId).time = req.body.time;
                toDoList.save()
                    .then((toDoList) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(toDoList);
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /:listId/:itemId');
    })

    .delete((req, res, next) => {
        ToDoList.findById(req.params.listId)
            .then((toDoList) => {
                toDoList.itemsArr._id(req.params.itemId).remove();
                toDoList.save()
                    .then((toDoList) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(toDoList);
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    })
*/
module.exports = toDoListsRouter