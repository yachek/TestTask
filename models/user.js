const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
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
    isAdmin: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User