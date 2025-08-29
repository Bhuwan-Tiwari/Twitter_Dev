import Hashtag from '../models/hashtags.js'


class HashtagRepository
{
    async create(data)
    {
        try {
            const tag = await Hashtag.create(data)
            return tag
        } catch (error) {
            console.log(error)
        }
    }

    async bulkcreate(data)
    {
        try {
            const tags = await Hashtag.insertMany(data)
            return tags
        } catch (error) {
            console.log(error)
        }
    }


    async get(id)
    {
        try {
            const tag = await Hashtag.findById(id)
            return tag
        } catch (error) {
            console.log(error)
        }
    }
   
    async destroy(id)
    {
        try {
            const tag = await Hashtag.findByIdAndDelete(id)
            return tag
        } catch (error) {
            console.log(error)
        }
    }

    async findByName(titleList)
    {
        try {
            const tags = await Hashtag.find({
                title:titleList
            })                   //.select('title -_id')
           return tags
        } catch (error) {
            console.log(error)
        }
    }
    
    async getTrending(limit = 10) {
        try {
            // trending by number of tweets referencing the tag
            const tags = await Hashtag.aggregate([
                { $project: { title: 1, count: { $size: { $ifNull: ['$tweets', []] } } } },
                { $sort: { count: -1 } },
                { $limit: limit }
            ])
            return tags
        } catch (error) {
            console.log(error)
        }
    }
    
}

export default HashtagRepository