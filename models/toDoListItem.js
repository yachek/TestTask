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
    }
})

const ToDoListItem = mongoose.model('ToDoListItem', toDoListItemSchema);

module.exports = ToDoListItem