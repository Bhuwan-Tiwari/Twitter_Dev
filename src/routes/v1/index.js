import express from "express"

import {createTweet} from "../../controller/tweet-controller.js"
import { toggleLike } from "../../controller/like-controller.js"
import {createComment  } from "../../controller/comment-controller.js"
import { signup } from "../../controller/auth-controller.js"

const router = express.Router()

router.post('/tweets',createTweet)
router.post('/likes/toggle',toggleLike)
router.post('/comments',createComment)
router.post('/signup',signup)
export default router