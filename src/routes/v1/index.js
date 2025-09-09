import express from "express"

import {createTweet, deleteTweet, updateTweet} from "../../controller/tweet-controller.js"
import { getFeed } from "../../controller/tweet-controller.js"
import { getTweet } from "../../controller/tweet-controller.js"
import { toggleLike } from "../../controller/like-controller.js"
import {createComment, deleteComment, updateComment} from "../../controller/comment-controller.js"
import { signup,login, getMe} from "../../controller/auth-controller.js"
import {authenticate} from '../../middlewares/authenticate.js'

const router = express.Router()

router.post('/tweets',authenticate,createTweet)
router.delete('/tweets/:id',authenticate,deleteTweet)
router.patch('/tweets/:id',authenticate,updateTweet)
router.get('/feed',getFeed)
router.get('/tweets/:id',getTweet)
router.post('/likes/toggle',authenticate,toggleLike)
router.post('/comments',authenticate,createComment)
router.delete('/comments/:id',authenticate,deleteComment)
router.patch('/comments/:id',authenticate,updateComment)
router.get('/me',authenticate,getMe)
router.post('/signup',signup)
router.post('/login',login)
export default router