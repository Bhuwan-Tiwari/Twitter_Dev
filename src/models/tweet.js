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

tweetschema.pre('save',function(next)
{
    console.log('Inside a hook ')
    this.content = this.content + '.....'
    next()
})


const Tweet = mongoose.model("Tweet", tweetschema)
module.exports = Tweet