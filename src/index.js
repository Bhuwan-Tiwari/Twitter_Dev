import express from'express'
import {connect} from'./config/database.js'
import apiRoutes from './routes/index.js'
import bodyParser  from 'body-parser'
import { passportAuth } from './config/jwt-middleware.js'
import passport  from 'passport'


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.use(passport.initialize())
passportAuth(passport)

app.use('/api',apiRoutes)

app.listen(3000, async () => {
    console.log('Server started')
    await connect();//connecting to the database
    console.log('Mongodb connected')
    
//     const  tweetrepo=new TweetRepository()
//    const users = await user.find()
//    const tweets = await tweetrepo.getAll(0,10)
//    const likeservice = new LikeService()
//    const response = await  likeservice.toggleLike(tweets[0].id,'Tweet',users[0].id)
//    console.log("response from index.js",response)

})   