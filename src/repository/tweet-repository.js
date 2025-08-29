import Tweet from'../models/tweet.js'
import CrudRepository from './crud-repository.js'


class TweetRepository extends CrudRepository
{
    constructor() {
    super(Tweet)
   }
   
    async create(data)
    {
        try {
            const tweet = await Tweet.create(data)
            return tweet
        } catch (error) {
            console.log(error)
        }
    }

    async getwithComments(id)
    {
        try {
            const tweet = await Tweet.findById(id).populate({path:'comments'
        ,populate:{
            path:'comments'
        }}).lean() //comments attribute of model
            return tweet  //we use lean to get js object other than mongoosh object.its an optimisation
        } catch (error) {
            console.log(error)
        }
    }
    async getAll(offset,limit)
    {
        try {
            const tweet = await Tweet.find().skip(offset).limit(limit)
            return tweet   //offset to how much to skip and limit how much to get(no.of values we want)
        } catch (error) {
            console.log(error)
        }
    }

    async getRecent(limit = 20) {
        try {
            const tweets = await Tweet.find().sort({ createdAt: -1 }).limit(limit)
            return tweets
        } catch (error) {
            console.log(error)
        }
    }

    async find(id)
    {
        try {
            const tweet = await Tweet.findById(id).populate({path:'likes'})  //give mongoose query object as it is present in mongo db 
             return tweet                                                     //populate function is mongoose funtion work only on mongoose object 
        } catch (error) {
            console.log(error)
        }
    }
}

export default TweetRepository