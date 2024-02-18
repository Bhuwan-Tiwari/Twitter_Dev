const mongoose = require('mongoose')

const commentschema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    onModel: {
        type: String,
        require: true,
        enum: ['Tweet', 'comment']   //if we have to reffer more than on model we use enum other than ref
    },
    commentable: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        refPath: 'onModel' //ref to model id    
        //it ref model id to which model it belongs              //refers the value
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',   //reffer to userid
        required: true
    }
}, { timestamps: true })

const Comment = mongoose.model("Comment", commentschema)
module.exports = Comment