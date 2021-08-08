const express = require('express');
const bodyParser = require('body-parser');
const User = require("../models/user");

const auth = require('../auth/authenticateDB')

const ToDoList = require('../models/toDoList');

const toDoListsRouter = express.Router();

toDoListsRouter.use(bodyParser.json());

toDoListsRouter
    .route("/")

    .get(auth.auth, (req, res, next) => {
        ToDoList.find({user: req.user._id})
            .then((toDoLists) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(toDoLists);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(auth.auth, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /toDoList');
    })

    .post(auth.auth, (req, res, next) => {
        console.dir(req.body)
        ToDoList.create({
            name: req.body.name,
            description: req.body.description,
            user: req.user._id,
            expiresAt: req.body.expiresAt
        })
            .then((toDoList) => {
                console.log('list Created ', toDoList);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(toDoList);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(auth.auth, ( req, res, next) => {
        ToDoList.findByIdAndRemove({})
            .then((user) => {
                res.statusCode = 200;
                res.end('Deleting successful!')
            }, (err) => next(err))
            .catch((err) => next(err));
    })

toDoListsRouter
    .route("/:listId")

    .get(auth.auth, (req, res, next) => {
        ToDoList.findById(req.params.listId)
            .then((toDoList) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(toDoList);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(auth.auth, (req, res, next) => {
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

    .post(auth.auth, (req, res, next) => {
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

    .delete(auth.auth, (req, res, next) => {
        ToDoList.findByIdAndRemove(req.params.listId)
            .then((todolist) => {
                res.statusCode = 200;
                res.end('Deleting successful!')
            }, (err) => next(err))
            .catch((err) => next(err));
    })

toDoListsRouter
    .route("/:listId/:itemId")

    .get(auth.auth, (req, res, next) => {
        ToDoList.findById(req.params.listId)
            .then((toDoList) => {
                //res.json(toDoList.itemsArr._id(req.params.itemId));
                let i;
                toDoList.itemsArr.map((elem, index) => {
                    if (elem._id.toString() === req.params.itemId){
                        i = index
                    }
                })
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(toDoList.itemsArr[i]);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(auth.auth, (req, res, next) => {
        ToDoList.findById(req.params.listId)
            .then((toDoList) => {
                let i;
                toDoList.itemsArr.map((elem, index) => {
                    if (elem._id.toString() === req.params.itemId){
                        i = index
                    }
                })
                if (req.body.name) toDoList.itemsArr[i].name = req.body.name
                if (req.body.description) toDoList.itemsArr[i].description = req.body.description
                if (req.body.time) toDoList.itemsArr[i].time = req.body.time
                if (!req.body.done.isNull) toDoList.itemsArr[i].done = req.body.done
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

    .post(auth.auth, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /:listId/:itemId');
    })

    .delete(auth.auth, (req, res, next) => {
        ToDoList.findById(req.params.listId)
            .then((toDoList) => {
                //toDoList.itemsArr._id(req.params.itemId).remove();
                let i;
                toDoList.itemsArr.map((elem, index) => {
                    if (elem._id.toString() === req.params.itemId){
                        i = index
                    }
                })
                toDoList.itemsArr.splice(i, 1)
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

module.exports = toDoListsRouter