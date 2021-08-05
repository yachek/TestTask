const cache = require('node-cache')

exports.users = new cache()
exports.toDoList = new cache()