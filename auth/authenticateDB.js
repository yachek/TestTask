const User = require('../models/user');
const CryptoAES = require('crypto-js/aes')
const CryptoENC = require('crypto-js/enc-utf8');

exports.auth = (req, res, next) => {
    //console.log(req.headers);
    /*const authHeader = req.headers.authorization;
    if (!authHeader) {
        const err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
        return;
    }

    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];*/
    const user = req.headers.email;
    const pass = CryptoAES.decrypt(req.headers.password, user).toString(CryptoENC)
    User.findOne({
        email: user
    })
        .then((userDB) => {
            //console.log(userDB)
            //console.log(CryptoAES.decrypt(userDB.password, userDB.email).toString(CryptoENC))
            if(CryptoAES.decrypt(userDB.password, userDB.email).toString(CryptoENC) === pass) {
                req.user = userDB;
                //console.log('nextfunction')
                next()
            } else {
                const err = new Error('You are not authenticated!');
                res.setHeader('WWW-Authenticate', 'Basic');
                err.status = 401;
                next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
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