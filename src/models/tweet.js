import mongoose from 'mongoose'

const tweetschema = new mongoose.Schema({
    content: {
        type: String,
        required :true,
        max:[250,'Tweet cannot be more than 250 characters']
    },
  hashtags:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Hashtag"
  }
]
},{timestamps: true})

const Tweet = mongoose.model("Tweet", tweetschema)
export default Tweet