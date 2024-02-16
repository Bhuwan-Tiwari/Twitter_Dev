import express from'express'
import {connect} from'./config/database.js'
const app = express()

import TweetService from './services/tweet-service.js'


app.listen(3000, async () => {
    console.log('Server started')
    await connect();//connecting to the database
    console.log('Mongodb connected')
    const tweetservice= new TweetService()
    const tweet = await tweetservice.create({content :'we arre in the fake world everyone is #FAke playing  #mInd game'})
   console.log(tweet)
    
})   