const mongoose = require('mongoose')

const tweetschema = new mongoose.Schema({
    content: {
        type: String,
        required :true
    },
    userEmail: {
        type: String
    },
    comments:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }
]
},{timestamps: true})

tweetschema.virtual('contentwithEmail').get(function process(){
    return  this.content + "\n" + this.userEmail
})


const Tweet = mongoose.model("Tweet", tweetschema)
module.exports = Tweet