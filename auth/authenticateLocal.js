const storage = require('../localMemory')
const CryptoAES = require("crypto-js/aes");
const CryptoENC = require("crypto-js/enc-utf8");

exports.auth = (req, res, next) => {
    const user = req.headers.email;
    const pass = CryptoAES.decrypt(req.headers.password, user).toString(CryptoENC)
    if (storage.users.has(user)) {
        const userLocal = storage.users.get(user);
        if (CryptoAES.decrypt(userLocal.password, user).toString(CryptoENC) === pass) {
            console.log('PASSWORD OK')
            req.user = userLocal
            next()
        } else {
            next(new Error('You are not authorization!'))
        }
    } else {
        next(new Error('You are not authorization!'))
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