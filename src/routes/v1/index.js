import express from "express"

import {createTweet} from "../../controller/tweet-controller.js"
import { toggleLike } from "../../controller/like-controller.js"
const router = express.Router()

router.post('/tweets',createTweet)
router.post('/likes/toggle',toggleLike)
export default router