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

export default TweetRepository