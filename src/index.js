const express = require('express')
const connect = require('./config/database')
const app = express()

const TweetService=require('./services/tweet-service')


app.listen(3000, async () => {
    console.log('Server started')
    await connect();//connecting to the database
    console.log('Mongodb connected')
    const tweetservice= new TweetService()
    const tweet = await tweetservice.create({content :'India is going to be in #technology  #mind ,it is going to be #fun '})
   console.log(tweet)
    
})   