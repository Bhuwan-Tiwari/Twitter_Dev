const express = require('express')
const connect = require('./config/database')

const app = express()

const TweetRepository = require('./repository/tweet-repository')
const Comment = require('./models/comment')

app.listen(3000, async () => {
    console.log('Server started')
    await connect();//connecting to the database
    console.log('Mongodb connected')

    // const tweet = await Tweet.create({
    //     content: 'secound  tweet',
    //     userEmail:'b@MediaList.com'})

    // const tweets = await Tweet.find({userEmail :'a@b.com'})
    // const tweets = await Tweet.find({userEmail :'a@b.com'})
    //  const tweets = await Tweet.findById('65c9c23d07150a6521560319')
   //tweet.userEmail='lm@kit.com'
   //await  tweet.save()
              const tweetrepo = new TweetRepository();
            //   const tweet = await tweetrepo.create({content :"testing tweet"})
            //   tweet.comments.push({content :'working'})
            //   console.log(tweet)
            //   await tweet.save()
            //    console.log(tweet)
// const tweet = await tweetrepo.create({content :"tweet with comment schema 2"})
// console.log(tweet)
// const comment = await Comment.create({content :'new comment 3 that take comment as object'})
//  tweet.comments.push(comment)
//  await tweet.save()

const tweet = await tweetrepo.getwithComments('65ca0323df2bb2aab9b51bfa')
 console.log(tweet) 


})   