const express = require('express');
const bodyParser = require('body-parser');

const storage = require('../localMemory')

const auth = require('../auth/authenticateLocal')

const toDoListsRouter = express.Router();

toDoListsRouter.use(bodyParser.json());

toDoListsRouter
    .route("/")

    .get(auth.auth, (req, res, next) => {
        const lists = storage.toDoList.get(req.user.email)
        if(lists !== undefined) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(lists)
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json([])
        }
    })

    .put(auth.auth, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /toDoList');
    })

    .post(auth.auth, (req, res, next) => {
        const arrOfLists = storage.toDoList.get(req.user.email);
        if (arrOfLists !== undefined) {
            arrOfLists.push({
                _id: arrOfLists.length,
                name: req.body.name,
                description: req.body.description, // NU GO DO VLADA
                itemsArr: []
            });
            if (req.body.expiresAt) {
                const ttl = (Date.parse(req.body.expiresAt) - Date.now())/100
                storage.toDoList.set(req.user.email, arrOfLists, ttl)
            } else {
                storage.toDoList.set(req.user.email, arrOfLists)
            }
        } else {
            storage.toDoList.set(req.user.email, [{
                _id: 0,
                name: req.body.name,
                description: req.body.description,
                itemsArr: []
            }]);
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(storage.toDoList.get(req.user.email));
    })

    .delete(auth.auth, ( req, res, next) => {
        storage.toDoList.del(req.user.email);
        res.statusCode = 200;
        res.end('success');
    })

toDoListsRouter
    .route("/:listId")

    .get(auth.auth, (req, res, next) => {
        if (storage.toDoList.get(req.user.email) !== undefined) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            console.dir(storage.toDoList.get(req.user.email))
            res.json(storage.toDoList.get(req.user.email)[req.params.listId]);
        } else {
            res.statusCode = 404;
            res.end('Error searching list')
        }
    })

    .put(auth.auth, (req, res, next) => {
        const arrOfLists = storage.toDoList.get(req.user.email);
        if (arrOfLists !== undefined) {
            arrOfLists[req.params.listId].name = req.body.name;
            arrOfLists[req.params.listId].description = req.body.description;
            if (req.body.expiresAt) {
                const ttl = (Date.parse(req.body.expiresAt) - Date.now())/100
                storage.toDoList.set(req.user.email, arrOfLists, ttl)
            } else {
                storage.toDoList.set(req.user.email, arrOfLists)
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(storage.toDoList.get(req.user.email)[req.params.listId]);
        } else {
            res.statusCode = 404;
            res.end('Error searching list')
        }
    })

    .post(auth.auth, (req, res, next) => {
        const arrOfLists = storage.toDoList.get(req.user.email);
        if (arrOfLists !== undefined) {
            req.body._id = arrOfLists[req.params.listId].itemsArr.length
            req.body.done = false
            arrOfLists[req.params.listId].itemsArr.push(req.body);
            storage.toDoList.set(req.user.email, arrOfLists)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            console.dir(storage.toDoList.get(req.user.email)[req.params.listId])
            res.json(storage.toDoList.get(req.user.email)[req.params.listId]);
        } else {
            res.statusCode = 404;
            res.end('Error searching list')
        }
    })

    .delete(auth.auth, (req, res, next) => {
        const arrOfLists = storage.toDoList.get(req.user.email);
        if (arrOfLists !== undefined) {
            arrOfLists.splice(req.params.listId);
            storage.toDoList.set(req.user.email, arrOfLists);
            res.statusCode = 200;
            res.end('success');
        } else {
            res.statusCode = 404;
            res.end('Error searching list')
        }
    })

toDoListsRouter
    .route("/:listId/:itemId")

    .get(auth.auth, (req, res, next) => {
        if (storage.toDoList.get(req.user.email) !== undefined) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(storage.toDoList.get(req.user.email)[req.params.listId].itemsArr[req.params.itemId]);
        } else {
            res.statusCode = 404;
            res.end('Error searching list')
        }
    })

    .put(auth.auth, (req, res, next) => {
        const arrOfLists = storage.toDoList.get(req.user.email);
        if (arrOfLists !== undefined) {
            arrOfLists[req.params.listId].itemsArr[req.params.itemId].name = req.body.name;
            arrOfLists[req.params.listId].itemsArr[req.params.itemId].description = req.body.description;
            arrOfLists[req.params.listId].itemsArr[req.params.itemId].time = req.body.time;
            arrOfLists[req.params.listId].itemsArr[req.params.itemId].done = req.body.done;
            storage.toDoList.set(req.user.email, arrOfLists)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(arrOfLists[req.params.listId]);
        } else {
            res.statusCode = 404;
            res.end('Error searching list')
        }
    })

    .post(auth.auth, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /:listId/:itemId');
    })

    .delete(auth.auth, (req, res, next) => {
        const arrOfLists = storage.toDoList.get(req.user.email);
        if (arrOfLists !== undefined) {
            arrOfLists[req.params.listId].itemsArr.splice(req.params.itemId);
            res.statusCode = 200;
            res.end('success');
        } else {
            res.statusCode = 404;
            res.end('Error searching list')
        }
    })

module.exports = toDoListsRouter