const express = require('express');
const bodyParser = require('body-parser');

const User = require('../models/user');

const auth = require('../auth/authenticateDB');
const ToDoList = require("../models/toDoList");

const usersRouter = express.Router();

usersRouter.use(bodyParser.json());

usersRouter
    .route("/")
    .get(auth.auth, auth.isAdmin, (req, res, next) => {
        User.find({})
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /users');
    })
    .post((req, res, next) => {
        console.dir(req.body)
        User.create(req.body)
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(auth.auth, auth.isAdmin, (req, res, next) => {
        User.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.end('Success!');
            }, (err) => next(err))
            .catch((err) => next(err));
    })

usersRouter.post('/auth', auth.auth, (req, res, next) => {
    console.log('response est`')
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.user);
})

usersRouter
    .route("/:userId")
    .get(auth.auth, auth.isAdmin, (req, res, next) => {
        User.findById(req.params.userId)
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(auth.auth, auth.isAdmin, (req, res, next) => {
        User.findByIdAndUpdate(req.params.userId, req.body)
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(auth.auth, auth.isAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /profile');
    })

    .delete(auth.auth, auth.isAdmin, (req, res, next) => {
        User.findByIdAndDelete(req.params.userId)
            .then((user) => {
                res.statusCode = 200;
                res.end('Deleting successful!')
            }, (err) => next(err))
            .catch((err) => next(err));
    })

usersRouter
    .route("/:userId/lists")

    .get(auth.auth, auth.isAdmin, (req, res, next) => {
        ToDoList.find({
            user: req.params.userId
        })
            .then((toDoList) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(toDoList);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(auth.auth, auth.isAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /users');
    })

    .post(auth.auth, auth.isAdmin, (req, res, next) => {
        ToDoList.create({
            name: req.body.name,
            description: req.body.description,
            user: req.params.userId
        })
            .then((toDoList) => {
                console.log('list Created ', toDoList);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(toDoList);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(auth.auth, auth.isAdmin, (req, res, next) => {
        ToDoList.remove({
            user: req.params.userId
        })
            .then((toDoList) => {
                res.statusCode = 200;
                res.end('Deleting successful!');
            }, (err) => next(err))
            .catch((err) => next(err));
    })

usersRouter
    .route("/:userId/lists/:listId")

    .get(auth.auth, auth.isAdmin, (req, res, next) => {
        ToDoList.findById(req.params.listId)
            .then((toDoList) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(toDoList);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(auth.auth, auth.isAdmin, (req, res, next) => {
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

    .post(auth.auth, auth.isAdmin, (req, res, next) => {
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

    .delete(auth.auth, auth.isAdmin, (req, res, next) => {
        User.findByIdAndDelete(req.params.listId)
            .then((user) => {
                res.statusCode = 200;
                res.end('Deleting successful!')
            }, (err) => next(err))
            .catch((err) => next(err));
    })

usersRouter
    .route("/:userId/lists/:listId/:itemId")

    .get(auth.auth, auth.isAdmin, (req, res, next) => {
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
                }*/
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(auth.auth, auth.isAdmin, (req, res, next) => {
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

    .post(auth.auth, auth.isAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /:listId/:itemId');
    })

    .delete(auth.auth, auth.isAdmin, (req, res, next) => {
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

module.exports = usersRouter