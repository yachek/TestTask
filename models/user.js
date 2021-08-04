const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    firstName: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    lastName: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    age: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: 14
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User