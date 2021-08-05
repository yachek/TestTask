const storage = require('../localMemory')

exports.auth = (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        const err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
        return;
    }

    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
    if (storage.users.has(user)) {
        const userLocal = storage.users.get(user);
        if (userLocal.password === pass) {
            req.user = userLocal
            next()
        } else {
            next(new Error('You are not authorization!1'))
        }
    } else {
        next(new Error('You are not authorization!2'))
    }
}

exports.isAdmin = (req, res, next) => {
    if(!req.user) {
        next(new Error('You are not authorization!'))
    } else if(!req.user.isAdmin) {
        next(new Error('You have no rights to perform this operation!'))
    } else {
        next()
    }
}