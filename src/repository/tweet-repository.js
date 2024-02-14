const Tweet = require('../models/tweet')


class TweetRepository
{
    async create(data)
    {
        try {
            const tweet = await Tweet.create(data)
            return tweet
        } catch (error) {
            console.log(error)
        }
    }

    async get(id)
    {
        try {
            const tweet = await Tweet.findById(id)
            return tweet
        } catch (error) {
            console.log(error)
        }
    }
   
    async destroy(id)
    {
        try {
            const tweet = await Tweet.findByIdAndDelete(id)
            return tweet
        } catch (error) {
            console.log(error)
        }
    }
    async getwithComments(id)
    {
        try {
            const tweet = await Tweet.findById(id).populate({path:'comments'}).lean() //comments attribute of model
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
}

module.exports=TweetRepository