const mongoose = require('mongoose')

const toDoListItemSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    description: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    time: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    done: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    }
})

const toDoListSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    description: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    itemsArr: [toDoListItemSchema]
})

const ToDoList = mongoose.model('ToDoList', toDoListSchema);

module.exports = ToDoList