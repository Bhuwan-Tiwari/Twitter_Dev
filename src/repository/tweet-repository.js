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
    async update(id,data)
    {
        try {
            const tweet = await Tweet.findByIdAndUpdate(id,data)
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
            const tweet = await Tweet.findById(id).populate({path:'comments'})  //comments attribute of model
            return tweet
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports=TweetRepository