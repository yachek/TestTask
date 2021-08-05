const express = require('express');
const bodyParser = require('body-parser');

const auth = require('../auth/authenticateLocal');

const storage = require('../localMemory')

const usersRouter = express.Router();

usersRouter.use(bodyParser.json());

usersRouter
    .route("/")
    .get((req, res, next) => {
        const users = []
        const keys = storage.users.keys()
        for (let key in keys) {
            users.push(storage.users.get(key));
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /users');
    })
    .post((req, res, next) => {
        console.log(req.body)
        const stats = storage.users.getStats()
        console.log(stats)
        req.body._id = stats.keys;
        storage.users.set(req.body.email, req.body)
        if (storage.users.get(req.body.email) === undefined) {
            res.statusCode = 500;
            res.end('Error in adding new user!');
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(storage.users.get(req.body.email));
        }
    })
    .delete((req, res, next) => {
        storage.users.flushAll();
        res.statusCode = 200;
        res.end('success');
    })

usersRouter
    .route("/:userId")

    .get((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            if (storage.users.get(key)._id === req.params.userId) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(storage.users.get(key));
                found = true;
                break;
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching user!');
        }
    })

    .put((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            const user = storage.users.get(key)
            if (user._id === req.params.userId) {
                if (req.body.firstName) {
                    user.firstName = req.body.firstName
                }
                if (req.body.lastName) {
                    user.lastName = req.body.lastName
                }
                if (req.body.password) {
                    user.password = req.body.password
                }
                storage.users.set(user.email, user);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
                break;
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching user!');
        }
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /profile');
    })

    .delete((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            const user = storage.users.get(key)
            if (user._id === req.params.userId) {
                storage.users.del(user.email);
                res.statusCode = 200;
                res.end(user);
                found = true;
                break;
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching user!');
        }
    })

usersRouter
    .route("/:userId/lists")

    .get((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            const user = storage.users.get(key)
            if (user._id === req.params.userId) {
                if (storage.toDoList.get(user.email) !== undefined) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(storage.toDoList.get(user.email));
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching lists!');
        }
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /users');
    })

    .post((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            const user = storage.users.get(key)
            if (user._id === req.params.userId) {
                const arrOfLists = storage.toDoList.get(user.email);
                if (arrOfLists !== undefined) {
                    arrOfLists.push({
                        _id: arrOfLists.length,
                        name: req.body.name,
                        description: req.body.description,
                        items: []
                    });
                } else {
                    storage.toDoList.set(user.email, [{
                        _id: 0,
                        name: req.body.name,
                        description: req.body.description,
                        items: []
                    }]);
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(storage.toDoList.get(user.email));
                found = true;
                break;
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching user!');
        }
    })

    .delete((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            const user = storage.users.get(key)
            if (user._id === req.params.userId) {
                storage.toDoList.del(user.email);
                res.statusCode = 200;
                res.end('success');
                found = true;
                break;
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching lists!');
        }
    })

usersRouter
    .route("/:userId/lists/:listId")

    .get((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            const user = storage.users.get(key)
            if (user._id === req.params.userId) {
                if (storage.toDoList.get(user.email) !== undefined) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(storage.toDoList.get(user.email)[req.params.listId]);
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching lists!');
        }
    })

    .put((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            const user = storage.users.get(key)
            if (user._id === req.params.userId) {
                const arrOfLists = storage.toDoList.get(user.email);
                if (arrOfLists !== undefined) {
                    arrOfLists[req.params.listId] = req.body;
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(storage.toDoList.get(user.email)[req.params.listId]);
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching lists!');
        }
    })

    .post((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            const user = storage.users.get(key)
            if (user._id === req.params.userId) {
                const arrOfLists = storage.toDoList.get(user.email);
                if (arrOfLists !== undefined) {
                    req.body._id = arrOfLists[req.params.listId].items.length
                    arrOfLists[req.params.listId].items.push(req.body);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(storage.toDoList.get(user.email)[req.params.listId]);
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching lists!');
        }
    })

    .delete((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            const user = storage.users.get(key)
            if (user._id === req.params.userId) {
                const arrOfLists = storage.toDoList.get(user.email);
                if (arrOfLists !== undefined) {
                    arrOfLists[req.params.listId].splice(req.params.listId);
                    res.statusCode = 200;
                    res.end('success');
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching lists!');
        }
    })

usersRouter
    .route("/:userId/lists/:listId/:itemId")

    .get((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            const user = storage.users.get(key)
            if (user._id === req.params.userId) {
                if (storage.toDoList.get(user.email) !== undefined) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(storage.toDoList.get(user.email)[req.params.listId].items[req.params.itemId]);
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching lists!');
        }
    })

    .put((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            const user = storage.users.get(key)
            if (user._id === req.params.userId) {
                const arrOfLists = storage.toDoList.get(user.email);
                if (arrOfLists !== undefined) {
                    arrOfLists[req.params.listId].items[req.params.itemId] = req.body;
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(arrOfLists[req.params.listId].items[req.params.itemId]);
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching lists!');
        }
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /:listId/:itemId');
    })

    .delete((req, res, next) => {
        let found = false;
        const keys = storage.users.keys()
        for (let key in keys) {
            const user = storage.users.get(key)
            if (user._id === req.params.userId) {
                const arrOfLists = storage.toDoList.get(user.email);
                if (arrOfLists !== undefined) {
                    arrOfLists[req.params.listId].items.splice(req.params.itemId);
                    res.statusCode = 200;
                    res.end('success');
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            res.statusCode = 404;
            res.end('Error searching lists!');
        }
    })

module.exports = usersRouter