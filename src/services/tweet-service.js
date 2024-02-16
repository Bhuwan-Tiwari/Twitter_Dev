import {TweetRepository,HashtagRepository} from '../repository/index.js'
//here we are exporting like an object thats y we are getting it like an object
class TweetService{
    constructor()
    {
        this.tweetRepository = new  TweetRepository();
        this.hashtagRepository = new HashtagRepository()
    }

   async create(data)
    {
        const content =data.content
        let tags = content.match(/#[a-zA-Z0-9_]+/g)   //this regex extract hashtags #bhuwan
        tags= tags.map((tag)=>tag.substring(1))//bhuwan #remove
        .map(tag=>tag.toLowerCase())      //lower case them
        console.log(tags)
        const tweet = await this.tweetRepository.create(data)
        let alreadyPresentTags= await this.hashtagRepository.findByName(tags)
        console.log(' already present tag ',alreadyPresentTags)
       let titlealreadyPresentTags = alreadyPresentTags.map((tag)=>tag.title)  //[title :'excited']->['excited]
        console.log('title already present tag ',titlealreadyPresentTags)
        let newTags = tags.filter(tag =>!titlealreadyPresentTags.includes(tag));//array of string of tags
        console.log(' not present tag ',newTags)
        newTags = newTags.map(tag=>{
            return {title :tag, tweets :[tweet.id]}
        })
       await this.hashtagRepository.bulkcreate(newTags)
       alreadyPresentTags.forEach((tag)=>{
        tag.tweets.push(tweet.id)
        tag.save()
    }) 
       
       return tweet
    }
}
export default TweetService


/*
//when we create hashtag we have to pass it like[{tile :'excited',tweets:[]}]

1.bulcreate in mongosse model
2.filter title of hashtag based on multiple tags
3.how to add tweet id inside all the hashtags
*/ 