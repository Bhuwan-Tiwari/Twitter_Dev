import express from "express"

import {createTweet} from "../../controller/tweet-controller.js"
import { getFeed } from "../../controller/tweet-controller.js"
import { getTweet } from "../../controller/tweet-controller.js"
import { toggleLike } from "../../controller/like-controller.js"
import {createComment  } from "../../controller/comment-controller.js"
import { signup,login} from "../../controller/auth-controller.js"
import {authenticate} from '../../middlewares/authenticate.js'

const router = express.Router()

router.post('/tweets',authenticate,createTweet)
router.get('/feed',getFeed)
router.get('/tweets/:id',getTweet)
router.post('/likes/toggle',authenticate,toggleLike)
router.post('/comments',authenticate,createComment)
router.post('/signup',signup)
router.post('/login',login)
export default router