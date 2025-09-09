import express from'express'
import cors from 'cors'
import {connect} from'./config/database.js'
import apiRoutes from './routes/index.js'
import bodyParser  from 'body-parser'
import { passportAuth } from './config/jwt-middleware.js'
import passport  from 'passport'


const app = express()
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200
  }
  
  app.use(cors(corsOptions))
  
 app.options('*', cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.use(passport.initialize())
passportAuth(passport)

app.use('/api',apiRoutes)

app.listen(3000, async () => {
    console.log('Server started')
    await connect();
    console.log('Mongodb connected')
    })   