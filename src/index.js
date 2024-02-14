const express = require('express')
const connect = require('./config/database')
const app = express()

const TweetService=require('./services/tweet-service')
const TweetRepository = require('./repository/tweet-repository')
const Comment = require('./models/comment')

app.listen(3000, async () => {
    console.log('Server started')
    await connect();//connecting to the database
    console.log('Mongodb connected')
    const tweetservice = new TweetService()
    
})   