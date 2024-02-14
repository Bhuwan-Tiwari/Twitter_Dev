const {TweetRepository}= require('../repository/index')

class TweetService{
    constructor()
    {
        this.tweetRepository = new  TweetRepository();
    }

   async create(data)
    {
        const content =data.content
        let tags = content.match(/#[a-zA-Z0-9_]+/g)   //this regex extract hashtags #bhuwan
        tags= tags.map((tag)=>tag.substring(1))      //bhuwan
        
        const tweet = await this.tweetRepository.create(data)
        
    }
}
module.exports= TweetService


/*
1.bulcreate in mongosse model
2.filter title of hashtag based on multiple tags
3.how to add tweet id inside all the hashtags
*/ 