const express = require('express');
const bodyParser = require('body-parser');

const storage = require('../localMemory')

const profileRouter = express.Router();

const auth = require('../auth/authenticateLocal')

profileRouter.use(bodyParser.json());

profileRouter
    .route("/")

    .get(auth.auth, (req, res, next) => {
        const user = storage.users.get(req.user.email)
        if (user !== undefined) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
        } else {
            res.statusCode = 404;
            res.end('Error searching user!');
        }
    })

    .put(auth.auth, (req, res, next) => {
        const user = storage.users.get(req.user.email)
        if (user !== undefined) {
            if(req.body.firstName) {
                user.firstName = req.body.firstName
            }
            if(req.body.lastName) {
                user.lastName = req.body.lastName
            }
            if(req.body.password) {
                user.password = req.body.password
            }
            storage.users.set(user.email, user);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
        } else {
            res.statusCode = 404;
            res.end('Error searching user!');
        }
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /profile');
    })

    .delete(auth.auth, (req, res, next) => {
        storage.users.del(req.user.email);
        if(storage.users.get(req.user.email) === undefined) {
            res.statusCode = 200;
            res.end('success');
        }
    })

module.exports = profileRouter